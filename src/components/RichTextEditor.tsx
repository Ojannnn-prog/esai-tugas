"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Minus,
  Undo2,
  Redo2,
  RemoveFormatting,
  Code,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Ketik jawaban esai Anda secara lengkap dan terstruktur di sini...",
  editable = true,
  minHeight = "400px",
}: RichTextEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);

      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
      setCharCount(text.length);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
      const text = editor.getText();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
      setCharCount(text.length);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="w-full h-80 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
        Memuat editor esai...
      </div>
    );
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors flex items-center justify-center text-sm ${
        isActive
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
      {/* WordPress / Blog Style Top Toolbar */}
      {editable && (
        <div className="bg-slate-50/80 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1">
          {/* History */}
          <div className="flex items-center space-x-1 pr-2 border-r border-slate-200">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Urungkan (Undo)"
            >
              <Undo2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Ulangi (Redo)"
            >
              <Redo2 className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Heading Dropdown/Buttons */}
          <div className="flex items-center space-x-1 px-2 border-r border-slate-200">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive("heading", { level: 1 })}
              title="Judul Utama (H1)"
            >
              <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive("heading", { level: 2 })}
              title="Sub Judul (H2)"
            >
              <Heading2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive("heading", { level: 3 })}
              title="Sub-sub Judul (H3)"
            >
              <Heading3 className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Text Formatting */}
          <div className="flex items-center space-x-1 px-2 border-r border-slate-200">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Tebal (Bold / Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Miring (Italic / Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Garis Bawah (Underline / Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Coret Teks (Strikethrough)"
            >
              <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              title="Kode Inline"
            >
              <Code className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Alignment: Left, Center, Right, Justify */}
          <div className="flex items-center space-x-1 px-2 border-r border-slate-200">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              isActive={editor.isActive({ textAlign: "left" })}
              title="Rata Kiri"
            >
              <AlignLeft className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              isActive={editor.isActive({ textAlign: "center" })}
              title="Rata Tengah"
            >
              <AlignCenter className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              isActive={editor.isActive({ textAlign: "right" })}
              title="Rata Kanan"
            >
              <AlignRight className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              isActive={editor.isActive({ textAlign: "justify" })}
              title="Rata Kiri-Kanan (Justify)"
            >
              <AlignJustify className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Lists & Blockquote */}
          <div className="flex items-center space-x-1 px-2 border-r border-slate-200">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Daftar Poin (Bullet List)"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Daftar Nomor (Numbered List)"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Kutipan (Blockquote)"
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Garis Pemisah (Horizontal Rule)"
            >
              <Minus className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Reset formatting */}
          <div className="flex items-center space-x-1 pl-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              title="Hapus Format"
            >
              <RemoveFormatting className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>
      )}

      {/* Editor Content Area */}
      <div
        className="p-6 cursor-text"
        style={{ minHeight }}
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} className="tiptap-content text-slate-800 focus:outline-none" />
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-4">
          <span>
            Kata: <strong className="text-slate-700">{wordCount}</strong>
          </span>
          <span>
            Karakter: <strong className="text-slate-700">{charCount}</strong>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span>Editor Aktif • Tersimpan Otomatis</span>
        </div>
      </div>
    </div>
  );
}
