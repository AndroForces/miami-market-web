/* eslint-disable @next/next/no-img-element */
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import GalleryFilmStrip from "@/components/sections/GalleryFilmStrip";
import GalleryRevealGrid from "@/components/sections/GalleryRevealGrid";
import { getGallery } from "@/lib/cms";

export default async function GalleryPage() {
  const gallery = await getGallery();
  const hasImages = gallery.images.length > 0;

  return (
    <div className="overflow-x-hidden bg-cream font-hanken text-green-dark antialiased">
      <Nav />

      <header className="mx-auto max-w-[1240px] px-4 pt-12 pb-2 sm:px-6 lg:pt-16">
        <div className="animate-reveal-view max-w-2xl">
          {gallery.eyebrow ? (
            <span className="font-bricolage text-[13px] font-extrabold tracking-[0.14em] text-accent uppercase">
              {gallery.eyebrow}
            </span>
          ) : null}
          {gallery.heading ? (
            <h1 className="mt-3.5 font-bricolage text-[clamp(34px,5vw,56px)] leading-[0.95] font-extrabold tracking-tight text-green-dark">
              {gallery.heading}
            </h1>
          ) : null}
          {gallery.intro ? (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-muted">
              {gallery.intro}
            </p>
          ) : null}
          {!hasImages ? (
            <p className="mt-6 text-base font-semibold text-green-dark/70">
              Photos coming soon.
            </p>
          ) : null}
        </div>
      </header>

      {hasImages ? (
        <>
          <GalleryFilmStrip images={gallery.images} />

          <section className="mx-auto max-w-[1240px] px-4 pt-14 pb-20 sm:px-6 sm:pt-16 lg:pb-24">
            <div className="animate-reveal-view mb-8 flex items-end justify-between gap-4 border-b border-green-dark/12 pb-4">
              <h2 className="font-bricolage text-[clamp(22px,3vw,32px)] font-extrabold tracking-tight text-green-dark">
                The collection
              </h2>
              <p className="shrink-0 font-bricolage text-[12px] font-bold tracking-[0.12em] text-text-muted-2 uppercase">
                {gallery.images.length}{" "}
                {gallery.images.length === 1 ? "frame" : "frames"}
              </p>
            </div>
            <GalleryRevealGrid images={gallery.images} />
          </section>
        </>
      ) : null}

      <Footer />
    </div>
  );
}
