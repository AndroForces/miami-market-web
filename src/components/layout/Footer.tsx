/* eslint-disable @next/next/no-img-element */
import { getWebsiteContent } from "@/lib/cms";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.miamimarket.app&pcampaignid=web_share";

export default async function Footer() {
  const { site, social_links: socialLinks } = await getWebsiteContent();

  return (
    <footer className="bg-green-dark px-6 py-14 pb-10 text-text-light">
      <div className="mx-auto flex max-w-[1140px] flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <img
            src="/images/logo.png"
            alt="Miami Market"
            className="h-[58px] w-auto brightness-0 invert opacity-95"
          />
          <p className="mt-4 text-[15px] leading-relaxed">
            {site.address_full}
            <br />
            {site.phone} · Fax {site.fax}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 md:justify-end md:pt-1">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener"
            aria-label="Get Miami Market on Google Play"
            className="flex items-center gap-2 rounded-full border border-cream/25 px-5 py-[11px] text-[15px] font-bold text-cream no-underline transition-colors duration-150 hover:bg-cream/10"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="shrink-0"
            >
              <path d="M4 2.5c-.4.3-.7.8-.7 1.4v16.2c0 .6.3 1.1.7 1.4L13.4 12 4 2.5z" fill="#00C2FF" />
              <path d="M13.4 12 4 2.5c.2-.1.4-.2.6-.2.3 0 .6.1.8.3l11 6.2-3 3.2z" fill="#00E676" />
              <path d="M13.4 12l3-3.2 3.4 1.9c.6.3.9.8.9 1.3s-.3 1-.9 1.3l-3.4 1.9-3-3.2z" fill="#FFC400" />
              <path d="M13.4 12 4 21.5c.2.1.4.2.6.2.3 0 .6-.1.8-.3l11-6.2-3-3.2z" fill="#FF3D57" />
            </svg>
            Get it on Google Play
          </a>
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener"
              className="rounded-full border border-cream/25 px-5 py-[11px] text-[15px] font-bold text-cream no-underline transition-colors duration-150 hover:bg-cream/10"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-9 max-w-[1140px] border-t border-cream/14 pt-6 text-center text-sm opacity-70 md:text-left">
        © Miami Market · Milford, Ohio · Family owned &amp; locally operated
      </div>
    </footer>
  );
}
