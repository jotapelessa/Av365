import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Toaster } from "sonner";
import "./globals.css";
import "../styles/main.scss";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "EggTrack | AgroVantagem 365",
  description: "Plataforma de gestão inteligente para o agronegócio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" className={`${inter.variable} ${roboto.variable}`} suppressHydrationWarning>
        <body>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <Toaster position="bottom-right" richColors expand={false} />
        </body>
      </html>
    </ClerkProvider>
  );
}
