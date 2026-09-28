import { FAQS } from "@/lib/mock-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FaqSection() {
  return (
    <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 mb-3">
          <HelpCircle className="size-3.5" />
          Pusat Bantuan
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Jawaban praktis seputar persyaratan, jadwal, dan aturan pelaksanaan magang siswa.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-6 sm:p-8 shadow-sm dark:shadow-xl">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {FAQS.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-slate-100 dark:border-white/10 pb-2 last:border-b-0"
            >
              <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300 text-sm sm:text-base cursor-pointer">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
