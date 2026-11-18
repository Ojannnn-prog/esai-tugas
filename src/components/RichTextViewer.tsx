"use client";

interface RichTextViewerProps {
  content: string;
  className?: string;
}

export default function RichTextViewer({ content, className = "" }: RichTextViewerProps) {
  if (!content) {
    return <div className="text-slate-400 italic">Tidak ada konten esai.</div>;
  }

  return (
    <div
      className={`tiptap-content text-slate-800 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
