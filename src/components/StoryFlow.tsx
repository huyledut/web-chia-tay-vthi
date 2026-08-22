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

const MEMORY_TILTS = [
  "1.5deg",
  "-2deg",
  "-1deg",
  "2.5deg",
  "-1.5deg",
  "1deg",
  "-2deg",
  "2deg",
  "1.8deg",
  "-1.4deg",
] as const;

function wishImageList(wishes: Wish[]) {
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const wish of wishes) {
    const url = wish.imageUrl?.trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }
  return urls;
}

const CONFETTI_POOL = ["🌸", "💗", "✨", "🎀", "💌", "🌷", "⭐", "🌺"];

const NEXT_LABELS: Record<number, string> = {
  1: "Cùng tua lại những khoảnh khắc nhé 🌸",
  2: "Chánh Tâm mãi là gia đình 🏡",
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
      className="envelope-visual pointer-events-none relative block"
      aria-hidden
    >
      <span className="block w-full" style={{ paddingBottom: "73.33%" }} />

      <span className="envelope-card absolute inset-0 overflow-hidden rounded-[22px] sm:rounded-[28px]">
        <span className="envelope-glow absolute inset-x-[7%] bottom-[7%] top-[12%] rounded-[22px] sm:rounded-[26px]" />

        <span
          className="absolute left-[6%] right-[6%] rounded-[18px] bg-white/95 text-left shadow-[0_18px_48px_rgba(255,255,255,0.5)] sm:rounded-[22px]"
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
          <span className="block font-script text-[0.95rem] text-plum sm:text-[1.1rem] md:text-2xl">
            Gửi Việt Thi 🌸
          </span>
          <span className="mt-0.5 block text-[0.65rem] leading-4 text-navy/60 sm:mt-1 sm:text-[0.7rem] sm:leading-5 md:text-sm">
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
          className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 text-2xl drop-shadow-sm sm:text-3xl"
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
  const [liveWishes, setLiveWishes] = useState<Wish[]>(fireWishes);
  const audioRef = useRef<HTMLAudioElement>(null);

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
            setLiveWishes(
              snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<Wish, "id">),
              }))
            );
          },
          () => {
            /* keep server wishes if live listener fails */
          }
        );
      })
      .catch(() => {
        /* iOS / Messenger: keep SSR wishes */
      });

    return () => unsub?.();
  }, []);

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
          className="relative z-30 flex h-svh max-h-svh flex-col items-center justify-center overflow-hidden px-4 py-4 text-center sm:py-6"
          style={{ perspective: "1500px" }}
        >
          <div className="relative max-w-3xl shrink-0 px-1">
            <p className="mb-2 inline-flex max-w-[95%] rounded-full bg-white/78 px-3 py-1.5 text-[10px] font-semibold tracking-[0.08em] text-plum/75 shadow-[0_10px_30px_rgba(155,184,150,0.18)] ring-1 ring-white/70 backdrop-blur-sm sm:mb-3 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.12em]">
              Lá thư nhỏ, tình thương to
            </p>
            <h1 className="step0-title mx-auto max-w-[22ch] pb-0.5 font-script leading-[1.15] text-balance text-navy drop-shadow-sm sm:max-w-none">
              Thi ơi, có lá thư gói ghém yêu thương Chánh Tâm gửi cậu nè
            </h1>
            <p className="step0-sub mx-auto mt-2 max-w-xl text-pretty text-navy/70 sm:mt-3">
              Bên trong là một số điều mọi người gửi cậu kèm nhiều tình thương,
              nhiều nỗi nhớ để cậu làm hành trang cho hành trình sắp tới.
            </p>
          </div>

          <button
            type="button"
            onClick={openEnvelope}
            disabled={isTransitioning}
            className="group relative mt-4 shrink-0 touch-manipulation focus:outline-none sm:mt-6"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <span className="envelope-halo absolute -inset-6 rounded-full sm:-inset-10" />
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

          <div className="mt-4 shrink-0 space-y-2 sm:mt-5 sm:space-y-3">
            <p className="inline-flex max-w-[20rem] items-center justify-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-center text-[11px] font-semibold leading-snug text-plum shadow-[0_10px_35px_rgba(155,184,150,0.2)] ring-1 ring-white/75 backdrop-blur-sm sm:max-w-md sm:px-5 sm:py-2 sm:text-sm">
              <span className="shrink-0 text-base">{isOpening ? "🎶" : "💗"}</span>
              {isOpening
                ? "Tiếng lòng Chánh Tâm đang ngân lên rồi..."
                : "Chạm vào lá thư để phát nên tiếng lòng của anh chị em Chánh Tâm nhé!"}
            </p>
          </div>
        </section>
      ) : null}

      {renderStep > 0 ? (
        <section
          className={`mx-auto w-full px-4 sm:px-6 md:px-8 ${
            displayStep === 1 || displayStep === 4
              ? "flex h-svh max-h-svh min-h-0 flex-col overflow-hidden pt-4 pb-5 lg:px-10"
              : "min-h-dvh max-w-5xl pb-28 pt-8"
          } ${displayStep === 4 || displayStep === 1 ? "max-w-7xl" : ""}`}
        >
          <div
            className={`flex shrink-0 items-center justify-center gap-2 ${
              displayStep === 1 || displayStep === 4 ? "mb-3 lg:mb-4" : "mb-10"
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
            className={`min-h-0 ${
              displayStep === 1 || displayStep === 4 ? "flex flex-1 flex-col" : ""
            } ${isExiting ? (EXIT[displayStep] ?? "") : (ENTER[displayStep] ?? "")}`}
          >
            {displayStep === 1 && <StepThi />}
            {displayStep === 2 && (
              <StepMemories wishImages={wishImageList(liveWishes)} />
            )}
            {displayStep === 3 && <StepChanTam />}
            {displayStep === 4 && <WishWall initialFireWishes={liveWishes} />}
          </div>

          {displayStep < 4 ? (
            <div
              className={`flex shrink-0 items-center justify-center gap-3 transition-all duration-500 ${
                displayStep === 1 ? "mt-2.5" : "mt-10"
              } ${
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
                className={`rounded-full bg-linear-to-r from-rose to-petal text-sm font-bold text-white shadow-[0_12px_35px_rgba(155,184,150,0.42)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(155,184,150,0.56)] active:scale-[0.985] ${
                  displayStep === 1 ? "px-5 py-2.5" : "px-7 py-3"
                }`}
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
    <div className="content-panel relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] px-4 py-4 shadow-[0_24px_90px_rgba(107,117,104,0.12)] ring-1 ring-white/75 sm:px-6 sm:py-5 lg:rounded-[2.5rem] lg:px-8 lg:py-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white/45 to-transparent" />

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3 overflow-hidden sm:flex-row sm:items-center sm:gap-6 md:gap-8 lg:gap-10">
        <div className="relative mx-auto shrink-0 sm:mx-0">
          <div className="absolute -inset-6 rounded-full bg-radial from-rose/28 via-petal/16 to-transparent blur-2xl" />
          <div className="relative float-slow">
            <div className="step1-photo relative overflow-hidden rounded-[1.35rem] border-[5px] border-white shadow-[0_18px_50px_rgba(155,184,150,0.35)]">
              <Image
                src="/photos/01-tot-nghiep.png"
                alt="Việt Thi"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 140px, (max-width: 1024px) 200px, 260px"
                priority
              />
            </div>
            <span
              className="absolute -right-2 -top-2 text-xl drop-shadow-md sm:text-2xl lg:text-3xl"
              style={{ transform: "rotate(14deg)" }}
              aria-hidden
            >
              🎓
            </span>
            <span
              className="absolute -bottom-2 -left-2 text-lg drop-shadow-md sm:text-xl lg:text-2xl"
              style={{ transform: "rotate(-11deg)" }}
              aria-hidden
            >
              💗
            </span>
          </div>
        </div>

        <div className="step1-copy flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-2 overflow-y-auto text-center overscroll-contain sm:gap-3 sm:text-left md:gap-3.5">
          <p className="shrink-0 text-[10px] font-semibold tracking-[0.18em] text-plum/55 sm:text-[11px]">
            NGÀY ĐÓ SẮP ĐẾN
          </p>
          <h2 className="step1-title shrink-0 pb-0.5 font-script leading-[1.15] text-balance text-navy">
            Thi ơi… ngày đó sắp diễn ra rồi… Ngày cậu kéo vali đến vùng đất hứa
          </h2>
          <p className="step1-body text-pretty text-navy/75">
            Gia đình Chánh Tâm đều biết, đây không chỉ là một chuyến đi mà còn là
            một cột mốc đánh dấu sự trưởng thành, dũng cảm của cậu. Cả nhà tin
            cậu sẽ có một hành trình mới rực rỡ và chúng mình sẽ luôn ủng hộ,
            dõi theo cậu từ Huế.
          </p>
          <div className="flex shrink-0 flex-wrap justify-center gap-1.5 text-[11px] sm:justify-start sm:gap-2 sm:text-xs md:text-sm">
            <span className="rounded-full bg-blush px-3 py-1.5 font-semibold text-plum shadow-[0_10px_24px_rgba(155,184,150,0.12)]">
              ✈️ Huế → Mỹ
            </span>
            <span className="rounded-full bg-[#f0f4ff] px-3 py-1.5 font-semibold text-plum shadow-[0_10px_24px_rgba(168,194,249,0.12)]">
              🏡 Chánh Tâm mãi là gia đình
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepMemories({ wishImages = [] }: { wishImages?: string[] }) {
  const wishPhotos = wishImages.map((src, index) => ({
    src,
    tilt: MEMORY_TILTS[index % MEMORY_TILTS.length],
    tall: index % 3 === 1,
    fromWish: true as const,
  }));

  const photos = [
    ...wishPhotos,
    ...MEMORY_PHOTOS.map((photo) => ({ ...photo, fromWish: false as const })),
  ];

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
          {wishPhotos.length > 0
            ? " Có cả những tấm được gửi kèm lời chúc nữa."
            : null}
        </p>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map(({ src, tilt, tall, fromWish }, index) => (
          <div
            key={`${fromWish ? "wish" : "mem"}-${src}`}
            className="mb-4 break-inside-avoid"
            style={{ transform: `rotate(${tilt})` }}
          >
            <figure
              className="polaroid-card rounded-[1.4rem] bg-white p-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.08)]"
              style={{ animationDelay: `${Math.min(index, 16) * 90}ms` } as React.CSSProperties}
            >
              <div
                className={`relative overflow-hidden rounded-xl bg-blush ${
                  tall ? "aspect-3/4" : "aspect-4/3"
                }`}
              >
                <Image
                  src={src}
                  alt={fromWish ? "Ảnh gửi kèm lời chúc" : ""}
                  fill
                  className="object-cover transition duration-700 hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 360px"
                  unoptimized={fromWish || src.startsWith("http")}
                />
              </div>
              <div className="flex h-6 items-center justify-center">
                {fromWish ? (
                  <span className="text-[10px] font-semibold tracking-[0.12em] text-plum/45">
                    TỪ LỜI CHÚC 💌
                  </span>
                ) : null}
              </div>
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

      <div className="rounded-3xl bg-white px-5 py-6 shadow-[0_10px_38px_rgba(0,0,0,0.08)] ring-1 ring-white/80 sm:px-8 sm:py-7">
        <p className="text-xs font-semibold tracking-[0.18em] text-plum/55">
          CHÁNH TÂM MÃI LÀ GIA ĐÌNH
        </p>
        <h2 className="mt-3 pb-1 font-script text-3xl leading-[1.15] text-navy sm:text-4xl md:text-5xl">
          Đi hết mình, về hết lòng cậu hen! 🏡
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-navy/75 sm:text-base sm:leading-8 md:text-lg">
          Ngôi nhà Phước Duyên và cả gia đình Chánh Tâm luôn trừ một chỗ trống
          chờ cậu về — vị trí của cậu ở trong tim mọi người, nên nhớ lấp đầy
          khoảng trống đó vào một ngày không xa nhé. Nếu ngoài kia sóng gió thì
          về đây tránh bão bất cứ lúc nào cậu muốn. Cửa nhà luôn mở, đón cậu
          trở về. Cả nhà thương Thi.
        </p>
      </div>
    </div>
  );
}
