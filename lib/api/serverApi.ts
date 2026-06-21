import type { Note, NoteTag } from "@/types/note";
import internalApi from "./api";
import type { User } from "@/types/user";
import { cookies } from "next/headers";

export interface FetchNotesResponse {
  totalPages: number;
  notes: Note[];
}

export interface FetchNoteParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: NoteTag;
}

export async function fetchNotes(
  params: FetchNoteParams,
): Promise<FetchNotesResponse> {
  const cookieStore = await cookies();
  const { data } = await internalApi.get<FetchNotesResponse>("/notes", {
    params,
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export async function fetchNoteById(noteId: string): Promise<Note> {
  const cookieStore = await cookies();
  const { data } = await internalApi.get<Note>(`/notes/${noteId}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
}

export const checkSession = async () => {
  const cookieStore = await cookies();
  const res = await internalApi.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const { data } = await internalApi.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
