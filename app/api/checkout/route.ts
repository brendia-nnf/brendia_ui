import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import {
  getCourse,
  calculatePricing,
  calculateDepositPricing,
} from "@/lib/constants/courses";
import {
  generateOrderNumber,
  createCourseCheckoutSession,
  allowedInstallmentCounts,
  installmentAmount,
  type PaymentPlan,
} from "@/lib/stripe";
import {
  isPredracunMode,
  getOrderNotificationsEmail,
  generatePredracunEmailHtml,
  generateOrderNotificationEmailHtml,
} from "@/lib/predracun";
import { isMonriMode, buildMonriFormData, MONRI_CONFIG } from "@/lib/monri";
import { generateContractPdf } from "@/lib/contract/pdf";
import { getCountryName } from "@/lib/countries";

// Use service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CheckoutRequest {
  courseId: string;
  // Personal info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Billing address
  street: string;
  city: string;
  postalCode: string;
  country: string;
  // OIB (required for HR buyers — goes into the contract)
  oib?: string;
  // Company details (optional)
  companyName?: string;
  vatNumber?: string;
  // Marketing
  hearAboutUs?: string;
  // Terms
  acceptTerms: boolean;
  acceptMarketing: boolean;
  // Obavezna kvačica (online programi): trenutna aktivacija digitalnog
  // sadržaja i gubitak prava na jednostrani raskid — bilježi se uz narudžbu
  digitalActivationConsent?: boolean;
  // Obavezna kvačica (predujam za edukacije uživo): uvjeti rezervacije
  reservationTermsAccepted?: boolean;
  // Contract acceptance (required for online course purchases)
  contractAccepted: boolean;
  signatureDataUrl?: string;
  // Payment plan (installments are feature-flagged; validated server-side)
  paymentPlan?: PaymentPlan;
  installmentCount?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    const {
      courseId,
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      postalCode,
      country,
      oib,
      companyName,
      vatNumber,
      hearAboutUs,
      acceptTerms,
      acceptMarketing,
      digitalActivationConsent,
      reservationTermsAccepted,
      contractAccepted,
      signatureDataUrl,
      paymentPlan: requestedPlan,
      installmentCount: requestedCount,
    } = body;

    // Validate required fields
    if (
      !courseId ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !street ||
      !city ||
      !postalCode ||
      !country
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!acceptTerms) {
      return NextResponse.json(
        { error: "You must accept the terms and conditions" },
        { status: 400 }
      );
    }

    if (country === "HR" && !/^\d{11}$/.test(oib || "")) {
      return NextResponse.json(
        { error: "OIB je obavezan za kupce iz Hrvatske (11 znamenki)" },
        { status: 400 }
      );
    }

    // Get course data
    const course = getCourse(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Programi uživo plaćaju se predujmom od 30 % (rezervacija); online
    // program ide u punom iznosu.
    const isDeposit = course.purchase !== "direct";

    // The education contract must be accepted and signed for online course
    // purchases (deposit reservations are confirmed without the online
    // education contract).
    if (
      !isDeposit &&
      (!contractAccepted || !signatureDataUrl?.startsWith("data:image/png;base64,"))
    ) {
      return NextResponse.json(
        { error: "Ugovor mora biti prihvaćen i potpisan" },
        { status: 400 }
      );
    }

    // Obavezna kvačica: bez pristanka na trenutnu aktivaciju digitalnog
    // sadržaja plaćanje online programa nije moguće (čl. 79. ZZP).
    if (!isDeposit && !digitalActivationConsent) {
      return NextResponse.json(
        {
          error:
            "Za kupnju online edukacije potreban je pristanak na trenutnu aktivaciju digitalnog sadržaja",
        },
        { status: 400 }
      );
    }

    if (isDeposit && !reservationTermsAccepted) {
      return NextResponse.json(
        { error: "Potrebno je prihvatiti uvjete rezervacije" },
        { status: 400 }
      );
    }

    // Grupna edukacija: provjeri da postoji otvoren termin sa slobodnim
    // mjestima i da rok za upis nije prošao (mjesto se zauzima tek nakon
    // uspješne uplate predujma).
    let groupSessionId: string | null = null;
    if (course.id === "artist-group") {
      const today = new Date().toISOString().slice(0, 10);
      const { data: session } = await supabase
        .from("group_education_sessions")
        .select("id, total_seats, seats_taken, enrollment_deadline, is_open")
        .eq("is_open", true)
        .gte("starts_on", today)
        .order("starts_on", { ascending: true })
        .limit(1)
        .maybeSingle();

      const seatsLeft = session
        ? session.total_seats - session.seats_taken
        : 0;
      const deadlinePassed = session
        ? new Date(session.enrollment_deadline + "T23:59:59") < new Date()
        : true;

      if (!session || seatsLeft <= 0 || deadlinePassed) {
        return NextResponse.json(
          {
            error:
              "Upis u grupnu edukaciju trenutno nije moguć (termin je popunjen ili je rok za upis prošao).",
          },
          { status: 409 }
        );
      }
      groupSessionId = session.id;
    }

    const depositPricing = calculateDepositPricing(course.price);
    const pricing = isDeposit
      ? {
          subtotal: depositPricing.subtotal,
          vat: depositPricing.vat,
          total: depositPricing.total,
          vatRate: depositPricing.vatRate,
          vatPercentage: depositPricing.vatPercentage,
        }
      : calculatePricing(course.price);
    const customerName = `${firstName} ${lastName}`;

    // Installments must be enabled globally AND per-course, and the chosen
    // count must be one the course offers — never trust the client alone.
    // U Monri modu vlastite rate ne postoje (kupac ih bira na Monri formi),
    // pa je narudžba uvijek "full".
    const installmentCount =
      !isMonriMode() &&
      requestedPlan === "installments" &&
      allowedInstallmentCounts(course).includes(Number(requestedCount))
        ? Number(requestedCount)
        : null;
    const paymentPlan: PaymentPlan = installmentCount ? "installments" : "full";

    // Generate unique order number
    let orderNumber = generateOrderNumber();

    // Ensure order number is unique (retry if collision)
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from("orders")
        .select("id")
        .eq("order_number", orderNumber)
        .single();

      if (!existing) break;
      orderNumber = generateOrderNumber();
      attempts++;
    }

    // Save order to Supabase with pending status
    const { error: dbError } = await supabase.from("orders").insert({
      // Order number (BP-YYMMDD-XXXX)
      order_number: orderNumber,
      // Personal info
      customer_name: customerName,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      // Billing address
      street,
      city,
      postal_code: postalCode,
      country,
      // Company details
      company_name: companyName || null,
      vat_number: vatNumber || null,
      // Marketing
      hear_about_us: hearAboutUs || null,
      // Course details
      course_id: course.id,
      course_name: course.name,
      // Pricing
      subtotal: pricing.subtotal,
      vat_amount: pricing.vat,
      vat_rate: pricing.vatRate,
      amount: pricing.total,
      currency: course.currency,
      // Status
      status: "pending",
      // Payment plan (installment details are finalized by the webhook)
      payment_plan: paymentPlan,
      installments_total: installmentCount,
      installment_amount: installmentCount
        ? installmentAmount(pricing.total, installmentCount)
        : null,
      // Predujam za edukacije uživo (30 % bruto cijene programa)
      payment_type: isDeposit ? "deposit" : "full",
      program_price: isDeposit ? depositPricing.programTotal : null,
      group_session_id: groupSessionId,
      reservation_terms_accepted: isDeposit ? true : false,
      // Terms
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      marketing_accepted: acceptMarketing,
      // Pristanak na trenutnu aktivaciju digitalnog sadržaja (online)
      digital_activation_consent: !isDeposit,
      digital_activation_consent_at: !isDeposit ? new Date().toISOString() : null,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Generate the signed contract PDF and archive it in the private
    // "contracts" bucket. The contract is part of the legal record — if this
    // fails we abort the order rather than proceed unsigned.
    const signedAtIso = new Date().toISOString();
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    let contractPdf: Uint8Array | null = null;
    if (!isDeposit) {
    try {
      contractPdf = await generateContractPdf({
        fullName: customerName,
        street,
        city,
        postalCode,
        country: getCountryName(country),
        oib: oib || "",
        email,
        orderNumber,
        courseName: course.name,
        ipAddress,
        signedAtIso,
        signatureDataUrl: signatureDataUrl!,
      });

      const { error: uploadError } = await supabase.storage
        .from("contracts")
        .upload(`${orderNumber}.pdf`, Buffer.from(contractPdf), {
          contentType: "application/pdf",
          upsert: true,
        });
      if (uploadError) {
        console.error("Contract upload failed:", uploadError);
      }
    } catch (contractError) {
      console.error("Contract PDF generation failed:", contractError);
      await supabase.from("orders").delete().eq("order_number", orderNumber);
      return NextResponse.json(
        { error: "Failed to generate contract" },
        { status: 500 }
      );
    }
    }

    // Predračun mode: card payments are paused —
    // email the customer a predračun with bank-transfer details and notify
    // the admin. The order stays "pending" until the payment is confirmed
    // via /api/admin/confirm-payment.
    if (isPredracunMode()) {
      const predracunOrder = {
        orderNumber,
        customerName,
        email,
        phone,
        street,
        city,
        postalCode,
        country,
        companyName: companyName || null,
        vatNumber: vatNumber || null,
        courseName: isDeposit ? `${course.name} (predujam 30 %)` : course.name,
        subtotal: pricing.subtotal,
        vat: pricing.vat,
        total: pricing.total,
      };

      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail =
          process.env.RESEND_FROM_EMAIL || "Brendia Pro <info@brendiapro.hr>";

        const attachments = contractPdf
          ? [
              {
                filename: `Ugovor-${orderNumber}.pdf`,
                content: Buffer.from(contractPdf).toString("base64"),
              },
            ]
          : [];

        try {
          await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: `Predračun za narudžbu ${orderNumber} - Brendia Pro®`,
            html: generatePredracunEmailHtml(predracunOrder),
            attachments,
          });
        } catch (emailError) {
          console.error("Failed to send predračun email:", emailError);
          return NextResponse.json(
            { error: "Failed to send predračun email" },
            { status: 500 }
          );
        }

        try {
          await resend.emails.send({
            from: fromEmail,
            to: getOrderNotificationsEmail(),
            subject: `Nova narudžba ${orderNumber} — ${course.name} (predračun)`,
            html: generateOrderNotificationEmailHtml(predracunOrder),
            attachments,
          });
        } catch (emailError) {
          // Customer already got their predračun — log and continue
          console.error("Failed to send order notification:", emailError);
        }
      }

      return NextResponse.json({ predracun: true, orderNumber });
    }

    // Monri mode (preview deploy za OTP pregled): cijeli checkout ide kroz
    // Monri v2 form redirect — jednokratno kao purchase, rate kroz
    // number_of_installments. Klijent auto-submita vraćene form podatke.
    if (isMonriMode()) {
      const monriFormData = buildMonriFormData({
        orderNumber,
        amount: pricing.total, // Total with VAT in cents
        currency: course.currency.toUpperCase(),
        customerName,
        email,
        phone,
        address: street,
        city,
        postalCode,
        country,
        orderInfo: isDeposit
          ? `${course.name} (predujam 30%) - Brendia Pro`
          : `${course.name} - Brendia Pro`,
        customData: JSON.stringify({
          courseId: course.id,
          companyName: companyName || null,
          vatNumber: vatNumber || null,
        }),
        language: "hr",
        // Bez number_of_installments: Monri forma sama nudi dostupne rate
        // prema merchant profilu i kartici kupca (bankovne rate).
      });

      return NextResponse.json({
        formUrl: MONRI_CONFIG.formUrl,
        formData: monriFormData,
        orderNumber,
      });
    }

    // Create the hosted Stripe Checkout Session and send the customer there
    const session = await createCourseCheckoutSession({
      orderNumber,
      course,
      totalCents: pricing.total, // Total with VAT in cents
      customerName,
      email,
      paymentPlan,
      installmentCount: installmentCount ?? undefined,
    });

    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("order_number", orderNumber);

    return NextResponse.json({
      url: session.url,
      orderNumber,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
