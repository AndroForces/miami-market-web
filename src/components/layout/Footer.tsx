/* eslint-disable @next/next/no-img-element */
import { headers } from "next/headers";
import { getWebsiteContent } from "@/lib/cms";
import AppQr from "@/components/AppQr";
import {
  getAppUrlFromRequestHost,
  getConfiguredGetAppUrl,
} from "@/lib/store-links";

/**
 * Absolute /get-app URL for the QR — never 0.0.0.0 or localhost.
 * 1) NEXT_PUBLIC_SITE_URL (build-time)
 * 2) x-forwarded-host / host from the live request (nginx → beta.miami-market.com)
 */
async function resolveFooterQrValue(): Promise<string | undefined> {
  const configured = getConfiguredGetAppUrl();
  if (configured) return configured;

  const h = await headers();
  const fromRequest = getAppUrlFromRequestHost(
    h.get("x-forwarded-host") ?? h.get("host"),
    h.get("x-forwarded-proto"),
  );
  return fromRequest ?? undefined;
}

export default async function Footer() {
  const { site, social_links: socialLinks } = await getWebsiteContent();
  const qrValue = await resolveFooterQrValue();

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
        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end md:pt-0">
          <AppQr compact size={56} value={qrValue} />
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
