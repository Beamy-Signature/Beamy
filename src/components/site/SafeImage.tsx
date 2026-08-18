"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { isUsableImageUrl } from "@/lib/media";

export function SafeImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  const src = typeof props.src === "string" ? props.src : null;
  if (failed || !isUsableImageUrl(src)) return null;
  return <Image {...props} src={src} onError={() => setFailed(true)} />;
}
