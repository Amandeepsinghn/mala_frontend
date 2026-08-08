"use client";

import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80";

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}

function ImageLightbox({
  images,
  alt,
  index,
  onClose,
  onIndexChange,
}: {
  images: string[];
  alt: string;
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const hasMultiple = images.length > 1;
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setZoomed(false);
    setOrigin({ x: 50, y: 50 });
  }, [index]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (zoomed) {
          setZoomed(false);
          return;
        }
        onClose();
      }
      if (zoomed) return;
      if (event.key === "ArrowLeft" && hasMultiple) {
        onIndexChange(index === 0 ? images.length - 1 : index - 1);
      }
      if (event.key === "ArrowRight" && hasMultiple) {
        onIndexChange(index === images.length - 1 ? 0 : index + 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [hasMultiple, images.length, index, onClose, onIndexChange, zoomed]);

  function updateOrigin(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  function handleImageClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    updateOrigin(event);
    setZoomed((current) => !current);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} image viewer`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-4 sm:top-4"
        aria-label="Close image viewer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>

      <p className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
        {zoomed ? "Click to zoom out · drag cursor to pan" : "Click image to zoom in"}
      </p>

      {hasMultiple && !zoomed && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onIndexChange(index === 0 ? images.length - 1 : index - 1);
            }}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6 sm:h-11 sm:w-11"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onIndexChange(index === images.length - 1 ? 0 : index + 1);
            }}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:h-11 sm:w-11"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        className={cn(
          "relative h-[70vh] w-full max-w-5xl overflow-hidden sm:mx-12 sm:h-[85vh]",
          zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
        )}
        onClick={handleImageClick}
        onMouseMove={(event) => {
          if (zoomed) updateOrigin(event);
        }}
      >
        <Image
          src={images[index]}
          alt={`${alt} - image ${index + 1}`}
          fill
          className={cn(
            "object-contain transition-transform duration-200 ease-out",
            zoomed && "scale-[2.5]",
          )}
          style={
            zoomed
              ? { transformOrigin: `${origin.x}% ${origin.y}%` }
              : { transformOrigin: "center center" }
          }
          sizes="100vw"
          priority
        />
      </div>

      {hasMultiple && (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
          {index + 1} / {images.length}
        </p>
      )}
    </div>
  );
}

function ThumbnailStrip({
  images,
  alt,
  activeIndex,
  onSelect,
  className,
}: {
  images: string[];
  alt: string;
  activeIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-1", className)}>
      {images.map((image, index) => (
        <button
          key={`${image}-${index}`}
          type="button"
          onClick={() => onSelect(index)}
          className={cn(
            "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-stone-100 sm:h-20 sm:w-20",
            activeIndex === index ? "border-stone-900" : "border-transparent",
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
  );
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
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

  function openLightbox(index: number) {
    setActiveIndex(index);
    setLightboxOpen(true);
  }

  return (
    <div className="w-full min-w-0">
      {/* Mobile / tablet: shorter image so details stay visible */}
      <div className="lg:hidden">
        <div className="relative mx-auto aspect-[4/3] max-h-[42vh] w-full overflow-hidden rounded-xl bg-stone-100 sm:max-h-[46vh] md:aspect-[3/2] md:max-h-[44vh]">
          <button
            type="button"
            onClick={() => openLightbox(activeIndex)}
            className="absolute inset-0 z-0 cursor-zoom-in"
            aria-label="Open full size image"
          >
            <span className="relative block h-full w-full">
              <Image
                src={galleryImages[activeIndex]}
                alt={`${alt} - image ${activeIndex + 1}`}
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
              />
            </span>
          </button>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-md"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-md"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {hasMultiple && (
          <ThumbnailStrip
            images={galleryImages}
            alt={alt}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            className="mt-3"
          />
        )}
      </div>

      {/* Desktop: side thumbs + main image */}
      <div
        className={cn(
          "hidden w-full gap-3 lg:grid",
          hasMultiple
            ? "grid-cols-[80px_minmax(0,1fr)]"
            : "grid-cols-1",
        )}
      >
        {hasMultiple && (
          <div
            className="grid min-h-0 gap-2 self-stretch"
            style={{
              gridTemplateRows: `repeat(${galleryImages.length}, minmax(0, 1fr))`,
            }}
          >
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}-desktop`}
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

        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100">
          <button
            type="button"
            onClick={() => openLightbox(activeIndex)}
            className="absolute inset-0 z-0 cursor-zoom-in"
            aria-label="Open full size image"
          >
            <span className="relative block h-full w-full">
              <Image
                src={galleryImages[activeIndex]}
                alt={`${alt} - image ${activeIndex + 1}`}
                fill
                className="object-cover object-center"
                priority
                sizes="45vw"
              />
            </span>
          </button>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={showPrevious}
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-md transition-colors hover:bg-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-stone-900 shadow-md transition-colors hover:bg-white"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={galleryImages}
          alt={alt}
          index={activeIndex}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setActiveIndex}
        />
      )}
    </div>
  );
}
