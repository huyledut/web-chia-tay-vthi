import Image from "next/image";
import type { Wish } from "@/data/wishes";

export type WishPageLayout = "single" | "left" | "right";

const TONE_WASH: Record<Wish["tone"], string> = {
  pink: "from-rose/18 via-transparent to-transparent",
  sky: "from-sky/20 via-transparent to-transparent",
  cream: "from-lemon/22 via-transparent to-transparent",
  lilac: "from-lilac/20 via-transparent to-transparent",
  peach: "from-peach/20 via-transparent to-transparent",
};

const TONE_STAMP: Record<Wish["tone"], string> = {
  pink: "ring-rose/30 bg-rose/8",
  sky: "ring-sky/35 bg-sky/10",
  cream: "ring-lemon/40 bg-lemon/12",
  lilac: "ring-lilac/35 bg-lilac/10",
  peach: "ring-peach/35 bg-peach/10",
};

const PAGE_SHAPE: Record<WishPageLayout, string> = {
  single: "book-page-single rounded-[1.35rem]",
  left: "book-page-left rounded-[1.35rem] lg:rounded-l-[1.35rem] lg:rounded-r-none",
  right: "book-page-right rounded-[1.35rem] lg:rounded-r-[1.35rem] lg:rounded-l-none",
};

export function WishCard({
  wish,
  layout,
  pageNumber,
}: {
  wish: Wish;
  layout: WishPageLayout;
  pageNumber: number;
}) {
  const tilt = layout === "right" ? "rotate-1" : layout === "left" ? "-rotate-1" : "-rotate-1";

  return (
    <article
      className={`letter-page wish-book-page book-page ${PAGE_SHAPE[layout]} relative flex flex-col overflow-hidden bg-cream`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${TONE_WASH[wish.tone]} opacity-90`}
      />

      <div className="relative z-10 flex h-full flex-col px-5 pb-5 pt-4 sm:px-6 lg:px-4 lg:pb-4 lg:pt-3">
        <div className="mb-3 flex items-start justify-between gap-3 lg:mb-2">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-plum/50">
            TRANG {String(pageNumber).padStart(2, "0")}
          </p>
          <span
            className={`inline-flex shrink-0 rounded-full px-2.5 py-1.5 text-xl shadow-[0_6px_16px_rgba(155,184,150,0.12)] ring-1 ${TONE_STAMP[wish.tone]} lg:text-lg`}
          >
            {wish.sticker}
          </span>
        </div>

        <div
          className={`flex min-h-0 flex-1 flex-col gap-4 ${
            wish.imageUrl
              ? "lg:grid lg:grid-cols-[118px_minmax(0,1fr)] lg:items-start lg:gap-3"
              : ""
          }`}
        >
          {wish.imageUrl ? (
            <div className="wish-media-slot mx-auto w-full max-w-[200px] shrink-0 lg:mx-0 lg:max-w-none">
              <div className={`${tilt} mx-auto w-[min(100%,168px)] lg:w-full`}>
                <div className="wish-polaroid relative">
                  <span className="wish-tape wish-tape-left" aria-hidden />
                  <span className="wish-tape wish-tape-right" aria-hidden />
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#faf8f4]">
                    <Image
                      src={wish.imageUrl}
                      alt={`Ảnh từ ${wish.from}`}
                      fill
                      className="object-contain p-1.5"
                      sizes="(max-width: 1024px) 168px, 118px"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="letter-body min-h-[4.5rem] flex-1 lg:min-h-[5.5rem] lg:overflow-y-auto">
              <p className="font-script text-[1.1rem] leading-[1.82] text-navy/90 lg:text-[0.98rem] lg:leading-[1.72]">
                {wish.message}
              </p>
            </div>

            <footer className="mt-4 border-t border-plum/10 pt-3 lg:mt-3 lg:pt-2.5">
              <p className="font-script text-[1.2rem] leading-tight text-navy lg:text-lg">
                — {wish.from}
              </p>
              {wish.relation ? (
                <p className="mt-1 text-[10px] tracking-[0.1em] text-plum/60 uppercase">
                  {wish.relation}
                </p>
              ) : null}
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
}
