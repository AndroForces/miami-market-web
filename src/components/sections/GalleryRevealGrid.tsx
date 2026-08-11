/* eslint-disable @next/next/no-img-element */
import type { GalleryImage } from "@/lib/cms";

interface GalleryRevealGridProps {
  images: GalleryImage[];
}

/** Masonry collage with scroll-driven shutter reveal. */
export default function GalleryRevealGrid({ images }: GalleryRevealGridProps) {
  if (images.length === 0) return null;

  return (
    <div className="columns-2 gap-3.5 sm:gap-4 lg:columns-3 lg:gap-5">
      {images.map((image, index) => (
        <figure
          key={image.id}
          className="gallery-shutter-tile mb-3.5 break-inside-avoid sm:mb-4 lg:mb-5"
          style={{ animationDelay: `${(index % 6) * 60}ms` }}
        >
          <div className="group relative overflow-hidden rounded-mm bg-cream-dark shadow-[0_10px_28px_-18px_rgba(20,61,34,0.55)]">
            <img
              src={image.image_url}
              alt={image.caption || "Gallery photo"}
              className="block h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            {image.category ? (
              <span className="absolute top-2.5 left-2.5 rounded-full bg-accent px-2.5 py-1 font-bricolage text-[11px] font-bold tracking-[0.06em] text-white uppercase shadow-sm">
                {image.category}
              </span>
            ) : null}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-green-darker/55 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          </div>
          {image.caption ? (
            <figcaption className="mt-2.5 font-hanken text-[15px] leading-snug text-text-muted">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
