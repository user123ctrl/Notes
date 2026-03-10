"use client";

import { useState, useEffect, useCallback } from "react";
import { getUserNotes, createNote, updateNote, deleteNote, getNoteById } from "@/lib/firebase";
import type { Note } from "@/types";

// نوع بيانات إنشاء الملاحظة الجديدة (بدون id, createdAt, updatedAt, userId)
type CreateNoteData = Omit<Note, "id" | "createdAt" | "updatedAt" | "userId">;

export function useNotes(userId: string | undefined) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!userId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userNotes = await getUserNotes(userId);
      setNotes(userNotes);
      setError(null);
    } catch (err) {
      setError("فشل في تحميل الملاحظات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = async (noteData: CreateNoteData) => {
    if (!userId) throw new Error("المستخدم غير مسجل الدخول");
    
    try {
      const noteId = await createNote(userId, noteData);
      await fetchNotes();
      return noteId;
    } catch (err) {
      throw new Error("فشل في إنشاء الملاحظة");
    }
  };

  const editNote = async (noteId: string, noteData: Partial<Note>) => {
    try {
      await updateNote(noteId, noteData);
      await fetchNotes();
    } catch (err) {
      throw new Error("فشل في تحديث الملاحظة");
    }
  };

  const removeNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      await fetchNotes();
    } catch (err) {
      throw new Error("فشل في حذف الملاحظة");
    }
  };

  const getNote = async (noteId: string) => {
    try {
      return await getNoteById(noteId);
    } catch (err) {
      throw new Error("فشل في جلب الملاحظة");
    }
  };

  return {
    notes,
    loading,
    error,
    addNote,
    editNote,
    removeNote,
    getNote,
    refreshNotes: fetchNotes,
  };
}
