import type { Metadata, Viewport } from "next";
import { Archivo, Playfair_Display, Poppins } from "next/font/google";
import { LanguageProvider } from "@/i18n/LanguageProvider";

import "@/styles/base.css";
import "@/styles/header.css";
import "@/styles/works.css";
import "@/styles/project.css";
import "@/styles/pages.css";
import "@/styles/about.css";
import "@/styles/experience.css";
import "@/styles/contact.css";
import "@/styles/loader.css";

const sans = Archivo({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const mark = Poppins({ subsets: ["latin"], weight: ["600"], variable: "--font-mark", display: "swap" });

export const metadata: Metadata = {
  title: "Arthur Gabriel — portfólio",
  description:
    "Portfólio de Arthur Gabriel, estudante de Engenharia de Software na PUC Minas e desenvolvedor RPA em Belo Horizonte.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080808",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${serif.variable} ${mark.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
