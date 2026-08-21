"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Wish } from "@/data/wishes";
import { WishCard } from "./WishCard";

function pageLabel(
  start: number,
  visibleCount: number,
  total: number,
  spreadSize: number
) {
  if (total === 0) return "Chưa có lời chúc";
  if (spreadSize === 1) {
    return `Trang ${start + 1} / ${total}`;
  }
  const end = Math.min(start + visibleCount, total);
  return start + 1 === end
    ? `Trang ${start + 1} / ${total}`
    : `Trang ${start + 1}-${end} / ${total}`;
}

export function WishWall({
  initialFireWishes = [],
}: {
  initialFireWishes?: Wish[];
}) {
  const [fireWishes, setFireWishes] = useState<Wish[]>(initialFireWishes);
  const [spread, setSpread] = useState(0);
  const [spreadSize, setSpreadSize] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");

  useEffect(() => {
    let unsub: (() => void) | undefined;

    import("@/lib/firebase")
      .then(({ db }) => import("firebase/firestore").then((fs) => ({ db, fs })))
      .then(({ db, fs }) => {
        const q = fs.query(
          fs.collection(db, "wishes"),
          fs.orderBy("createdAt", "desc")
        );
        unsub = fs.onSnapshot(
          q,
          (snap) => {
            setFireWishes(
              snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<Wish, "id">),
              }))
            );
          },
          () => {
            /* keep server-rendered wishes if live listener fails */
          }
        );
      })
      .catch(() => {
        /* iOS / Messenger: HTML already has Firestore wishes from the server */
      });

    return () => unsub?.();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      const nextSize = mq.matches ? 2 : 1;
      setSpreadSize((prevSize) => {
        if (prevSize === nextSize) return prevSize;
        setSpread((prevSpread) => {
          const wishStart = prevSpread * prevSize;
          return Math.floor(wishStart / nextSize);
        });
        return nextSize;
      });
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const allWishes: Wish[] = fireWishes;
  const totalSpreads = Math.max(1, Math.ceil(allWishes.length / spreadSize) || 1);
  const safeSpread = Math.min(spread, Math.max(0, totalSpreads - 1));
  const start = safeSpread * spreadSize;
  const visibleWishes = allWishes.slice(start, start + spreadSize);
  const isDesktopSpread = spreadSize === 2;
  const isEmpty = allWishes.length === 0;

  function flipTo(direction: "next" | "prev") {
    if (isFlipping) return;
    const target =
      direction === "next"
        ? Math.min(totalSpreads - 1, safeSpread + 1)
        : Math.max(0, safeSpread - 1);
    if (target === safeSpread) return;

    setFlipDirection(direction);
    setIsFlipping(true);
    window.setTimeout(() => {
      setSpread(target);
      window.setTimeout(() => setIsFlipping(false), 40);
    }, 290);
  }

  return (
    <section className="mx-auto flex min-h-0 w-full flex-1 flex-col pb-0 lg:pb-0">
      <div className="content-panel relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] px-4 py-4 shadow-[0_24px_90px_rgba(107,117,104,0.12)] ring-1 ring-white/75 sm:px-7 sm:py-6 lg:rounded-[2.5rem] lg:px-8 lg:py-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-white/45 to-transparent lg:h-24" />

        <div className="relative mb-3 flex shrink-0 items-center justify-between gap-3 lg:mb-4 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8">
          <div className="min-w-0 text-left">
            <p className="hidden text-[11px] font-semibold tracking-[0.18em] text-plum/65 lg:mb-2 lg:inline-flex lg:rounded-full lg:bg-white/78 lg:px-4 lg:py-2 lg:shadow-[0_10px_30px_rgba(155,184,150,0.12)] lg:ring-1 lg:ring-white/75">
              TRANG LƯU BÚT NHỎ
            </p>
            <h2 className="font-script text-2xl leading-tight text-navy sm:text-3xl lg:mt-2 lg:text-4xl">
              Lời chúc gửi Việt Thi 💌
            </h2>
            <p className="mt-1 hidden max-w-xl text-sm leading-6 text-navy/65 lg:mt-2 lg:block">
              Mỗi lời nhắn là một trang sổ nhỏ — lật từng trang để đọc hết những
              lời thương gửi theo Thi.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-2 lg:flex-col lg:items-end">
            <Link
              href="/gui-loi-chuc"
              className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-mint to-sky px-3.5 py-1.5 text-xs font-bold text-white shadow-[0_8px_28px_rgba(155,184,150,0.35)] transition hover:-translate-y-0.5 hover:scale-[1.02] lg:px-5 lg:py-2 lg:text-sm"
            >
              ✍️ Nhắn gửi
            </Link>
            <span className="rounded-full bg-white/75 px-3 py-1 text-[11px] font-semibold text-plum/75 ring-1 ring-white/80 lg:px-4 lg:py-2 lg:text-xs">
              {pageLabel(start, visibleWishes.length, allWishes.length, spreadSize)}
            </span>
          </div>
        </div>

        <div className="book-stage relative flex min-h-0 flex-1 flex-col">
          <div
            className={`book-shell book-cover flex min-h-0 flex-1 flex-col ${
              isFlipping
                ? flipDirection === "next"
                  ? "page-flip-next"
                  : "page-flip-prev"
                : ""
            }`}
          >
            <div className="book-spine pointer-events-none hidden lg:block" aria-hidden />
            <div className="book-spread book-gutter relative grid min-h-0 flex-1 auto-rows-fr lg:grid-cols-2 lg:gap-0">
              {isEmpty ? (
                <div className="letter-page wish-book-page book-page book-page-single relative col-span-full flex h-full min-h-0 flex-col self-stretch lg:col-span-2">
                  <div className="flex flex-1 flex-col items-center justify-center px-8 py-10 text-center text-plum/55">
                    <span className="mb-4 text-4xl opacity-70">💌</span>
                    <p className="font-script text-2xl text-navy/70">
                      Sổ còn trống…
                    </p>
                    <p className="mt-3 max-w-xs text-xs leading-6">
                      Hãy là người đầu tiên viết lời thương gửi Thi nha.
                    </p>
                    <Link
                      href="/gui-loi-chuc"
                      className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-mint to-sky px-5 py-2 text-xs font-bold text-white shadow-[0_8px_28px_rgba(155,184,150,0.35)]"
                    >
                      ✍️ Viết cho Thi
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {visibleWishes[0] ? (
                    <WishCard
                      key={visibleWishes[0].id}
                      wish={visibleWishes[0]}
                      layout={isDesktopSpread ? "left" : "single"}
                      pageNumber={start + 1}
                    />
                  ) : null}

                  {isDesktopSpread && visibleWishes[1] ? (
                    <WishCard
                      key={visibleWishes[1].id}
                      wish={visibleWishes[1]}
                      layout="right"
                      pageNumber={start + 2}
                    />
                  ) : isDesktopSpread ? (
                    <div className="letter-page wish-book-page book-page book-page-right relative hidden h-full min-h-0 self-stretch lg:flex lg:flex-col">
                      <div className="flex flex-1 flex-col items-center justify-center px-8 py-10 text-center text-plum/55">
                        <span className="mb-4 text-4xl opacity-70">📖</span>
                        <p className="font-script text-2xl">Trang tiếp theo đang chờ...</p>
                        <p className="mt-3 max-w-xs text-xs leading-6">
                          Khi có thêm lời nhắn mới, cuốn sổ này sẽ đầy dần lên nữa.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
            <div className="book-edge pointer-events-none hidden lg:block" aria-hidden />
          </div>

          <div className="mt-3 flex shrink-0 flex-wrap items-center justify-center gap-2 lg:mt-3 lg:gap-3">
            <button
              type="button"
              onClick={() => flipTo("prev")}
              disabled={isEmpty || safeSpread === 0 || isFlipping}
              className="rounded-full border border-mint/30 bg-white/80 px-4 py-2 text-xs font-semibold text-plum shadow-[0_10px_30px_rgba(155,184,150,0.1)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 lg:px-4 lg:py-2"
            >
              ← Trước
            </button>
            <button
              type="button"
              onClick={() => flipTo("next")}
              disabled={
                isEmpty || safeSpread >= totalSpreads - 1 || isFlipping
              }
              className="rounded-full bg-linear-to-r from-mint to-sky px-4 py-2 text-xs font-bold text-white shadow-[0_12px_30px_rgba(155,184,150,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 lg:px-5"
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
