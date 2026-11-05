import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { AnalyticsProvider } from "@/app/components/analytics-provider";
import { SiteChrome } from "@/app/components/site-chrome";

const SITE_URL = "https://lattiz.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lattiz | Renta sitios web en segundos pruébalo gratis",
    template: "%s | Lattiz",
  },
  description:
    "Renta tu sitio web, aparece en Google y cancela cuando quieras. Dominio incluido, editor sin código y WhatsApp integrado. Sin agencias ni programadores.",
  applicationName: "Lattiz",
  keywords: [
    "lattiz",
    "página web para negocios",
    "rentar página web",
    "crear sitio web para mi negocio",
    "página web para barbería",
    "página web para restaurante",
    "página web para consultorio",
    "sitio web para negocio local",
    "rentar sitios web",
    "página web con dominio incluido",
    "página web con WhatsApp",
    "poner mi negocio en",
    "saas",
    "website builder",
    "website-as-a-service"
  ],
  authors: [{ name: "Lattiz", url: SITE_URL }],
  creator: "Lattiz",
  publisher: "Lattiz",
  category: "technology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Lattiz | Renta tu página web en segundos, pruébalo gratis",
    description:
      "Renta tu sitio web, aparece en Google y cancela cuando quieras. Todo incluido. Cancela cuando quieras. 1) Escoge un diseño, 2) Personalízalo y 3) Publica tu página web en segundos. Sin agencias ni programadores.",
    url: "/",
    siteName: "Lattiz",
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Lattiz — Página web para negocios locales en México",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lattiz | Renta tu página web en segundos, pruébalo gratis",
    description:
      "Renta tu sitio web, aparece en Google y cancela cuando quieras. Todo incluido. Cancela cuando quieras. 1) Escoge un diseño, 2) Personalízalo y 3) Publica tu página web en segundos. Sin agencias ni programadores.",
    images: ["/og.webp"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className="h-full bg-background antialiased"
    >
      <Analytics />
      <body className="min-h-full flex flex-col bg-foreground">
        <AnalyticsProvider />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}