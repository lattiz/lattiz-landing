import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar"
import { SmoothScroll } from "./smooth-scroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const SITE_URL = "https://lattiz.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lattiz | Página web para tu negocio y aparece en Google",
    template: "%s | Lattiz",
  },
  description:
    "Crea la página web de tu negocio en minutos y aparece en Google. Dominio incluido, editor sin código y WhatsApp integrado. Sin agencias ni programadores.",
  applicationName: "Lattiz",
  keywords: [
    "lattiz",
    "página web para negocios",
    "crear página web",
    "crear sitio web para mi negocio",
    "página web para barbería",
    "página web para restaurante",
    "página web para consultorio",
    "sitio web para negocio local",
    "aparecer en Google",
    "página web con dominio incluido",
    "página web con WhatsApp",
    "negocios locales México",
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
    title: "Lattiz | La página web de tu negocio, lista en minutos",
    description:
      "Que te encuentren en Google, te escriban por WhatsApp y vean tu menú o servicios las 24 horas. Dominio incluido y sin programadores.",
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
    title: "Lattiz | La página web de tu negocio, lista en minutos",
    description:
      "Aparece en Google, recibe mensajes por WhatsApp y actualiza tu página cuando quieras. Dominio incluido.",
    images: ["/og.webp"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full bg-background antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>
          <Navbar />
          {children}
          <div
            aria-hidden="true"
            className="fixed bottom-0 left-0 right-0 z-50 h-14 pointer-events-none"
            style={{
              backdropFilter: "blur(1px)",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)",
            }}
          />
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}