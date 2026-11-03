import { notFound } from "next/navigation";
import { chapters } from "@/content/module";
import { CheckView } from "./check-view";

export function generateStaticParams() {
  return chapters.map((c) => ({ id: String(c.id) }));
}

export const dynamicParams = false;

export default async function ChapterCheckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = chapters.find((c) => String(c.id) === id);
  if (!chapter) notFound();
  return <CheckView chapterId={chapter.id} />;
}
