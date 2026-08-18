"use client";

/* Native <a href="/?buoc=…"> is required: Next <Link> intercepts clicks and breaks older iOS. */
/* eslint-disable @next/next/no-html-link-for-pages */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { WishWall } from "./WishWall";

/* ── data ─────────────────────────────────────────────── */
const MEMORY_PHOTOS = [
  { src: "/photos/05-chia-tay.png",      tilt: "-2deg",   tall: false },
  { src: "/photos/04-tet-binh-ngo.png",  tilt: "1.5deg",  tall: false },
  { src: "/photos/03-phat-dan-2023.png", tilt: "-1deg",   tall: false },
  { src: "/photos/07-phat-dan-2024.png", tilt: "2.5deg",  tall: false },
  { src: "/photos/02-ban-be.png",        tilt: "-1.5deg", tall: false },
  { src: "/photos/06-trai-tim.png",      tilt: "1deg",    tall: true  },
  { src: "/photos/08-hoa-va-qua.png",    tilt: "-2deg",   tall: true  },
  { src: "/photos/09-ao-dai.png",        tilt: "2deg",    tall: true  },
] as const;

const NEXT_LABELS: Record<number, string> = {
  1: "Cùng tua lại những khoảnh khắc nhé 🌸",
  2: "Chánh Tâm mãi là nhà 🏡",
  3: "Mọi người có đôi lời gửi đến Thi iu dấu nè 💌",
};

const ENTER: Record<number, string> = { 1: "enter-1", 2: "enter-2", 3: "enter-3", 4: "enter-4" };

function EnvelopeVisual() {
  return (
    <span
      className="pointer-events-none relative block w-[90vw] max-w-75 sm:max-w-105 lg:max-w-145"
      aria-hidden
    >
      <span className="block w-full" style={{ paddingBottom: "73.33%" }} />

      <span className="absolute inset-0 overflow-hidden rounded-[26px]">
        <span
          className="absolute inset-0 rounded-[26px]"
          style={{
            background: "linear-gradient(145deg,#fde8c8,#f5c49a)",
            boxShadow:
              "0 20px 60px rgba(200,120,80,0.25),0 4px 16px rgba(200,120,80,0.15)",
          }}
        />

        <span
          className="absolute left-[6%] right-[6%] rounded-xl bg-white text-left shadow-md"
          style={{
            bottom: "14%",
            padding: "5% 6%",
            zIndex: 2,
            transform: "translateY(0)",
            transition: "transform 0.95s 0.15s ease",
          }}
        >
          <span className="block font-script text-[1.15rem] text-plum sm:text-2xl">
            Gửi Việt Thi 🌸
          </span>
          <span className="mt-1 block text-[0.7rem] leading-5 text-navy/60 sm:text-sm">
            Từ Học Chúng Chánh Tâm · Tự Viện Phước Duyên · Huế
          </span>
        </span>

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 300 220"
          preserveAspectRatio="none"
          aria-hidden
          style={{ zIndex: 3 }}
        >
          <polygon points="0,0 0,220 150,121" fill="#edb880" />
          <polygon points="300,0 300,220 150,121" fill="#e8a56c" />
          <polygon points="0,220 150,105 300,220" fill="#e09060" />
        </svg>

        <svg
          className="pointer-events-none absolute left-0 top-0 w-full"
          viewBox="0 0 300 121"
          preserveAspectRatio="none"
          aria-hidden
          style={{
            height: "55%",
            zIndex: 4,
            transform: "translateY(0)",
            opacity: 1,
            transition: "transform 0.9s ease, opacity 0.7s ease",
          }}
        >
          <polygon points="0,0 300,0 150,121" fill="#e09060" />
          <polygon points="0,0 300,0 150,108" fill="#f5c07a" />
        </svg>

        <span
          className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 text-3xl drop-shadow-sm"
          style={{
            top: "28%",
            opacity: 1,
            transition: "opacity 0.35s ease",
          }}
          aria-hidden
        >
          💗
        </span>
      </span>
    </span>
  );
}

