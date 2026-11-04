import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Public: next open group-education session (date labels, deadline, seats
// left). Used by the group program page and validated again server-side at
// checkout. The client (Nikolina) edits sessions through the platform admin.
export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("group_education_sessions")
    .select(
      "id, dates_label_hr, dates_label_en, starts_on, enrollment_deadline, total_seats, seats_taken, is_open, show_popup"
    )
    .eq("is_open", true)
    .gte("starts_on", new Date().toISOString().slice(0, 10))
    .order("starts_on", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("group-session fetch failed:", error);
    return NextResponse.json({ session: null }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ session: null });
  }

  const seatsLeft = Math.max(0, data.total_seats - data.seats_taken);
  const deadlinePassed =
    new Date(data.enrollment_deadline + "T23:59:59") < new Date();

  return NextResponse.json({
    session: {
      id: data.id,
      datesLabelHr: data.dates_label_hr,
      datesLabelEn: data.dates_label_en,
      enrollmentDeadline: data.enrollment_deadline,
      totalSeats: data.total_seats,
      seatsLeft,
      open: data.is_open && !deadlinePassed && seatsLeft > 0,
      // Pop-up na webu: pali se u adminu, a prikazuje samo dok je upis
      // stvarno moguć (otvoren termin, ima mjesta, rok nije prošao)
      showPopup:
        data.show_popup === true &&
        data.is_open &&
        !deadlinePassed &&
        seatsLeft > 0,
    },
  });
}
