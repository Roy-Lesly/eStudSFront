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
  params,
}: {
  children: ReactNode;
  params: any;
}) {

  const p = await params;

  const { t, resources } = await initTranslations(p.locale, ["common", "home", "student", "primary"]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientLayout locale={p.locale} resources={resources}>
          {children}
        </ClientLayout>
      </body>
    </html>

  );
}