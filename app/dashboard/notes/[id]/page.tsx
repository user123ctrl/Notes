"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import { getNoteById, updateNote, deleteNote } from "@/lib/firebase";
import { ArrowRight, Trash2, Star, Sparkles, Wand2 } from "lucide-react";
import NoteEditor from "@/components/notes/NoteEditor";
import { improveText } from "@/lib/gemini";
import type { Note } from "@/types";

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { removeNote } = useNotes(user?.uid);
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (!params.id) return;
      try {
        const noteData = await getNoteById(params.id as string);
        if (noteData) {
          setNote(noteData);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [params.id, router]);

  const handleUpdate = async (noteData: Omit<Note, "id" | "createdAt" | "updatedAt" | "userId">) => {
    try {
      await updateNote(params.id as string, noteData);
      setNote((prev) => prev ? { ...prev, ...noteData } : null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("هل أنت متأكد من حذف هذه الملاحظة؟")) {
      try {
        await removeNote(params.id as string);
        router.push("/dashboard");
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!note) return;
    try {
      await updateNote(params.id as string, { isFavorite: !note.isFavorite });
      setNote({ ...note, isFavorite: !note.isFavorite });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleImproveText = async () => {
    if (!note?.content) return;
    setIsImproving(true);
    try {
      const improved = await improveText(note.content, "formal");
      await updateNote(params.id as string, { content: improved });
      setNote({ ...note, content: improved });
    } catch (error) {
      console.error("Error improving text:", error);
    } finally {
      setIsImproving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        العودة للملاحظات
      </button>

      {/* Note Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{note.title || "بدون عنوان"}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>تم الإنشاء: {new Date(note.createdAt).toLocaleDateString("ar-SA")}</span>
              <span>•</span>
              <span>آخر تعديل: {new Date(note.updatedAt).toLocaleDateString("ar-SA")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-lg transition-colors ${note.isFavorite ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <Star className={`w-5 h-5 ${note.isFavorite ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              تعديل
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tags */}
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* AI Summary */}
        {note.summary && (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-900">الملخص الذكي</span>
            </div>
            <p className="text-purple-800 leading-relaxed">{note.summary}</p>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none whitespace-pre-wrap">
          {note.content}
        </div>

        {/* AI Actions */}
        <div className="mt-8 pt-6 border-t flex gap-3">
          <button
            onClick={handleImproveText}
            disabled={isImproving}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
          >
            {isImproving ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            تحسين النص بالذكاء الاصطناعي
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && note && (
        <NoteEditor
          initialNote={note}
          onClose={() => setIsEditing(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
