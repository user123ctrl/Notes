"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useNotes } from "@/hooks/useNotes";
import { Plus, Search, Sparkles, FileText, Star } from "lucide-react";
import NoteCard from "@/components/notes/NoteCard";
import NoteEditor from "@/components/notes/NoteEditor";

export default function DashboardPage() {
  const { user } = useAuth();
  const { notes, loading, addNote } = useNotes(user?.uid);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const router = useRouter();

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateNote = async (noteData: any) => {
    try {
      await addNote(noteData);
      setIsEditorOpen(false);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          title="إجمالي الملاحظات"
          value={notes.length}
          color="blue"
        />
        <StatCard
          icon={<Star className="w-5 h-5 text-yellow-600" />}
          title="المفضلة"
          value={notes.filter(n => n.isFavorite).length}
          color="yellow"
        />
        <StatCard
          icon={<Sparkles className="w-5 h-5 text-purple-600" />}
          title="مع AI"
          value={notes.filter(n => n.summary).length}
          color="purple"
        />
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في الملاحظات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setIsEditorOpen(true)}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          ملاحظة جديدة
        </button>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الملاحظات...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "لا توجد نتائج للبحث" : "لا توجد ملاحظات بعد"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? "جرب البحث بكلمات مختلفة" : "ابدأ بإنشاء ملاحظتك الأولى"}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              إنشاء ملاحظة جديدة
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => router.push(`/dashboard/notes/${note.id}`)}
            />
          ))}
        </div>
      )}

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <NoteEditor
          onClose={() => setIsEditorOpen(false)}
          onSave={handleCreateNote}
        />
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 border-blue-100",
    yellow: "bg-yellow-50 border-yellow-100",
    purple: "bg-purple-50 border-purple-100",
  };

  return (
    <div className={`${colors[color]} border rounded-xl p-4 flex items-center gap-4`}>
      <div className="p-3 bg-white rounded-lg shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
