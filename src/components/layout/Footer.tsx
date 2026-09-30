/* eslint-disable @next/next/no-img-element */
import { getWebsiteContent } from "@/lib/cms";
import AppQr from "@/components/AppQr";

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
        {/*
          QR replaces the old Google Play pill in this cluster — same row as
          social links, sized to the logo (58px) so footer height/width stay put.
        */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end md:pt-0">
          {/* Smart QR → /get-app (Android → Play Store, iOS → App Store). */}
          <AppQr compact size={100} />
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
