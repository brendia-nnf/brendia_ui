import { Header, Footer } from "@/components/layout";
import { GroupPromoPopup } from "@/components/shared";
import { LenisProvider, GSAPProvider } from "@/providers";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LenisProvider>
      <GSAPProvider>
        <Header />
        <main>{children}</main>
        <Footer />
        {/* Pop-up termina grupne edukacije — pali se u adminu na platformi */}
        <GroupPromoPopup />
      </GSAPProvider>
    </LenisProvider>
  );
}
