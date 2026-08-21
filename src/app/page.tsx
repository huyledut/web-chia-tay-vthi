import { StoryFlow } from "@/components/StoryFlow";
import { fetchFireWishes } from "@/lib/fetch-wishes";
import type { Wish } from "@/data/wishes";

export const dynamic = "force-dynamic";

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
  const step = gui === "ok" ? 4 : buoc;

  let fireWishes: Wish[] = [];
  try {
    fireWishes = await fetchFireWishes();
  } catch {
    fireWishes = [];
  }

  return (
    <main className="relative">
      <StoryFlow
        cameFromForm={gui === "ok"}
        initialStep={step}
        fireWishes={fireWishes}
      />
    </main>
  );
}
