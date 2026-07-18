import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pixel-capsule.pages.dev"),
  title: {
    default: "Pixel Capsule | 무료 브라우저 이미지 도구",
    template: "%s | Pixel Capsule",
  },
  description:
    "이미지 크기 변경, 압축, 형식 변환과 웹용 프리셋을 브라우저에서 빠르게 처리하는 무료 이미지 도구입니다.",
  openGraph: {
    title: "Pixel Capsule",
    description:
      "빠른 이미지 변환과 작은 아이디어 캡슐을 제공하는 무료 브라우저 이미지 도구입니다.",
    url: "https://pixel-capsule.pages.dev",
    siteName: "Pixel Capsule",
    locale: "ko_KR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
