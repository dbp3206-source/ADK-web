import { notFound } from "next/navigation";

import { RouteRedirect } from "@/components/layout/RouteRedirect";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <RouteRedirect to={`/${locale}/#profile`} />;
}
