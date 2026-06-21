import css from "./page.module.css";
import NoteForm from "@/components/NoteForm/NoteForm";
import { NoteTag } from "@/types/note";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create note",
  description: "Page for creating a new note",
  openGraph: {
    title: "Create note",
    description: "Page for creating a new note",
    url: "https://08-zustand-black-mu.vercel.app/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Note Hub Logo",
      },
    ],
  },
};

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default async function CreateNotePage() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>Create note</h1>
      <NoteForm tags={tags} />
    </div>
  );
}
