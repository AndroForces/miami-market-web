/* eslint-disable @next/next/no-img-element */
import { getWebsiteContent } from "@/lib/cms";

/**
 * Homepage sections use hash anchors (`#hours`). From `/gallery` a bare hash
 * stays on the current page and finds nothing — prefix with `/` so it always
 * lands on the home page section.
 */
function resolveNavHref(href: string): string {
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

export default async function Nav() {
  const { nav_links: navLinks, site } = await getWebsiteContent();

  return (
    <header className="sticky top-0 z-60 border-b border-green-dark/12 bg-cream/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between gap-3 px-4 py-3 sm:gap-[18px] sm:px-6 sm:py-[13px]">
        <a href="/#top" className="flex shrink-0 items-center no-underline">
          <img
            src="/images/logo.png"
            alt="Miami Market"
            className="block h-11 w-auto max-w-[min(180px,38vw)] object-contain object-left sm:h-14 sm:max-w-[min(220px,42vw)]"
          />
        </a>
        <div className="nav-scroll-hide flex max-w-[calc(100%-7.5rem)] flex-1 items-center justify-end gap-1 overflow-x-auto sm:max-w-none sm:flex-wrap sm:overflow-visible">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={resolveNavHref(l.href)}
              className="shrink-0 rounded-full px-3 py-2 text-[14px] font-semibold text-green-dark no-underline transition-colors duration-150 hover:bg-green/12 sm:px-3.5 sm:text-[15px]"
            >
              {l.label}
            </a>
          ))}
          <a
            href={site.phone_href}
            className="ml-0.5 shrink-0 whitespace-nowrap rounded-full bg-green px-3.5 py-2 text-[14px] font-bold text-white no-underline transition-[background,transform] duration-150 hover:-translate-y-px hover:bg-green-dark sm:ml-1.5 sm:px-[18px] sm:py-2.5 sm:text-[15px]"
          >
            {site.phone}
          </a>
        </div>
      </nav>
    </header>
  );
}
