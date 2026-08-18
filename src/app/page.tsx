import { StoryFlow } from "@/components/StoryFlow";

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ gui?: string | string[]; buoc?: string | string[] }>;
}) {
  const params = await searchParams;
  const gui = first(params.gui);
  const buocNum = Number(first(params.buoc) ?? 0);
  const buoc = Number.isFinite(buocNum) ? Math.min(4, Math.max(0, buocNum)) : 0;

  return (
    <main className="relative min-h-screen">
      <StoryFlow
        cameFromForm={gui === "ok"}
        initialStep={gui === "ok" ? 4 : buoc}
      />
    </main>
  );
}
