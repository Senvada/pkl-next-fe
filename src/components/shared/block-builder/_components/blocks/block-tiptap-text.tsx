"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Code, RemoveFormatting } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TextBlockData } from "../../types";

interface BlockTipTapTextProps {
  data: TextBlockData;
  onChange: (patch: Partial<TextBlockData>) => void;
  previewMode?: boolean;
}

export function BlockTipTapText({ data, onChange, previewMode = false }: BlockTipTapTextProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: (data.content as object) || {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
    },
    immediatelyRender: false,
    editable: !previewMode,
    onUpdate: ({ editor: currentEditor }) => {
      onChange({ content: currentEditor.getJSON() });
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none min-h-[60px] focus:outline-none focus:ring-0 leading-relaxed",
      },
    },
  });

  React.useEffect(() => {
    if (editor && editor.isEditable === previewMode) {
      editor.setEditable(!previewMode);
    }
  }, [editor, previewMode]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      {!previewMode && (
        <div className="flex items-center gap-1 border-b border-border/50 pb-1.5 text-xs text-muted-foreground flex-wrap">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("bold") ? "bg-muted text-foreground" : "hover:bg-muted/60"
            )}
            title="Tebal (Ctrl+B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("italic") ? "bg-muted text-foreground" : "hover:bg-muted/60"
            )}
            title="Miring (Ctrl+I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <div className="h-3 w-[1px] bg-border mx-1" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("bulletList") ? "bg-muted text-foreground" : "hover:bg-muted/60"
            )}
            title="Daftar Poin"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("orderedList") ? "bg-muted text-foreground" : "hover:bg-muted/60"
            )}
            title="Daftar Angka"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(
              "p-1.5 rounded transition-colors",
              editor.isActive("code") ? "bg-muted text-foreground" : "hover:bg-muted/60"
            )}
            title="Format Kode"
          >
            <Code className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-1.5 rounded transition-colors hover:bg-muted/60 ml-auto"
            title="Hapus Format"
          >
            <RemoveFormatting className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
