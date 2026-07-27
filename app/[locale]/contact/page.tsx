import { notFound } from "next/navigation";

import { ContactPageV2 } from "@/components/pages/PortfolioPages";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ContactPageV2 locale={locale} />;
}
