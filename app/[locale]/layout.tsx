import type { Metadata, Viewport } from "next";
import "flatpickr/dist/flatpickr.min.css";
import "@/section-h/common/css/satoshi.css";
import "@/section-h/common/css/style.css";
import { ReactNode } from "react";
import initTranslations from "@/initTranslations";
import ClientLayout from "./LayoutClient";



export const metadata: Metadata = {
  applicationName: "School",
  description: "School System",
  manifest: "/api/manifest",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};


export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {

  const { t, resources } = await initTranslations(locale, ["common", "home", "student"]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientLayout locale={locale} resources={resources}>
          {children}
        </ClientLayout>
      </body>
    </html>

  );
}