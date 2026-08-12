import type { Metadata } from "next";
import { Fraunces, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quão improvável é o acaso? · Probabilidade",
  description:
    "Apresentação interativa de probabilidade: encontros, xadrez, War, Bayes e Monte Carlo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-hidden bg-ink text-cream">{children}</body>
    </html>
  );
}
