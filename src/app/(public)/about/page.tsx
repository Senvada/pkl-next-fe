import type { Metadata } from "next";
import AboutHero from "./_components/about-hero";
import PklWorkflow from "./_components/pkl-workflow";
import SchoolProfile from "./_components/school-profile";
import FaqSection from "./_components/faq-section";
import { getPublicDepartments } from "@/services/public-api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tentang PKL | SMKN 6 Malang",
  description:
    "Pelajari tujuan, standar operasional, alur tahapan 5 langkah PKL, serta profil kejuruan unggulan SMKN 6 Malang.",
};

export default async function AboutPage() {
  const departments = await getPublicDepartments();

  return (
    <div className="flex flex-col">
      <AboutHero />
      <PklWorkflow />
      <SchoolProfile departments={departments} />
      <FaqSection />
    </div>
  );
}
