import { formatDate, truncateText } from "@/lib/utils";
import { Star, Sparkles } from "lucide-react";
import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

export default function NoteCard({ note, onClick }: NoteCardProps) {
  const colorClasses: Record<string, string> = {
    white: "bg-white hover:bg-gray-50",
    red: "bg-red-50 hover:bg-red-100",
    orange: "bg-orange-50 hover:bg-orange-100",
    yellow: "bg-yellow-50 hover:bg-yellow-100",
    green: "bg-green-50 hover:bg-green-100",
    blue: "bg-blue-50 hover:bg-blue-100",
    purple: "bg-purple-50 hover:bg-purple-100",
  };

  return (
    <div
      onClick={onClick}
      className={`${colorClasses[note.color || "white"]} border border-gray-200 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md group animate-fade-in`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1 flex-1 ml-2">
          {note.title || "بدون عنوان"}
        </h3>
        <div className="flex items-center gap-1">
          {note.isFavorite && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          )}
          {note.summary && (
            <Sparkles className="w-4 h-4 text-purple-500" />
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
        {truncateText(note.content, 150)}
      </p>

      {note.summary && (
        <div className="bg-white/50 rounded-lg p-3 mb-3 border border-gray-100">
          <div className="flex items-center gap-1 mb-1">
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span className="text-xs font-medium text-purple-700">الملخص الذكي</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{note.summary}</p>
        </div>
      )}

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
        <span>{formatDate(note.updatedAt)}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
          اضغط للتعديل
        </span>
      </div>
    </div>
  );
}
