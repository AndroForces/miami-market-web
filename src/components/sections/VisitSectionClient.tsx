"use client";

import { useOpenStatus } from "@/hooks/useOpenStatus";
import type {
  OpenStatusContent,
  SiteSettingsContent,
  StructuredHourRow,
  VisitCopyContent,
} from "@/lib/cms";

interface VisitSectionClientProps {
  copy: VisitCopyContent;
  site: SiteSettingsContent;
  structuredHours: StructuredHourRow[];
  initialStatus: OpenStatusContent;
}

export default function VisitSectionClient({
  copy,
  site,
  structuredHours,
  initialStatus,
}: VisitSectionClientProps) {
  const status = useOpenStatus(structuredHours, initialStatus);
  const isOpen = status?.statusOpen ?? initialStatus.is_open_now;
  const statusLabel = status?.statusLabel ?? initialStatus.status_label;
  const statusBg =
    isOpen === true
      ? "bg-green-open"
      : isOpen === false
        ? "bg-accent"
        : "bg-green-light";
  const mapEmbedUrl = site.map_embed_url.trim();

  return (
    <section id="visit" className="mx-auto max-w-[1240px] px-6 py-24">
      <div className="animate-reveal-view mb-10 text-center">
        <span className="font-bricolage text-[13px] font-extrabold tracking-[0.15em] text-accent uppercase">
          {copy.eyebrow}
        </span>
        <h2 className="mt-3 font-bricolage text-[clamp(32px,5vw,54px)] leading-none font-extrabold tracking-tight text-green-dark">
          {copy.heading}
        </h2>
      </div>

      <div className="animate-reveal-view grid grid-cols-1 items-stretch gap-7 lg:grid-cols-2">
        <div className="relative flex flex-col overflow-hidden rounded-[calc(var(--radius-mm)+4px)] bg-green-dark p-[clamp(30px,3.5vw,46px)] text-cream shadow-[0_30px_60px_-30px_rgba(20,61,34,0.6)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(250,244,232,0.06)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute -right-[18px] -bottom-6 h-[clamp(170px,22vw,240px)] w-[clamp(170px,22vw,240px)]"
          >
            <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>

          <div className="relative">
            <div className="inline-flex items-center gap-[9px] rounded-full bg-cream/10 px-[15px] py-2">
              <span className="relative h-[11px] w-[11px] shrink-0">
                <span className={`absolute inset-0 rounded-full ${statusBg}`} />
                <span className={`absolute inset-0 animate-ping rounded-full ${statusBg}`} />
              </span>
              <span className="font-bricolage text-[13px] font-extrabold text-cream">
                {statusLabel}
              </span>
            </div>

            <p className="mt-[26px] font-bricolage text-xs font-extrabold tracking-[0.12em] text-green-light uppercase">
              {copy.find_us_label}
            </p>
            <p className="mt-3 font-bricolage text-[clamp(28px,3.4vw,40px)] leading-[1.05] font-extrabold tracking-tight text-cream">
              {site.address_line1}
              <br />
              {site.address_line2}
            </p>

            <div className="my-[26px] h-px bg-cream/18" />

            <div className="flex flex-wrap gap-x-14 gap-y-5">
              <div>
                <p className="m-0 font-bricolage text-xs font-extrabold tracking-[0.12em] text-green-light uppercase">
                  Phone
                </p>
                <a
                  href={site.phone_href}
                  className="mt-1 block font-bricolage text-[22px] font-extrabold text-cream no-underline"
                >
                  {site.phone}
                </a>
              </div>
              <div>
                <p className="m-0 font-bricolage text-xs font-extrabold tracking-[0.12em] text-green-light uppercase">
                  Fax
                </p>
                <span className="mt-1 block font-bricolage text-[22px] font-extrabold text-cream">
                  {site.fax}
                </span>
              </div>
            </div>

            <div className="mt-[22px] flex flex-wrap gap-2 font-bricolage text-[13.5px] font-bold">
              <span className="rounded-full bg-cream/10 px-[15px] py-2 text-cream">
                {copy.feature_chip1}
              </span>
              <span className="rounded-full bg-cream/10 px-[15px] py-2 text-cream">
                {copy.feature_chip2}
              </span>
              <span className="rounded-full bg-cream/10 px-[15px] py-2 text-cream">
                {copy.feature_chip3}
              </span>
            </div>

            <a
              href={site.directions_url}
              target="_blank"
              rel="noopener"
              className="mt-[30px] inline-flex items-center gap-2.5 rounded-mm bg-accent px-[26px] py-[15px] text-base font-bold text-white no-underline transition-[background,transform] duration-150 hover:-translate-y-0.5 hover:bg-green-dark"
            >
              <span className="underline underline-offset-[3px]">
                Get Directions
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="relative min-h-[440px] overflow-hidden rounded-[calc(var(--radius-mm)+4px)] border-4 border-white shadow-[0_34px_70px_-30px_rgba(20,61,34,0.5)]">
          {mapEmbedUrl ? (
            <iframe
              title="Miami Market location map"
              src={mapEmbedUrl}
              className="absolute inset-0 block h-full w-full border-0"
              loading="lazy"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(135deg,#e8f5ec_0%,#faf4e8_100%)]"
            />
          )}
        </div>
      </div>
    </section>
  );
}
