/* eslint-disable @next/next/no-img-element */
import type { GalleryImage } from "@/lib/cms";

interface GalleryFilmStripProps {
  images: GalleryImage[];
}

/** Full-bleed film strip marquee — decorative scroll, no lightbox. */
export default function GalleryFilmStrip({ images }: GalleryFilmStripProps) {
  if (images.length === 0) return null;

  // Duplicate enough frames for a seamless loop on wide screens.
  const frames = [...images, ...images, ...images];

  return (
    <section
      aria-label="Gallery film strip"
      className="relative mt-10 overflow-hidden bg-green-darker py-5 sm:mt-12 sm:py-6"
    >
      {/* Sprocket rails */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 flex h-3 justify-between px-2 sm:h-3.5 sm:px-3"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={`top-${i}`}
            className="mt-1 h-1.5 w-2.5 rounded-[2px] bg-cream/25 sm:h-2 sm:w-3"
          />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex h-3 justify-between px-2 sm:h-3.5 sm:px-3"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={`bot-${i}`}
            className="mb-1 h-1.5 w-2.5 rounded-[2px] bg-cream/25 sm:h-2 sm:w-3"
          />
        ))}
      </div>

      <div className="gallery-film-track flex w-max gap-3 px-3 py-2 sm:gap-4 sm:px-4">
        {frames.map((image, index) => (
          <figure
            key={`${image.id}-${index}`}
            className="group relative w-[148px] shrink-0 overflow-hidden rounded-sm sm:w-[200px] md:w-[240px]"
          >
            <div className="aspect-[4/5] overflow-hidden bg-green-dark ring-1 ring-cream/10">
              <img
                src={image.image_url}
                alt=""
                className="h-full w-full object-cover opacity-95 transition-transform duration-700 ease-out group-hover:scale-105"
                draggable={false}
              />
            </div>
            {(image.caption || image.category) && (
              <figcaption className="mt-1.5 truncate px-0.5 font-bricolage text-[11px] font-semibold tracking-wide text-cream/80 uppercase sm:text-[12px]">
                {image.category ? `${image.category} · ` : ""}
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}
