"use client";

import Image from "next/image";
import { useState } from "react";

type PolaroidImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  fallback: string;
};

export function PolaroidImage({
  src,
  alt,
  sizes,
  priority,
  fallback,
}: PolaroidImageProps) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    return (
      <div className="flex h-full items-center justify-center bg-blush text-6xl">
        {fallback}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      priority={priority}
      onError={() => setOk(false)}
    />
  );
}
