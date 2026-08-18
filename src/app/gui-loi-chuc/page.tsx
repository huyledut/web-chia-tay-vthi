import Link from "next/link";
import { WishFormFirebase } from "@/components/WishFormFirebase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gửi lời chúc · Tạm biệt Việt Thi",
};

export default function GuiLoiChucPage() {
  return (
    <main
      className="min-h-screen px-4 pb-24 pt-12"
      style={{
        background: "linear-gradient(160deg,#fff0f8 0%,#f3effe 50%,#e8f6ff 100%)",
      }}
    >
      {/* floating petals decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        {["🌸", "💗", "✨", "💌", "🌷"].map((e, i) => (
          <span
            key={i}
            className="drift absolute text-2xl"
            style={{
              left: `${10 + i * 18}%`,
              bottom: "-10%",
              animationDuration: `${14 + i * 3}s`,
              animationDelay: `${i * 1.5}s`,
            }}
          >
            {e}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-xl">
        {/* back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-plum/70 transition hover:text-plum"
        >
          ← Quay về trang chính
        </Link>

        <WishFormFirebase />
      </div>
    </main>
  );
}
