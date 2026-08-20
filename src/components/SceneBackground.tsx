import Image from "next/image";

export function SceneBackground() {
  return (
    <div className="scene-bg pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* portrait phones & tablet dọc */}
      <div className="absolute inset-0 max-lg:landscape:hidden lg:hidden">
        <Image
          src="/photos/bg-mobile.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1023px) and (orientation: portrait) 100vw, 0px"
          className="scene-art scene-art-mobile object-cover"
        />
      </div>

      {/* desktop, tablet ngang, điện thoại xoay ngang */}
      <div className="absolute inset-0 hidden max-lg:landscape:block lg:block">
        <Image
          src="/photos/bg-desktop.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 100vw, (max-width: 1023px) and (orientation: landscape) 100vw, 0px"
          className="scene-art scene-art-desktop object-cover"
        />
      </div>

      <div className="scene-vignette absolute inset-0" />
    </div>
  );
}
