"use client";

import { SafeImage } from "@/components/site/SafeImage";
import { useCallback, useEffect, useState } from "react";

export type HeroSlide = {
  url: string;
  alt: string;
};

export function HeroSlideshow({
  images,
  children,
}: {
  images: HeroSlide[];
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slides = images.length > 0 ? images : [];

  const goTo = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      setIndex((next + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const timer = window.setInterval(() => goTo(index + 1), 5500);
    return () => window.clearInterval(timer);
  }, [goTo, index, paused, slides.length]);

  return (
    <section
      className="relative min-h-dvh overflow-hidden bg-ink text-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, slideIndex) => (
        <div
          key={slide.url}
          className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-out ${
            slideIndex === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <SafeImage
            src={slide.url}
            alt={slide.alt}
            fill
            priority={slideIndex === 0}
            className={`object-cover ${slideIndex === index ? "hero-kenburns" : ""}`}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />

      <div className="relative mx-auto flex min-h-dvh w-full min-w-0 max-w-7xl flex-col justify-end px-4 pb-24 sm:px-5 md:px-8 md:pb-28">
        <div className="min-w-0 max-w-full">{children}</div>

        {slides.length > 0 ? (
          <div className="mt-10 flex w-full min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="hidden gap-2 md:flex">
              {slides.map((slide, slideIndex) => (
                <button
                  key={slide.url}
                  type="button"
                  onClick={() => goTo(slideIndex)}
                  aria-label={`Show ${slide.alt}`}
                  className={`relative h-16 w-12 overflow-hidden border transition-all duration-500 ${
                    slideIndex === index
                      ? "border-gold opacity-100"
                      : "border-white/20 opacity-60 hover:opacity-100"
                  }`}
                >
                  <SafeImage src={slide.url} alt="" fill className="object-cover" sizes="48px" />
                </button>
              ))}
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
              <p className="shrink-0 text-[11px] tracking-[0.16em] text-paper/70 sm:tracking-[0.28em]">
                {String(index + 1).padStart(2, "0")} — {String(slides.length).padStart(2, "0")}
              </p>
              <div className="flex min-w-0 flex-wrap gap-1.5">
                {slides.map((slide, slideIndex) => (
                  <button
                    key={`dot-${slide.url}`}
                    type="button"
                    aria-label={`Go to image ${slideIndex + 1}`}
                    onClick={() => goTo(slideIndex)}
                    className={`h-1 w-6 transition-colors duration-500 sm:w-8 ${
                      slideIndex === index ? "bg-gold" : "bg-paper/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
