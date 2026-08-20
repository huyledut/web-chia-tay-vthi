"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { wishes as staticWishes, type Wish } from "@/data/wishes";
import { WishCard } from "./WishCard";

function pageLabel(
  start: number,
  visibleCount: number,
  total: number,
  spreadSize: number
) {
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

  const allWishes: Wish[] = [...fireWishes, ...staticWishes];
  const totalSpreads = Math.max(1, Math.ceil(allWishes.length / spreadSize));
  const safeSpread = Math.min(spread, totalSpreads - 1);
  const start = safeSpread * spreadSize;
  const visibleWishes = allWishes.slice(start, start + spreadSize);
  const isDesktopSpread = spreadSize === 2;

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
    <section className="mx-auto w-full pb-4 lg:pb-2">
      <div className="content-panel relative overflow-hidden rounded-[2.5rem] px-5 py-7 shadow-[0_24px_90px_rgba(107,117,104,0.12)] ring-1 ring-white/75 sm:px-7 lg:px-8 lg:py-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-white/45 to-transparent lg:h-24" />
        <div className="pointer-events-none absolute left-8 top-8 h-28 w-28 rounded-full bg-mint/14 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-12 h-32 w-32 rounded-full bg-sky/16 blur-3xl" />

        <div className="relative mb-8 text-center lg:mb-5 lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-8 lg:text-left">
          <div>
            <p className="text-3xl lg:text-2xl">💌</p>
            <p className="mt-2 inline-flex rounded-full bg-white/78 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-plum/65 shadow-[0_10px_30px_rgba(155,184,150,0.12)] ring-1 ring-white/75">
              TRANG LƯU BÚT NHỎ
            </p>
            <h2 className="mt-4 font-script text-5xl text-navy sm:text-6xl lg:mt-2 lg:text-4xl">
              Lời chúc gửi Việt Thi 💌
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-navy/65 sm:text-base lg:mx-0 lg:mt-2 lg:max-w-xl lg:text-sm lg:leading-6">
              Mỗi lời nhắn là một trang sổ nhỏ — lật từng trang để đọc hết những
              lời thương gửi theo Thi.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-plum/70 lg:hidden">
              <span className="rounded-full bg-white/75 px-3 py-1.5 ring-1 ring-white/80">
                📖 Một trang mỗi lần lật
              </span>
              <span className="rounded-full bg-white/75 px-3 py-1.5 ring-1 ring-white/80">
                ✍️ Chữ viết tay như lá thư
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:mt-0 lg:flex-col lg:items-end lg:gap-2">
            <Link
              href="/gui-loi-chuc"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-mint to-sky px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_28px_rgba(155,184,150,0.35)] transition hover:-translate-y-0.5 hover:scale-[1.02] lg:px-5 lg:py-2"
            >
              ✍️ Nhắn gửi Thi nào!
            </Link>
            <span className="rounded-full bg-white/75 px-4 py-2 text-xs font-semibold text-plum/75 ring-1 ring-white/80">
              {pageLabel(start, visibleWishes.length, allWishes.length, spreadSize)}
            </span>
          </div>
        </div>

        <div className="book-stage relative">
          <div
            className={`book-shell book-cover ${
              isFlipping
                ? flipDirection === "next"
                  ? "page-flip-next"
                  : "page-flip-prev"
                : ""
            }`}
          >
            <div className="book-spine pointer-events-none hidden lg:block" aria-hidden />
            <div className="book-spread book-gutter relative grid lg:grid-cols-2 lg:gap-0">
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
                <div className="letter-page wish-book-page book-page book-page-right relative hidden min-h-0 lg:flex lg:flex-col">
                  <div className="flex flex-1 flex-col items-center justify-center px-8 py-10 text-center text-plum/55">
                    <span className="mb-4 text-4xl opacity-70">📖</span>
                    <p className="font-script text-2xl">Trang tiếp theo đang chờ...</p>
                    <p className="mt-3 max-w-xs text-xs leading-6">
                      Khi có thêm lời nhắn mới, cuốn sổ này sẽ đầy dần lên nữa.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="book-edge pointer-events-none hidden lg:block" aria-hidden />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:mt-4">
            <button
              type="button"
              onClick={() => flipTo("prev")}
              disabled={safeSpread === 0 || isFlipping}
              className="rounded-full border border-mint/30 bg-white/80 px-5 py-2.5 text-sm font-semibold text-plum shadow-[0_10px_30px_rgba(155,184,150,0.1)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 lg:px-4 lg:py-2 lg:text-xs"
            >
              ← Lật về trước
            </button>
            <button
              type="button"
              onClick={() => flipTo("next")}
              disabled={safeSpread >= totalSpreads - 1 || isFlipping}
              className="rounded-full bg-linear-to-r from-mint to-sky px-6 py-2.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(155,184,150,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 lg:px-5 lg:py-2 lg:text-xs"
            >
              Lật sang trang sau →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
