import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import { SSRProgressBar } from "@/components/shared/ssr-progress-bar";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Portal PKL Digital | SMKN 6 Malang",
    template: "%s | PKL SMKN 6 Malang",
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/svg',
      sizes: '32x32',
      url: '/favicon.svg',
    },
  ],
  description:
    "Sistem Informasi Praktik Kerja Lapangan Digital SMKN 6 Malang — Eksplorasi mitra industri, pendaftaran tempat PKL, dan panduan magang terintegrasi.",
  keywords: [
    "PKL SMKN 6 Malang",
    "Magang SMK Malang",
    "Praktik Kerja Lapangan",
    "SMK Pusat Keunggulan",
    "Mitra Industri SMK",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SSRProgressBar delayMs={250} />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthSessionProvider>{children}</AuthSessionProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
