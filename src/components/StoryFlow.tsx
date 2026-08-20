"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { WishWall } from "./WishWall";
import type { Wish } from "@/data/wishes";

const MEMORY_PHOTOS = [
  { src: "/photos/04-tet-binh-ngo.png", tilt: "1.5deg", tall: false },
  { src: "/photos/05-chia-tay.png", tilt: "-2deg", tall: false },
  { src: "/photos/03-phat-dan-2023.png", tilt: "-1deg", tall: false },
  { src: "/photos/07-phat-dan-2024.png", tilt: "2.5deg", tall: false },
  { src: "/photos/02-ban-be.png", tilt: "-1.5deg", tall: false },
  { src: "/photos/06-trai-tim.png", tilt: "1deg", tall: true },
  { src: "/photos/08-hoa-va-qua.png", tilt: "-2deg", tall: true },
  { src: "/photos/09-ao-dai.png", tilt: "2deg", tall: true },
  { src: "/photos/mem-extra-1.png", tilt: "1.8deg", tall: false },
  { src: "/photos/mem-extra-2.png", tilt: "-1.4deg", tall: true },
  { src: "/photos/mem-extra-3.png", tilt: "2deg", tall: false },
  { src: "/photos/mem-extra-4.png", tilt: "-2.2deg", tall: false },
] as const;

const CONFETTI_POOL = ["🌸", "💗", "✨", "🎀", "💌", "🌷", "⭐", "🌺"];

const NEXT_LABELS: Record<number, string> = {
  1: "Cùng tua lại những khoảnh khắc nhé 🌸",
  2: "Chánh Tâm mãi là nhà 🏡",
  3: "Mọi người có đôi lời gửi đến Thi iu dấu nè 💌",
};

const ENTER: Record<number, string> = {
  1: "enter-1",
  2: "enter-2",
  3: "enter-3",
  4: "enter-4",
};

const EXIT: Record<number, string> = {
  1: "exit-1",
  2: "exit-2",
  3: "exit-3",
  4: "exit-4",
};

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

function syncStep(step: number) {
  const url = new URL(window.location.href);
  if (step <= 0) {
    url.searchParams.delete("buoc");
    url.searchParams.delete("gui");
  } else {
    url.searchParams.set("buoc", String(step));
    if (step !== 4) url.searchParams.delete("gui");
  }
  window.history.pushState({ step }, "", url);
}

function spawnConfetti() {
  const host = document.createElement("div");
  host.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
  for (let i = 0; i < 28; i++) {
    const el = document.createElement("span");
    const size = 14 + Math.random() * 26;
    const delay = Math.random() * 380;
    const dur = 1250 + Math.random() * 900;
    el.textContent = CONFETTI_POOL[Math.floor(Math.random() * CONFETTI_POOL.length)];
    el.style.cssText = [
      "position:absolute",
      `font-size:${size}px`,
      `left:${Math.random() * 100}%`,
      "top:-48px",
      `animation:confetti-fall ${dur}ms ${delay}ms cubic-bezier(.15,.78,.2,1) both`,
    ].join(";");
    host.appendChild(el);
  }
  document.body.appendChild(host);
  window.setTimeout(() => host.remove(), 3200);
}

function EnvelopeVisual({ isOpening }: { isOpening: boolean }) {
  return (
    <span
      className="pointer-events-none relative block w-[90vw] max-w-75 sm:max-w-105 lg:max-w-145"
      aria-hidden
    >
      <span className="block w-full" style={{ paddingBottom: "73.33%" }} />

      <span className="envelope-card absolute inset-0 overflow-hidden rounded-[28px]">
        <span className="envelope-glow absolute inset-x-[7%] bottom-[7%] top-[12%] rounded-[26px]" />

        <span
          className="absolute left-[6%] right-[6%] rounded-[22px] bg-white/95 text-left shadow-[0_18px_48px_rgba(255,255,255,0.5)]"
          style={{
            bottom: "15%",
            padding: "5% 6%",
            zIndex: 2,
            transform: isOpening
              ? "translateY(-52%) rotate(-1.5deg)"
              : "translateY(0) rotate(0deg)",
            transition:
              "transform 960ms cubic-bezier(0.2, 0.92, 0.2, 1), box-shadow 360ms ease",
          }}
        >
          <span className="block font-script text-[1.1rem] text-plum sm:text-2xl">
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
            transform: isOpening
              ? "translateY(-92%) rotateX(10deg)"
              : "translateY(0) rotateX(0deg)",
            opacity: isOpening ? 0.12 : 1,
            transition:
              "transform 820ms cubic-bezier(0.2, 0.92, 0.2, 1), opacity 520ms ease",
          }}
        >
          <polygon points="0,0 300,0 150,121" fill="#e09060" />
          <polygon points="0,0 300,0 150,108" fill="#f5c07a" />
        </svg>

        <span
          className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 text-3xl drop-shadow-sm"
          style={{
            top: "27%",
            transform: isOpening ? "translateX(-50%) scale(0.75)" : "translateX(-50%) scale(1)",
            opacity: isOpening ? 0 : 1,
            transition: "transform 420ms ease, opacity 320ms ease",
          }}
          aria-hidden
        >
          💗
        </span>
      </span>
    </span>
  );
}

