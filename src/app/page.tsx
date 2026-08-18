import { StoryFlow } from "@/components/StoryFlow";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ gui?: string | string[] }>;
}) {
  const params = await searchParams;
  const gui = Array.isArray(params.gui) ? params.gui[0] : params.gui;

  return (
    <main className="relative min-h-screen">
      <StoryFlow cameFromForm={gui === "ok"} />
    </main>
  );
}
