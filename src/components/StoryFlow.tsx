"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const CONFETTI_POOL = ["🌸", "💗", "✨", "🎀", "💌", "🌷", "⭐", "🍀", "🩷", "🌺"];

const NEXT_LABELS: Record<number, string> = {
  1: "Xem lại những kỷ niệm 🌸",
  2: "Chánh Tâm là nhà 🏠",
  3: "Đọc lời chúc cuối cùng 💌",
};

/* exit/enter CSS class map */
const EXIT:  Record<number, string> = { 1: "exit-1", 2: "exit-2", 3: "exit-3" };
const ENTER: Record<number, string> = { 1: "enter-1", 2: "enter-2", 3: "enter-3", 4: "enter-4" };

/* ── helpers ─────────────────────────────────────────── */
function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function spawnConfetti() {
  const host = document.createElement("div");
  host.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
  for (let i = 0; i < 24; i++) {
    const el = document.createElement("span");
    el.textContent = CONFETTI_POOL[Math.floor(Math.random() * CONFETTI_POOL.length)];
    const size  = 14 + Math.random() * 22;
    const rot   = (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 420);
    const delay = Math.random() * 550;
    const dur   = 1200 + Math.random() * 900;
    el.style.cssText = `
      position:absolute;
      font-size:${size}px;
      left:${Math.random() * 100}%;
      top:-50px;
      --rot:${rot}deg;
      animation:confetti-fall ${dur}ms ${delay}ms ease-in both;
    `;
    host.appendChild(el);
  }
  document.body.appendChild(host);
  setTimeout(() => host.remove(), 3200);
}

