"use client";

import { notFound } from "next/navigation";
import { Link, getPathname } from "@/i18n/routing";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { use } from "react";
import {
  Container,
  Button,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui";
import { CourseSchema, BreadcrumbSchema } from "@/components/shared";
import {
  PaymentMethodsBlock,
  MasterclassBlock,
  EducationKitBlock,
  HowToCertificateBlock,
  ValueOfSkillBlock,
  ProfessionalPurchaseBlock,
  GroupScheduleCard,
  useGroupSession,
  InquiryForm,
} from "@/components/sections";
import {
  getCourseByUrlSlug,
  calculateDepositPricing,
  formatPrice,
} from "@/lib/constants/courses";

interface CurriculumModule {
  module: string;
  lessons: string[];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pet programa nove ponude; URL slug (3.3) -> i18n ključ. Purchase tip
// dolazi iz lib/constants/courses.ts (lookup po urlSlug).
const slugToKey: Record<string, string> = {
  "artist-online": "online",
  "artist-online-uzivo": "onlineLive",
  "artist-grupna-edukacija": "group",
  "artist-1-na-1-jedan-dan": "oneDay",
  "artist-1-na-1-dva-dana": "twoDays",
};

export default function CoursePage({ params }: PageProps) {
  const { slug } = use(params);
  const t = useTranslations("courseDetail");
  const tNav = useTranslations("navigation");
  const { session, loaded } = useGroupSession();

  const courseKey = slugToKey[slug];
  const courseConfig = getCourseByUrlSlug(slug);
  if (!courseKey || !courseConfig) {
    notFound();
  }

  const purchase = courseConfig.purchase;
  const isGroup = courseKey === "group";
  const isLiveProgram = courseKey !== "online";
  // Programi s pristupom online edukaciji 36 mjeseci (zahtjev klijentice 5.11.)
  const hasOnlineAccess = ["online", "onlineLive", "twoDays"].includes(courseKey);

  const course = {
    title: t(`${courseKey}.title`),
    subtitle: t(`${courseKey}.subtitle`),
    price: t(`${courseKey}.price`),
    duration: t(`${courseKey}.duration`),
    description: t(`${courseKey}.description`),
    longDescription: t(`${courseKey}.longDescription`),
    forWho: t(`${courseKey}.forWho`),
    image: courseConfig.image,
    features: t.raw(`${courseKey}.features`) as string[],
    curriculum: t.raw(`${courseKey}.curriculum`) as CurriculumModule[],
  };

  const depositAmount = formatPrice(
    calculateDepositPricing(courseConfig.price).total
  );

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brendiapro.hr";
  const locale = useLocale() as "hr" | "en";
  const coursesPath = getPathname({ locale, href: "/courses" });
  const coursePath = getPathname({
    locale,
    href: { pathname: "/courses/[slug]", params: { slug } },
  });

  const groupCheckoutDisabled = isGroup && loaded && !session?.open;

  const primaryCta =
    purchase === "inquiry" ? (
      <a href="#inquiry">
        <Button size="lg" className="min-w-[200px]">
          {t("sendInquiry")}
        </Button>
      </a>
    ) : (
      <Link
        href={{ pathname: "/checkout/[slug]", params: { slug: courseConfig.id } }}
        className={groupCheckoutDisabled ? "pointer-events-none" : ""}
      >
        <Button
          size="lg"
          className="min-w-[200px]"
          disabled={groupCheckoutDisabled}
        >
          {isGroup ? t("reserveSpot") : t("enrollNow")}
        </Button>
      </Link>
    );

  return (
    <>
      <CourseSchema
        name={course.title}
        description={course.description}
        price={course.price}
        url={`${baseUrl}${coursePath}`}
        duration={course.duration}
      />
      <BreadcrumbSchema
        items={[
          { name: tNav("home"), url: baseUrl },
          { name: tNav("courses"), url: `${baseUrl}${coursesPath}` },
          { name: course.title, url: `${baseUrl}${coursePath}` },
        ]}
      />
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-cream">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 text-primary/60 hover:text-primary mb-6 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                {t("backToCourses")}
              </Link>

              <p className="text-secondary text-sm font-medium mb-2">
                {course.subtitle}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-primary mb-6">
                {course.title}
              </h1>
              <p className="text-lg text-primary/70 leading-relaxed mb-4">
                {course.longDescription}
              </p>
              <p className="text-primary/70 leading-relaxed mb-4">
                <span className="font-medium text-primary">
                  {t("forWhoLabel")}:
                </span>{" "}
                {course.forWho}
              </p>
              <p className="text-sm text-primary/50 mb-8">{course.duration}</p>

              <div className="flex items-end gap-6 mb-2">
                <p className="text-5xl font-heading text-primary">{course.price}</p>
              </div>
              <p className="text-sm text-primary/40 mb-8">
                {t("priceIncludesVat")}
              </p>

              {/* Rezervacija predujmom (grupna + svi programi uživo) */}
              {purchase !== "direct" && (
                <p className="text-sm text-primary/60 mb-8 max-w-xl">
                  {t("depositNote", { amount: depositAmount })}
                </p>
              )}

              {primaryCta}
            </div>

            <div className="space-y-6">
              <div className="relative aspect-[4/3]">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {isGroup && (
                <GroupScheduleCard session={session} loaded={loaded} />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* What's Included */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading text-primary mb-8 text-center">
              {t("whatsIncluded")}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {course.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-cream"
                >
                  <svg
                    className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-primary/80">{feature}</span>
                </div>
              ))}
            </div>
            {hasOnlineAccess && (
              <p className="text-sm text-primary/60 mt-6 text-center">
                {t("accessExtensionNote")}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Curriculum — skriveno dok program nema objavljen kurikulum */}
      {course.curriculum.length > 0 && (
      <section className="py-20 md:py-32 bg-cream">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-heading text-primary mb-4 text-center">
              {t("curriculum.title")}
            </h2>
            <p className="text-primary/60 text-center mb-12">
              {t("curriculum.description")}
            </p>

            <Accordion allowMultiple defaultOpen={["0"]}>
              {course.curriculum.map((module, index) => (
                <AccordionItem key={index} value={String(index)}>
                  <AccordionTrigger value={String(index)}>
                    <span className="text-lg font-heading">{module.module}</span>
                  </AccordionTrigger>
                  <AccordionContent value={String(index)}>
                    <ul className="space-y-2 pl-4">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li
                          key={lessonIndex}
                          className="flex items-center gap-3"
                        >
                          <svg
                            className="w-4 h-4 text-secondary flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </section>
      )}

      {/* Edukacije uživo: termin po dogovoru + model i kosa */}
      {isLiveProgram && (
        <section className="py-20 md:py-32 bg-cream">
          <Container>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
              {purchase === "inquiry" && (
                <div className="bg-white p-8 md:p-10">
                  <h3 className="text-2xl font-heading text-primary mb-4">
                    {t("inquiryBlock.title")}
                  </h3>
                  <p className="text-primary/70 leading-relaxed">
                    {t("inquiryBlock.content")}
                  </p>
                </div>
              )}
              <div className={`bg-white p-8 md:p-10 ${purchase !== "inquiry" ? "md:col-span-2" : ""}`}>
                <h3 className="text-2xl font-heading text-primary mb-4">
                  {t("modelHair.title")}
                </h3>
                <p className="text-primary/70 leading-relaxed">
                  {t("modelHair.content")}
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Kako do certifikata (online program) + Education Kit + Masterclass
          + Vrijednost vještine + Profesionalna kupnja + Načini plaćanja */}
      <section className="py-20 md:py-32 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto space-y-10">
            {courseKey === "online" && <HowToCertificateBlock />}
            <EducationKitBlock />
            <MasterclassBlock ns="courseDetail" />
            <div className="grid md:grid-cols-2 gap-10">
              <ValueOfSkillBlock />
              <ProfessionalPurchaseBlock />
            </div>
            <PaymentMethodsBlock ns="courseDetail" />
          </div>
        </Container>
      </section>

      {/* Upit za termin (1:1 programi i Online + uživo) */}
      {purchase === "inquiry" && (
        <section className="py-20 md:py-32 bg-cream" id="inquiry">
          <Container>
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-heading text-primary mb-4">
                  {t("inquiryForm.title")}
                </h2>
                <p className="text-primary/60">{t("inquiryForm.subtitle")}</p>
              </div>
              <div className="bg-white p-8">
                <InquiryForm programName={course.title} />
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 md:py-32 bg-primary text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-heading mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-white/70 mb-8">
              {t("cta.description")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {purchase === "inquiry" ? (
                <a href="#inquiry">
                  <Button variant="secondary" size="lg">
                    {t("sendInquiry")}
                  </Button>
                </a>
              ) : (
                <Link
                  href={{ pathname: "/checkout/[slug]", params: { slug: courseConfig.id } }}
                  className={groupCheckoutDisabled ? "pointer-events-none" : ""}
                >
                  <Button variant="secondary" size="lg" disabled={groupCheckoutDisabled}>
                    {isGroup ? t("reserveSpot") : t("cta.enrollIn", { course: course.title })}
                  </Button>
                </Link>
              )}
              <Link href="/contact">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10"
                >
                  {t("cta.haveQuestions")}
                </Button>
              </Link>
            </div>
            <p className="text-white/40 text-sm mt-8">
              {t("cta.paymentPlans")}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
