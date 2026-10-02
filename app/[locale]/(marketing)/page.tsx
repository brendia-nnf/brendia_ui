import {
  Hero,
  ValueProposition,
  VideoIntro,
  CoursePreview,
  AboutFounder,
  AppDownload,
  CTA,
} from "@/components/sections";
import { OrganizationSchema, WebsiteSchema } from "@/components/shared";

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <Hero />
      <ValueProposition />
      <VideoIntro />
      <CoursePreview />
      <AboutFounder />
      <AppDownload />
      <CTA />
    </>
  );
}
