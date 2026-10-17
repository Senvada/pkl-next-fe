"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, User, Mail, MessageSquare } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-6 sm:p-8 lg:p-10 shadow-sm dark:shadow-2xl">
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
        Kirim Pesan ke Tim Hubin
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-8">
        Punya pertanyaan seputar tempat magang, pengajuan surat pengantar, atau tawaran kemitraan industri baru?
      </p>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-bounce">
            <CheckCircle2 className="size-8" />
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
            Pesan Berhasil Terkirim!
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm">
            Terima kasih telah menghubungi kami. Tim Hubin SMKN 6 Malang akan merespons pesanmu melalui email secepatnya.
          </p>
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: "", email: "", subject: "", message: "" });
            }}
            variant="outline"
            className="mt-4 border-slate-200 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
          >
            Kirim Pesan Lainnya
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="size-3.5 text-blue-600 dark:text-blue-400" /> Nama Lengkap
              </label>
              <Input
                required
                type="text"
                placeholder="Contoh: Ahmad Rizky"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl h-11"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="size-3.5 text-blue-600 dark:text-blue-400" /> Alamat Email
              </label>
              <Input
                required
                type="email"
                placeholder="nama@siswa.smkn6malang.sch.id"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl h-11"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subjek Pertanyaan
            </label>
            <Input
              type="text"
              placeholder="Contoh: Pertanyaan Kuota PKL PT Nusantara Tech"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl h-11"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="size-3.5 text-blue-600 dark:text-blue-400" /> Isi Pesan
            </label>
            <Textarea
              required
              rows={4}
              placeholder="Tuliskan kendala atau pertanyaanmu dengan jelas di sini..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl resize-none"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-[background-color,transform,box-shadow] duration-150 ease-out cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Send className="size-4" />
            Kirim Pesan
          </Button>
        </form>
      )}
    </div>
  );
}