/* ── main component ───────────────────────────────────── */
export function StoryFlow({
  cameFromForm = false,
  initialStep = 0,
}: {
  cameFromForm?: boolean;
  initialStep?: number;
}) {
  const displayStep = cameFromForm ? 4 : initialStep;
  const [playing, setPlaying] = useState(false);
  const [toast, setToast] = useState(cameFromForm);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(false), 4000);
    return () => window.clearTimeout(t);
  }, [toast]);

  function playMusic() {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.volume = 0.38;
    } catch {
      /* older WebKit */
    }
    try {
      const maybe = a.play();
      if (maybe && typeof maybe.then === "function") {
        maybe.then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        setPlaying(true);
      }
    } catch {
      setPlaying(false);
    }
  }

  function toggleMusic() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      playMusic();
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/nhac-chia-tay.mp3" loop preload="none" />

      {displayStep === 0 ? (
        <a
          href="/?buoc=1"
          className="relative z-30 flex min-h-screen touch-manipulation flex-col items-center justify-center overflow-hidden px-4 no-underline"
          style={{
            background: "linear-gradient(160deg,#fff0f8 0%,#f3effe 55%,#e8f6ff 100%)",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {(["🌸", "💗", "✨", "💌", "☁️", "🌷"] as const).map((e, i) => (
            <span
              key={i}
              className="drift pointer-events-none absolute text-2xl sm:text-3xl"
              style={{
                left: `${8 + i * 15}%`,
                bottom: "-10%",
                animationDuration: `${13 + i * 3}s`,
                animationDelay: `${i * 1.2}s`,
              }}
            >
              {e}
            </span>
          ))}

          <p className="mb-8 font-script text-3xl text-navy drop-shadow-sm sm:text-4xl lg:mb-12 lg:text-5xl">
            Thi ơi, có thư này gửi cho cậu nè 💌
          </p>

          <EnvelopeVisual />

          <p className="mt-6 animate-pulse text-sm text-navy/55 lg:mt-10 lg:text-base">
            Bấm vào để mở nha 🤍
          </p>
        </a>
      ) : null}

      {displayStep > 0 ? (
        <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-8 sm:px-6 md:px-8">
          <div className="mb-10 flex justify-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  s === displayStep
                    ? "w-10 bg-rose"
                    : s < displayStep
                    ? "w-2.5 bg-rose/45"
                    : "w-2.5 bg-rose/15"
                }`}
              />
            ))}
          </div>

          <div key={displayStep} className={ENTER[displayStep] ?? ""}>
            {displayStep === 1 && <StepThi />}
            {displayStep === 2 && <StepMemories />}
            {displayStep === 3 && <StepChanTam />}
            {displayStep === 4 && <WishWall />}
          </div>

          {displayStep < 4 ? (
            <div className="mt-10 flex items-center justify-center gap-3">
              {displayStep > 1 ? (
                <a
                  href={`/?buoc=${displayStep - 1}`}
                  className="rounded-full border-2 border-rose/40 px-5 py-2.5 text-sm font-semibold text-rose/80 no-underline transition hover:border-rose hover:text-rose"
                >
                  ← Quay lại
                </a>
              ) : null}
              <a
                href={`/?buoc=${displayStep + 1}`}
                className="rounded-full bg-linear-to-r from-rose to-petal px-7 py-3 text-sm font-bold text-white no-underline shadow-[0_4px_20px_rgba(249,168,201,0.45)] transition hover:scale-105 hover:shadow-[0_6px_30px_rgba(249,168,201,0.65)]"
              >
                {NEXT_LABELS[displayStep]}
              </a>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* sent-wish toast */}
      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy shadow-xl ring-1 ring-rose/30">
          🌸 Gửi rồi nha! Cảm ơn bạn nhiều lắm 💗
        </div>
      ) : null}

      {/* music toggle (fixed, appears after step 0) */}
      {displayStep > 0 ? (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            type="button"
            onClick={toggleMusic}
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-xl ring-2 ring-rose/30 transition hover:-translate-y-0.5 ${
              playing ? "music-pulse" : ""
            }`}
            aria-label={playing ? "Tắt nhạc" : "Bật nhạc"}
          >
            {playing ? "🎵" : "🔇"}
          </button>
        </div>
      ) : null}
    </>
  );
}

