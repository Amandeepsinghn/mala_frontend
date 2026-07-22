"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80";

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryImages = images.length > 0 ? images : [FALLBACK_IMAGE];
  const hasMultiple = galleryImages.length > 1;

  function showPrevious() {
    setActiveIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1,
    );
  }

  return (
    <div className="w-full">
      {hasMultiple && (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 sm:hidden">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}-mobile`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-stone-100",
                activeIndex === index
                  ? "border-stone-900"
                  : "border-transparent",
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover object-center"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      <div
        className={cn(
          "grid w-full gap-3",
          hasMultiple
            ? "grid-cols-[72px_minmax(0,1fr)] sm:grid-cols-[80px_minmax(0,1fr)]"
            : "grid-cols-1",
        )}
      >
        {hasMultiple && (
          <div
            className="hidden min-h-0 gap-2 self-stretch sm:grid"
            style={{
              gridTemplateRows: `repeat(${galleryImages.length}, minmax(0, 1fr))`,
            }}
          >
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative min-h-0 w-full overflow-hidden rounded-md border-2 bg-stone-100",
                  activeIndex === index
                    ? "border-stone-900"
                    : "border-transparent hover:border-stone-300",
                )}
                aria-label={`View image ${index + 1}`}
                aria-current={activeIndex === index}
              >
                <Image
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-stone-100 sm:aspect-square">
          <Image
            src={galleryImages[activeIndex]}
            alt={`${alt} - image ${activeIndex + 1}`}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
          />

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-md transition-colors hover:bg-white"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-md transition-colors hover:bg-white"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
