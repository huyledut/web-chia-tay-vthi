import { Suspense } from "react";
import { StoryFlow } from "@/components/StoryFlow";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Suspense>
        <StoryFlow />
      </Suspense>
    </main>
  );
}