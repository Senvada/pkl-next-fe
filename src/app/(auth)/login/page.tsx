import type { Metadata } from "next";
import LoginShowcase from "./_components/login-showcase";
import LoginForm from "./_components/login-form";

export const metadata: Metadata = {
  title: "Masuk ke Akun | Portal PKL SMKN 6 Malang",
  description:
    "Masuk ke portal digital Praktik Kerja Lapangan (PKL) SMKN 6 Malang untuk monitoring magang, jurnal harian, dan administrasi kemitraan industri.",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-6xl mx-auto my-auto py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* Left Side: Branding & Feature Showcase */}
        <div className="hidden lg:flex lg:col-span-5 min-h-[580px]">
          <LoginShowcase />
        </div>

        {/* Right Side: Interactive Login Form */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