export function StoryFlow({
  cameFromForm = false,
  initialStep = 0,
  fireWishes = [],
}: {
  cameFromForm?: boolean;
  initialStep?: number;
  fireWishes?: Wish[];
}) {
  const [displayStep, setDisplayStep] = useState(cameFromForm ? 4 : initialStep);
  const [renderStep, setRenderStep] = useState(cameFromForm ? 4 : initialStep);
  const [isOpening, setIsOpening] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [toast, setToast] = useState(cameFromForm);
  const [btnVisible, setBtnVisible] = useState((cameFromForm ? 4 : initialStep) > 0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(false), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onPopState = () => {
      const url = new URL(window.location.href);
      const step = Number(url.searchParams.get("buoc") ?? 0);
      const nextStep = Number.isFinite(step) ? Math.min(4, Math.max(0, step)) : 0;
      setDisplayStep(nextStep);
      setRenderStep(nextStep);
      setIsOpening(false);
      setIsExiting(false);
      setBtnVisible(nextStep > 0);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (displayStep <= 0 || displayStep >= 4) {
      const immediate = window.setTimeout(() => setBtnVisible(displayStep > 0), 0);
      return () => window.clearTimeout(immediate);
    }
    const hide = window.setTimeout(() => setBtnVisible(false), 0);
    const timer = window.setTimeout(() => setBtnVisible(true), 760);
    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(timer);
    };
  }, [displayStep]);

  function playMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    try {
      const maybe = audio.play();
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
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    playMusic();
  }

  async function openEnvelope() {
    if (isOpening || isTransitioning) return;
    setIsOpening(true);
    setIsTransitioning(true);
    playMusic();
    window.setTimeout(() => spawnConfetti(), 320);
    await sleep(1240);
    syncStep(1);
    setDisplayStep(1);
    setRenderStep(1);
    setIsOpening(false);
    setIsTransitioning(false);
  }

  async function goToStep(nextStep: number) {
    if (isTransitioning || nextStep === displayStep) return;
    if (nextStep < 0 || nextStep > 4) return;
    if (nextStep === 0) {
      syncStep(0);
      setDisplayStep(0);
      setRenderStep(0);
      return;
    }

    setIsTransitioning(true);
    setBtnVisible(false);
    setIsExiting(true);
    spawnConfetti();
    await sleep(420);
    syncStep(nextStep);
    setDisplayStep(nextStep);
    setRenderStep(nextStep);
    setIsExiting(false);
    setIsTransitioning(false);
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/nhac-chia-tay.mp3"
        loop
        preload="auto"
        playsInline
      />

      {renderStep === 0 ? (
        <section
          className="relative z-30 flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-10 text-center"
          style={{ perspective: "1500px" }}
        >
          <div className="relative max-w-3xl">
            <p className="mb-3 inline-flex rounded-full bg-white/78 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-plum/75 shadow-[0_10px_30px_rgba(155,184,150,0.18)] ring-1 ring-white/70 backdrop-blur-sm">
              THƯ NHỎ TỪ CHÁNH TÂM
            </p>
            <h1 className="pb-1 font-script text-5xl leading-[1.1] text-navy drop-shadow-sm sm:text-6xl lg:text-7xl">
              Thi ơi, có thư này gửi cho cậu nè 💌
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-navy/70 sm:text-lg">
              Bên trong là một chút thương, một chút nhớ, và rất nhiều điều muốn
              gửi theo cậu trong hành trình mới.
            </p>
          </div>

          <button
            type="button"
            onClick={openEnvelope}
            disabled={isTransitioning}
            className="group relative mt-10 touch-manipulation focus:outline-none"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <span className="envelope-halo absolute -inset-10 rounded-full" />
            <span
              className="block transition-transform duration-700 ease-out group-hover:-translate-y-1 group-active:scale-[0.985]"
              style={{
                transform: isOpening
                  ? "translateY(-6px) rotate(-1deg) scale(1.02)"
                  : undefined,
              }}
            >
              <EnvelopeVisual isOpening={isOpening} />
            </span>
          </button>

          <div className="mt-7 space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-semibold text-plum shadow-[0_10px_35px_rgba(155,184,150,0.2)] ring-1 ring-white/75 backdrop-blur-sm">
              <span className="text-base">{isOpening ? "🎶" : "💗"}</span>
              {isOpening
                ? "Nhạc đang ngân lên rồi đó..."
                : "Chạm vào lá thư để mở nhạc và bắt đầu"}
            </p>
            <p className="text-xs tracking-[0.14em] text-plum/55">
              BẤT NGỜ NHỎ ĐANG CHỜ PHÍA SAU
            </p>
          </div>
        </section>
      ) : null}

      {renderStep > 0 ? (
        <section
          className={`mx-auto min-h-dvh w-full px-4 pt-8 sm:px-6 md:px-8 ${
            displayStep === 4 ? "max-w-7xl pb-8 lg:px-10" : "max-w-5xl pb-28"
          }`}
        >
          <div
            className={`flex items-center justify-center gap-2 ${
              displayStep === 4 ? "mb-4 lg:mb-5" : "mb-10"
            }`}
          >
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`rounded-full transition-all duration-500 ${
                  step === displayStep
                    ? "h-2.5 w-12 bg-linear-to-r from-rose to-petal shadow-[0_0_18px_rgba(155,184,150,0.3)]"
                    : step < displayStep
                      ? "h-2.5 w-2.5 bg-rose/45"
                      : "h-2.5 w-2.5 bg-rose/15"
                }`}
              />
            ))}
          </div>

          <div
            key={displayStep}
            className={isExiting ? (EXIT[displayStep] ?? "") : (ENTER[displayStep] ?? "")}
          >
            {displayStep === 1 && <StepThi />}
            {displayStep === 2 && <StepMemories />}
            {displayStep === 3 && <StepChanTam />}
            {displayStep === 4 && <WishWall initialFireWishes={fireWishes} />}
          </div>

          {displayStep < 4 ? (
            <div
              className={`mt-10 flex items-center justify-center gap-3 transition-all duration-500 ${
                btnVisible
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-4 opacity-0"
              }`}
            >
              {displayStep > 1 ? (
                <button
                  type="button"
                  onClick={() => void goToStep(displayStep - 1)}
                  className="rounded-full border-2 border-rose/35 bg-white/80 px-5 py-2.5 text-sm font-semibold text-rose/85 shadow-[0_8px_30px_rgba(155,184,150,0.12)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-rose hover:text-rose active:scale-[0.985]"
                >
                  ← Quay lại
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => void goToStep(displayStep + 1)}
                className="rounded-full bg-linear-to-r from-rose to-petal px-7 py-3 text-sm font-bold text-white shadow-[0_12px_35px_rgba(155,184,150,0.42)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(155,184,150,0.56)] active:scale-[0.985]"
              >
                {NEXT_LABELS[displayStep]}
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white/94 px-6 py-3 text-sm font-semibold text-navy shadow-[0_16px_40px_rgba(155,184,150,0.25)] ring-1 ring-rose/30 backdrop-blur-sm">
          🌸 Gửi rồi nha! Cảm ơn bạn nhiều lắm 💗
        </div>
      ) : null}

      {renderStep > 0 ? (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            type="button"
            onClick={toggleMusic}
            className={`flex h-14 w-14 items-center justify-center rounded-full bg-white/92 text-2xl shadow-[0_16px_40px_rgba(155,184,150,0.24)] ring-2 ring-rose/25 backdrop-blur-sm transition hover:-translate-y-0.5 active:scale-[0.985] ${
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

function StepThi() {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
      <div className="relative mx-auto shrink-0">
        <div className="absolute -inset-10 rounded-full bg-radial from-rose/30 via-petal/18 to-transparent blur-2xl" />
        <div className="relative float-slow">
          <div className="relative h-80 w-60 overflow-hidden rounded-4xl border-[7px] border-white shadow-[0_18px_58px_rgba(155,184,150,0.38)] md:h-85 md:w-64">
            <Image
              src="/photos/01-tot-nghiep.png"
              alt="Việt Thi"
              fill
              className="object-cover"
              sizes="280px"
              priority
            />
          </div>
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

      <div className="space-y-5 text-center md:text-left">
        <p className="text-xs font-semibold tracking-[0.18em] text-plum/55">
          CHƯƠNG ĐẦU TIÊN
        </p>
        <h2 className="pb-1 font-script text-5xl leading-[1.1] text-navy md:text-6xl">
          Thi ơi... cậu sắp đi xa rồi 🥺
        </h2>
        <p className="text-lg leading-8 text-navy/75">
          Cả nhà Chánh Tâm đều biết, đây không chỉ là một chuyến đi. Nó là một
          cột mốc rất đẹp, rất dũng cảm, và cũng khiến tụi mình thấy thương cậu
          nhiều hơn một chút.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm md:justify-start">
          <span className="rounded-full bg-blush px-4 py-2 font-semibold text-plum shadow-[0_10px_24px_rgba(155,184,150,0.12)]">
            ✈️ Huế → Mỹ
          </span>
          <span className="rounded-full bg-[#f0f4ff] px-4 py-2 font-semibold text-plum shadow-[0_10px_24px_rgba(168,194,249,0.12)]">
            🏡 Phước Duyên vẫn là nhà
          </span>
        </div>
      </div>
    </div>
  );
}

function StepMemories() {
  return (
    <div>
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold tracking-[0.18em] text-plum/55">
          NHỮNG MẢNH NHỚ NHO NHỎ
        </p>
        <h2 className="mt-3 pb-1 font-script text-5xl leading-[1.1] text-navy">
          Những khoảnh khắc mình có nhau 🫶
        </h2>
        <p className="mt-2 text-navy/60">
          Mỗi tấm ảnh giống như một mảnh ký ức đang chạy theo cậu vậy đó.
        </p>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {MEMORY_PHOTOS.map(({ src, tilt, tall }, index) => (
          <div
            key={src}
            className="mb-4 break-inside-avoid"
            style={{ transform: `rotate(${tilt})` }}
          >
            <figure
              className="polaroid-card rounded-[1.4rem] bg-white p-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.08)]"
              style={{ animationDelay: `${index * 120}ms` } as React.CSSProperties}
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
                  className="object-cover transition duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 360px"
                />
              </div>
              <div className="h-6" />
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepChanTam() {
  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl shadow-[0_20px_54px_rgba(124,92,138,0.12)]">
        <Image
          src="/photos/banner-chanh-tam.png"
          alt="Chánh Tâm - Nhà là nơi để về"
          width={1024}
          height={256}
          className="h-auto w-full"
          sizes="(max-width: 1024px) 100vw, 1024px"
          priority
        />
      </div>

      <div className="rounded-3xl bg-white px-8 py-7 shadow-[0_10px_38px_rgba(0,0,0,0.08)] ring-1 ring-white/80">
        <p className="text-xs font-semibold tracking-[0.18em] text-plum/55">
          LUÔN CÓ MỘT NƠI CHỜ CẬU
        </p>
        <h2 className="mt-3 pb-1 font-script text-4xl leading-[1.1] text-navy sm:text-5xl">
          Nhà vẫn ở đây, đợi cậu về 🏡
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-navy/75">
          Tự Viện Phước Duyên và cả nhà Chánh Tâm vẫn ở đây chờ cậu. Cứ đi hết
          mình nha Thi, rồi khi nào nhớ, nơi này vẫn dịu dàng mở cửa cho cậu về.
        </p>
      </div>
    </div>
  );
}
