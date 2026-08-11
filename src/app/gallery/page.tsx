/* eslint-disable @next/next/no-img-element */
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { getGallery } from "@/lib/cms";

export default async function GalleryPage() {
  const gallery = await getGallery();
  const hasImages = gallery.images.length > 0;

  return (
    <div className="overflow-x-hidden bg-cream font-hanken text-green-dark antialiased">
      <Nav />
      <main className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-[minmax(260px,340px)_1fr] lg:gap-14 lg:pt-16 lg:pb-24">
        <aside className="animate-reveal-view lg:sticky lg:top-24 lg:self-start">
          {gallery.eyebrow ? (
            <span className="font-bricolage text-[13px] font-extrabold tracking-[0.14em] text-accent uppercase">
              {gallery.eyebrow}
            </span>
          ) : null}
          {gallery.heading ? (
            <h1 className="mt-3.5 font-bricolage text-[clamp(30px,4vw,48px)] leading-none font-extrabold tracking-tight text-green-dark">
              {gallery.heading}
            </h1>
          ) : null}
          {gallery.intro ? (
            <p className="mt-5 text-lg leading-relaxed text-text-muted">
              {gallery.intro}
            </p>
          ) : null}
          {!hasImages ? (
            <p className="mt-6 text-base font-semibold text-green-dark/70">
              Photos coming soon.
            </p>
          ) : null}
        </aside>

        {hasImages ? (
          <div className="animate-reveal-view columns-2 gap-3.5 lg:columns-3 lg:gap-4">
            {gallery.images.map((image) => (
              <figure
                key={image.id}
                className="mb-3.5 break-inside-avoid lg:mb-4"
              >
                <div className="relative overflow-hidden rounded-mm">
                  <img
                    src={image.image_url}
                    alt={image.caption || "Gallery photo"}
                    className="block h-auto w-full object-cover"
                  />
                  {image.category ? (
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-green-dark/90 px-2.5 py-1 font-bricolage text-[11px] font-bold tracking-[0.06em] text-cream uppercase">
                      {image.category}
                    </span>
                  ) : null}
                </div>
                {image.caption ? (
                  <figcaption className="mt-2 text-[15px] leading-snug text-text-muted">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