/* ══ Step 1 – Việt Thi sticker card ════════════════════════ */
function StepThi() {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
      {/* photo with sticker overlays */}
      <div className="relative mx-auto shrink-0">
        {/* glow blob */}
        <div className="absolute -inset-8 rounded-full bg-rose/20" />
        <div className="relative float-slow">
          <div className="relative h-80 w-60 overflow-hidden rounded-4xl border-[7px] border-white shadow-[0_16px_48px_rgba(249,168,201,0.4)] md:h-85 md:w-64">
            <Image
              src="/photos/01-tot-nghiep.png"
              alt="Việt Thi"
              fill
              className="object-cover"
              sizes="280px"
              priority
            />
          </div>
          {/* sticker overlays */}
          <span
            className="absolute -right-3 -top-4 text-4xl drop-shadow-md"
            style={{ transform: "rotate(14deg)" }}
            aria-hidden
          >
            🎓
          </span>
          <span
            className="absolute -bottom-3 -left-4 text-3xl drop-shadow-md"
            style={{ transform: "rotate(-11deg)" }}
            aria-hidden
          >
            💗
          </span>
          <span
            className="absolute -right-5 top-1/2 text-2xl drop-shadow-md"
            style={{ transform: "rotate(9deg) translateY(-50%)" }}
            aria-hidden
          >
            ✨
          </span>
        </div>
      </div>

      {/* text */}
      <div className="space-y-5 text-center md:text-left">
        <h2 className="font-script text-5xl leading-tight text-navy md:text-6xl">
          Thi ơi... cậu sắp đi xa rồi 🥺
        </h2>
        <p className="text-lg leading-8 text-navy/75">
          Cả nhà Chánh Tâm đều biết — đây không phải chia tay, chỉ là cậu đi
          xa hơn một chút thôi. Chúng mình tự hào lắm, thương lắm, và muốn
          cậu mang theo thật nhiều ấm áp.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm md:justify-start">
          <span className="rounded-full bg-blush px-4 py-2 font-semibold text-plum">✈️ Huế → Mỹ</span>
          <span className="rounded-full bg-[#f0f4ff] px-4 py-2 font-semibold text-plum">🏡 Phước Duyên vẫn là nhà</span>
        </div>
      </div>
    </div>
  );
}

/* ══ Step 2 – Memory polaroids ═════════════════════════════ */
function StepMemories() {
  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="font-script text-5xl text-navy">Những khoảnh khắc mình có nhau 🫶</h2>
        <p className="mt-2 text-navy/60">
          Mỗi tấm ảnh là một mảnh Huế theo cậu sang bên đó.
        </p>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {MEMORY_PHOTOS.map(({ src, tilt, tall }, i) => (
          <div
            key={src}
            className="mb-4 break-inside-avoid"
            style={{ transform: `rotate(${tilt})` }}
          >
            <figure
              className="polaroid-card rounded-[1.4rem] bg-white p-2.5 shadow-[0_6px_28px_rgba(0,0,0,0.08)]"
              style={{ animationDelay: `${i * 120}ms` } as React.CSSProperties}
            >
              <div
                className={`relative overflow-hidden rounded-xl bg-blush ${
                  tall ? "aspect-3/4" : "aspect-4/3"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>
              {/* polaroid bottom strip */}
              <div className="h-6" />
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══ Step 3 – Chánh Tâm banner ════════════════════════════ */
function StepChanTam() {
  return (
    <div className="space-y-5">
      {/* banner at natural 4:1 ratio — no crop, full design visible */}
      <div className="overflow-hidden rounded-3xl shadow-xl">
        <Image
          src="/photos/banner-chanh-tam.png"
          alt="Chánh Tâm – Nhà là nơi để về"
          width={1024}
          height={256}
          className="w-full h-auto"
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
        />
      </div>

      {/* description card below the banner */}
      <div className="rounded-3xl bg-white px-8 py-7 shadow-[0_4px_24px_rgba(0,0,0,0.07)] ring-1 ring-white/80">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-plum/70">
          Học Chúng Chánh Tâm · Tự Viện Phước Duyên
        </p>
        <h2 className="mt-2 font-script text-4xl text-navy sm:text-5xl">
          Nhà vẫn ở đây, đợi cậu về 🏡
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-8 text-navy/75">
          Tự Viện Phước Duyên và cả nhà Chánh Tâm vẫn ở đây chờ cậu. Cứ đi
          hết mình nha Thi — bất cứ lúc nào nhớ nhà, chỗ này vẫn còn nguyên đó.
        </p>
      </div>
    </div>
  );
}
