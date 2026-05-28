import type { Metadata } from "next";
import {
  IBM_Plex_Mono,
  Press_Start_2P,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "My SECRETARY",
    template: "%s | My SECRETARY",
  },
  description:
    "뉴스와 시장 브리핑을 읽기 쉽게 정리해주는 목적별 인공지능 비서 대시보드입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${pressStart.variable}`}
    >
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-foreground)] antialiased">
        {children}
      </body>
    </html>
  );
}
