import { notFound } from "next/navigation";
import { chapters } from "@/content/module";
import { ChapterView } from "./chapter-view";

export function generateStaticParams() {
  return chapters.map((c) => ({ id: String(c.id) }));
}

export const dynamicParams = false;

export default async function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = chapters.find((c) => String(c.id) === id);
  if (!chapter) notFound();
  return <ChapterView chapterId={chapter.id} />;
}