/* ── main component ───────────────────────────────────── */
export function StoryFlow() {
  const searchParams = useSearchParams();
  const cameFromForm = searchParams.get("gui") === "ok";

  const [displayStep, setDisplayStep] = useState(cameFromForm ? 4 : 0);
  const [isExiting,   setIsExiting]   = useState(false);
  const [isOpening,   setIsOpening]   = useState(false);
  const [playing,     setPlaying]     = useState(false);
  const [btnVisible,  setBtnVisible]  = useState(false);
  const [toast,       setToast]       = useState(cameFromForm);

  const audioRef    = useRef<HTMLAudioElement>(null);
  const btnTimerRef = useRef<number | null>(null);

  /* delayed "next" button reveal after entering a step */
  useEffect(() => {
    if (displayStep === 0 || displayStep === 4) return;
    btnTimerRef.current = window.setTimeout(() => setBtnVisible(true), 1800);
    return () => { if (btnTimerRef.current) clearTimeout(btnTimerRef.current); };
  }, [displayStep]);

  /* auto-dismiss toast after 4 s */
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(false), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  /* music */
  async function playMusic() {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.38;
    try { await a.play(); setPlaying(true); }
    catch { setPlaying(false); }
  }

  async function toggleMusic() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else await playMusic();
  }

  /* open envelope → step 1 */
  async function openEnvelope() {
    if (isOpening) return;
    setIsOpening(true);
    setBtnVisible(false);
    await playMusic();
    await sleep(1300); /* flap animation */
    spawnConfetti();
    await sleep(380);
    setDisplayStep(1);
    setIsOpening(false);
  }

  /* go to next step with exit → enter transition */
  async function goNext() {
    if (isExiting || displayStep >= 4) return;
    setBtnVisible(false);
    spawnConfetti();
    setIsExiting(true);
    await sleep(450);
    setDisplayStep((s) => s + 1);
    setIsExiting(false);
  }

  function goPrev() {
    if (isExiting || displayStep <= 1) return;
    setBtnVisible(false);
    setDisplayStep((s) => s - 1);
  }

  return (
    <>
      <audio ref={audioRef} src="/audio/nhac-chia-tay.mp3" loop preload="auto" />

      {/* ══ STEP 0 – fullscreen envelope overlay ══════════════ */}
      {displayStep === 0 ? (
        <div
          className="fixed inset-0 z-30 flex flex-col items-center justify-center overflow-hidden px-4"
          style={{ background: "linear-gradient(160deg,#fff0f8 0%,#f3effe 55%,#e8f6ff 100%)" }}
        >
          {/* ambient petals */}
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
            Có thư gửi Việt Thi 💌
          </p>

          {/* envelope button — responsive: grows on wider screens */}
          <button
            type="button"
            onClick={openEnvelope}
            disabled={isOpening}
            className="group relative w-[min(90vw,300px)] focus:outline-none sm:w-105 lg:w-145"
            style={{ aspectRatio: "300/220", perspective: "1400px" }}
          >
            {/* body */}
            <div
              className="absolute inset-0 rounded-[1.6rem] transition-shadow group-hover:shadow-[0_32px_80px_rgba(200,120,80,0.4)]"
              style={{
                background: "linear-gradient(145deg,#fde8c8,#f5c49a)",
                boxShadow: "0 20px 60px rgba(200,120,80,0.25),0 4px 16px rgba(200,120,80,0.15)",
              }}
            />
            {/* interior folds */}
            <div
              className="absolute inset-0 rounded-[1.6rem]"
              style={{
                clipPath: "polygon(0 0,0 100%,50% 55%)",
                background: "linear-gradient(160deg,#f9d4a8,#edb880)",
              }}
            />
            <div
              className="absolute inset-0 rounded-[1.6rem]"
              style={{
                clipPath: "polygon(100% 0,100% 100%,50% 55%)",
                background: "linear-gradient(200deg,#f9d4a8,#edb880)",
              }}
            />
            <div
              className="absolute inset-0 rounded-b-[1.6rem]"
              style={{
                clipPath: "polygon(0 100%,50% 48%,100% 100%)",
                background: "linear-gradient(170deg,#f0c080,#e09060)",
              }}
            />
            {/* letter (slides up on opening) */}
            <div
              className="absolute left-[3%] right-[3%] rounded-xl bg-white/95 shadow-md"
              style={{
                bottom: "5%",
                padding: "4% 6%",
                zIndex: 5,
                transform: isOpening ? "translateY(-58%)" : "translateY(0)",
                transition: "transform 0.95s 0.35s cubic-bezier(0.2,0.95,0.3,1)",
              }}
            >
              <p className="font-script text-[clamp(1rem,3vw,1.6rem)] text-plum">
                Gửi Việt Thi 🌸
              </p>
              <p className="mt-1 text-[clamp(0.65rem,1.5vw,0.9rem)] leading-5 text-navy/60">
                Từ Học Chúng Chánh Tâm · Tự Viện Phước Duyên · Huế
              </p>
            </div>
            {/* flap */}
            <div
              className="absolute left-0 right-0 top-0 rounded-t-[1.6rem]"
              style={{
                height: "55%",
                clipPath: "polygon(0 0,100% 0,50% 100%)",
                background: "linear-gradient(160deg,#f5c07a,#e09060)",
                transformOrigin: "top center",
                transform: isOpening ? "rotateX(-176deg)" : "rotateX(0deg)",
                transition: "transform 1.1s cubic-bezier(0.2,0.8,0.2,1)",
                zIndex: 10,
              }}
            />
          </button>

          <p className="mt-6 animate-pulse text-sm text-navy/55 lg:mt-10 lg:text-base">
            {isOpening ? "Đang mở thư..." : "Nhấp để mở lá thư"}
          </p>
        </div>
      ) : null}

      {/* ══ STEPS 1-4 ══════════════════════════════════════════ */}
      {displayStep > 0 ? (
        <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-8 sm:px-6 md:px-8">
          {/* step progress dots */}
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

          {/* step content — key change triggers enter animation */}
          <div
            key={displayStep}
            className={isExiting ? (EXIT[displayStep] ?? "") : (ENTER[displayStep] ?? "")}
          >
            {displayStep === 1 && <StepThi />}
            {displayStep === 2 && <StepMemories />}
            {displayStep === 3 && <StepChanTam />}
            {displayStep === 4 && <WishWall />}
          </div>

          {/* nav buttons (appear with delay) */}
          {displayStep < 4 ? (
            <div
              className={`mt-10 flex items-center justify-center gap-3 transition-all duration-700 ${
                btnVisible
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-6 opacity-0"
              }`}
            >
              {displayStep > 1 ? (
                <button
                  type="button"
                  onClick={goPrev}
                  className="rounded-full border-2 border-rose/40 px-5 py-2.5 text-sm font-semibold text-rose/80 transition hover:border-rose hover:text-rose"
                >
                  ← Quay lại
                </button>
              ) : null}
              <button
                type="button"
                onClick={goNext}
                disabled={isExiting}
                className="rounded-full bg-linear-to-r from-rose to-petal px-7 py-3 text-sm font-bold text-white shadow-[0_4px_20px_rgba(249,168,201,0.45)] transition hover:scale-105 hover:shadow-[0_6px_30px_rgba(249,168,201,0.65)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {NEXT_LABELS[displayStep]}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* sent-wish toast */}
      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy shadow-xl ring-1 ring-rose/30">
          🌸 Lời chúc đã gửi! Cảm ơn bạn.
        </div>
      ) : null}

      {/* music toggle (fixed, appears after step 0) */}
      {displayStep > 0 ? (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            type="button"
            onClick={toggleMusic}
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-2xl shadow-xl ring-2 ring-rose/30 backdrop-blur-sm transition hover:-translate-y-0.5 ${
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
        <div className="absolute -inset-8 rounded-full bg-linear-to-br from-rose/20 to-petal/25 blur-3xl" />
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
          Thi sắp đi Mỹ rồi...
        </h2>
        <p className="text-lg leading-8 text-navy/75">
          Cả nhà Chánh Tâm biết đây là một cuộc chia tay lớn. Chúng mình tự
          hào, thương, và muốn gửi cậu một hành trình thật ấm áp.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm md:justify-start">
          <span className="rounded-full bg-blush px-4 py-2 font-semibold text-plum">✈️ Từ Huế sang Mỹ</span>
          <span className="rounded-full bg-[#f0f4ff] px-4 py-2 font-semibold text-plum">🙏 Phước Duyên trong tim</span>
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
        <h2 className="font-script text-5xl text-navy">Những kỷ niệm</h2>
        <p className="mt-2 text-navy/60">
          Chánh Tâm giữ lại đây, gửi theo cậu sang Mỹ.
        </p>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {MEMORY_PHOTOS.map(({ src, tilt, tall }, i) => (
          <figure
            key={src}
            className="polaroid-card mb-4 break-inside-avoid rounded-[1.4rem] bg-white p-2.5 shadow-[0_6px_28px_rgba(0,0,0,0.08)]"
            style={
              {
                "--tilt": tilt,
                animationDelay: `${i * 120}ms`,
              } as React.CSSProperties
            }
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
          Nhà là nơi để về
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-8 text-navy/75">
          Tự Viện Phước Duyên và Học Chúng Chánh Tâm vẫn ở đây. Cứ đi hết
          mình với hành trình mới — phía sau luôn có một nơi gọi là nhà.
        </p>
      </div>
    </div>
  );
}
