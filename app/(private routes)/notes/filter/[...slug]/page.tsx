import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Notes from "./Notes.client";
import { fetchNotes } from "@/lib/api/serverApi";
import { NoteTag } from "@/types/note";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const tag = slug?.[0] === "All" ? undefined : (slug?.[0] as NoteTag) || "";
  return {
    title: `NoteHub | ${tag ? `${tag} - ` : ""}Notes`,
    description: `Browse ${tag ? `${tag} ` : ""}notes on NoteHub.`,
    openGraph: {
      type: "website",
      title: `NoteHub | ${tag ? `${tag} - ` : ""}Notes`,
      description: `Browse ${tag ? `${tag} ` : ""}notes on NoteHub.`,
      url: `https://08-zustand-black-mu.vercel.app/notes/${slug.join("/")}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
};

export default async function NotesPage({ params }: Props) {
  const queryClient = new QueryClient();
  const { slug } = await params;
  const tag = slug?.[0] === "all" ? undefined : (slug?.[0] as NoteTag) || "";

  await queryClient.prefetchQuery({
    queryKey: ["notes", { search: "", page: 1, perPage: 12, tag }],
    queryFn: () => fetchNotes({ search: "", page: 1, perPage: 12, tag }),
  });
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Notes tag={tag} />
      </HydrationBoundary>
    </div>
  );
}
