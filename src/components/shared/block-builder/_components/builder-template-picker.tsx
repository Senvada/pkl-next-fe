"use client";

import * as React from "react";
import { LayoutTemplate, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { STARTER_TEMPLATES } from "../starter-templates";
import type { StarterTemplate } from "../types";

interface BuilderTemplatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: StarterTemplate) => void;
  category?: "article" | "company" | "all";
}

export function BuilderTemplatePicker({
  isOpen,
  onClose,
  onSelect,
  category = "all",
}: BuilderTemplatePickerProps) {
  const filteredTemplates = React.useMemo(() => {
    if (category === "all") return STARTER_TEMPLATES;
    return STARTER_TEMPLATES.filter(
      (t) => t.category === category || t.category === "all"
    );
  }, [category]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <LayoutTemplate className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Pilih Starter Template
              </DialogTitle>
              <DialogDescription className="text-xs">
                Mulai cepat penulisan dengan struktur baku dan terorganisir
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onSelect(template);
                onClose();
              }}
              className="group relative flex flex-col justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {template.title}
                  </span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {template.blocks.length} blok
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {template.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-primary font-medium">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Gunakan Template
                </span>
                <span className="text-[11px] text-muted-foreground group-hover:text-primary transition-colors">
                  Terapkan &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground/80 text-center italic">
          Catatan: Menggunakan template akan mengganti susunan blok yang ada di canvas saat ini.
        </p>
      </DialogContent>
    </Dialog>
  );
}
