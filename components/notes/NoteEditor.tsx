"use client";

import { useState } from "react";
import { X, Sparkles, Loader2, Palette, Tag } from "lucide-react";
import { extractTags, summarizeText } from "@/lib/gemini";
import type { Note } from "@/types";

interface NoteEditorProps {
  initialNote?: Note;
  onClose: () => void;
  onSave: (note: Omit<Note, "id" | "createdAt" | "updatedAt" | "userId">) => void;
}

const colors = [
  { id: "white", name: "أبيض", class: "bg-white" },
  { id: "red", name: "أحمر", class: "bg-red-100" },
  { id: "orange", name: "برتقالي", class: "bg-orange-100" },
  { id: "yellow", name: "أصفر", class: "bg-yellow-100" },
  { id: "green", name: "أخضر", class: "bg-green-100" },
  { id: "blue", name: "أزرق", class: "bg-blue-100" },
  { id: "purple", name: "بنفسجي", class: "bg-purple-100" },
];

export default function NoteEditor({ initialNote, onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || "");
  const [selectedColor, setSelectedColor] = useState(initialNote?.color || "white");
  const [tags, setTags] = useState<string[]>(initialNote?.tags || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState(initialNote?.summary || "");

  const handleAIGenerate = async (type: "summary" | "tags") => {
    if (!content.trim()) return;
    
    setIsGenerating(true);
    try {
      if (type === "summary") {
        const result = await summarizeText(content);
        setSummary(result);
      } else if (type === "tags") {
        const result = await extractTags(content);
        setTags(result);
      }
    } catch (error) {
      console.error("AI generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    onSave({
      title,
      content,
      color: selectedColor,
      tags,
      summary: summary || undefined,
      isFavorite: initialNote?.isFavorite || false,
      isArchived: initialNote?.isArchived || false,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {initialNote ? "تعديل الملاحظة" : "ملاحظة جديدة"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <input
            type="text"
            placeholder="عنوان الملاحظة..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-semibold placeholder-gray-400 border-0 border-b border-gray-200 focus:border-blue-500 focus:ring-0 pb-2"
          />

          {/* Color Picker */}
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-400" />
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`w-6 h-6 rounded-full ${color.class} border-2 ${selectedColor === color.id ? "border-gray-900" : "border-gray-200"} hover:scale-110 transition-transform`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <textarea
            placeholder="اكتب ملاحظتك هنا..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-48 resize-none border border-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* AI Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => handleAIGenerate("summary")}
              disabled={isGenerating || !content.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              تلخيص ذكي
            </button>
            <button
              onClick={() => handleAIGenerate("tags")}
              disabled={isGenerating || !content.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Tag className="w-4 h-4" />
              )}
              استخراج وسوم
            </button>
          </div>

          {/* Summary Preview */}
          {summary && (
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-900">الملخص الذكي</span>
              </div>
              <p className="text-sm text-purple-800 leading-relaxed">{summary}</p>
              <button
                onClick={() => setSummary("")}
                className="text-xs text-purple-600 hover:text-purple-800 mt-2"
              >
                إزالة الملخص
              </button>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    className="hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            حفظ الملاحظة
          </button>
        </div>
      </div>
    </div>
  );
}
