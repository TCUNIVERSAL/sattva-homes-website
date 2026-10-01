import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader } from "next/font/google";
import { MotionProvider } from "@/lib/motion";
import { site, businessJsonLd, jsonLd } from "@/lib/site";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// Newsreader for headings and italic accents, Archivo for body text.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Brisbane Home Builder & House Designs · ${site.name}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `Brisbane Home Builder & House Designs · ${site.name}`,
    description: site.description,
    siteName: site.name,
    locale: "en_AU",
    type: "website",
    images: ["/images/home/hero-springdale.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0c1626",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${archivo.variable} ${newsreader.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(businessJsonLd)} />
        <MotionProvider>
          <Header />
          {children}
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
