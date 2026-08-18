import Image from "next/image";
import type { Wish } from "@/data/wishes";

const TONE: Record<Wish["tone"], string> = {
  pink:  "bg-[#fff0f8]",
  sky:   "bg-[#edf6ff]",
  cream: "bg-[#fffaf0]",
  lilac: "bg-[#f5f0ff]",
  peach: "bg-[#fff5ee]",
};

const TILT = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-1", "rotate-1"];

export function WishCard({ wish, index }: { wish: Wish; index: number }) {
  return (
    <article
      className={`${TONE[wish.tone]} ${TILT[index % TILT.length]} relative overflow-visible rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.07)] ring-1 ring-white/80 transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)]`}
    >
      {/* optional image at top */}
      {wish.imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-t-3xl">
          <Image
            src={wish.imageUrl}
            alt={`Ảnh từ ${wish.from}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 380px"
            unoptimized
          />
        </div>
      ) : null}

      <div className="p-5">
        {/* sticker floating above top-right corner */}
        <span
          className="absolute -right-1 -top-4 text-3xl drop-shadow-sm"
          aria-hidden
          style={{ transform: "rotate(13deg)" }}
        >
          {wish.sticker}
        </span>

        {/* sender info */}
        <div className="mb-3 pr-6">
          <p className="font-bold text-navy">{wish.from}</p>
          {wish.relation ? (
            <p className="text-xs text-plum/70">{wish.relation}</p>
          ) : null}
        </div>

        {/* message */}
        <p className="text-[15px] leading-7 text-navy/80">{wish.message}</p>

        {/* bottom dashed accent */}
        <div
          className="absolute bottom-3 left-5 right-5 h-px"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg,#f9a8c9 0,#f9a8c9 5px,transparent 5px,transparent 11px)",
          }}
        />
      </div>
    </article>
  );
}
