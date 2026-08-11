/* eslint-disable @next/next/no-img-element */
import { getWebsiteContent } from "@/lib/cms";

export default async function Hero() {
  const { hero, site } = await getWebsiteContent();

  return (
    <section
      id="top"
      className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-10 px-4 pt-12 pb-6 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] sm:px-6 sm:pt-14"
    >
      <div>
        <span className="inline-flex animate-rise items-center gap-[9px] rounded-full bg-green/12 px-4 py-[9px] text-[12.5px] font-extrabold tracking-[0.16em] text-green-dark uppercase">
          {hero.badge_text}
        </span>
        <h1 className="mt-5 font-bricolage text-[clamp(40px,7vw,86px)] leading-[0.92] font-extrabold tracking-tight">
          <span className="animate-rise-05 block text-[clamp(40px,7vw,86px)] text-transparent [-webkit-text-stroke:2px_#143D22]">
            {hero.heading_line1}
          </span>
          <span className="animate-rise-16 mt-1 block text-[clamp(30px,4.6vw,56px)] text-green-dark">
            {hero.heading_line2}
          </span>
          <span className="animate-rise-27 mt-0.5 block text-[clamp(34px,5.4vw,66px)] text-accent">
            {hero.heading_line3}
          </span>
        </h1>
        <p className="animate-rise-38 mt-6 max-w-[46ch] text-[clamp(16px,1.7vw,19px)] leading-[1.55] text-text-muted">
          {hero.subheadline}
        </p>
        <div className="animate-rise-48 mt-[30px] flex flex-wrap gap-3.5">
          <a
            href="#build"
            className="rounded-mm bg-green px-7 py-[15px] text-base font-bold text-white no-underline transition-[background,transform] duration-150 hover:-translate-y-0.5 hover:bg-green-dark"
          >
            See the Menu
          </a>
          <a
            href={site.directions_url}
            target="_blank"
            rel="noopener"
            className="rounded-mm border-2 border-green-dark/25 bg-transparent px-[26px] py-[13px] text-base font-bold text-green-dark no-underline transition-[border-color,background] duration-150 hover:border-green hover:bg-green/6"
          >
            Get Directions
          </a>
        </div>
      </div>

      <div className="animate-rise-20 relative">
        <div className="absolute inset-[16px_-16px_-16px_16px] rounded-mm bg-accent opacity-16" />
        {hero.image_url && (
          <img
            src={hero.image_url}
            alt="A made-from-scratch fried chicken meal"
            className="relative block h-[clamp(330px,42vw,470px)] w-full rounded-mm object-cover shadow-[0_34px_64px_-26px_rgba(20,61,34,0.55)]"
          />
        )}
        <svg
          viewBox="0 0 200 200"
          className="absolute -bottom-[30px] -left-[34px] z-3 h-[clamp(112px,13vw,148px)] w-[clamp(112px,13vw,148px)] animate-spin-slow drop-shadow-[0_10px_22px_rgba(20,61,34,0.4)]"
        >
          <defs>
            <path
              id="mm-circ"
              d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
            />
          </defs>
          <circle cx="100" cy="100" r="94" fill="#143D22" />
          <circle
            cx="100"
            cy="100"
            r="62"
            fill="none"
            stroke="#FAF4E8"
            strokeWidth="1"
            strokeOpacity="0.35"
          />
          <text
            fill="#FAF4E8"
            className="font-bricolage text-[15.5px] font-bold tracking-[3px]"
          >
            <textPath href="#mm-circ" startOffset="0">
              ★ FAMILY OWNED ★ MILFORD OHIO ★ MADE FROM SCRATCH{" "}
            </textPath>
          </text>
          <text x="100" y="92" textAnchor="middle" fill="#D2452A" fontSize="30">
            ★
          </text>
          <text
            x="100"
            y="124"
            textAnchor="middle"
            fill="#FAF4E8"
            className="font-bricolage text-[22px] font-extrabold tracking-[2px]"
          >
            DELI
          </text>
        </svg>
        <div className="absolute -top-4 -right-2.5 animate-bob rounded-full border-2 border-accent bg-white px-[18px] py-[13px] font-bricolage text-sm font-extrabold text-green-dark shadow-[0_14px_30px_-12px_rgba(20,61,34,0.45)]">
          Beer &amp; Wine
        </div>
        <div className="absolute right-[-14px] bottom-[34px] animate-float rounded-full bg-gold px-[18px] py-[13px] font-bricolage text-sm font-extrabold text-green-dark shadow-[0_14px_30px_-12px_rgba(20,61,34,0.45)]">
          Drive-Thru
        </div>
      </div>
    </section>
  );
}
