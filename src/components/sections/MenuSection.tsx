import { MenuItemHoverName } from "@/components/sections/MenuItemHoverName";
import { getWebsiteContent } from "@/lib/cms";
import { getWebsiteMenuItems } from "@/lib/menu-api";
import type { WebsiteMenuMeat } from "@/lib/menu-api.types";

function MeatRow({ meat }: { meat: WebsiteMenuMeat }) {
  return (
    <div className="flex items-baseline gap-2 border-b border-green-dark/7 py-2">
      <MenuItemHoverName
        name={meat.name}
        imageUrl={meat.image_url}
        className="font-cormorant text-[17px] font-medium tracking-[0.01em]"
      />
      <span className="flex-1 -translate-y-[5px] border-b-2 border-dotted border-green-dark/26" />
      <span className="font-bricolage text-[15.5px] font-extrabold text-accent">
        ${meat.price.toFixed(2)}
      </span>
    </div>
  );
}

function BuildGroup({
  title,
  items,
  addOns,
}: {
  title: string;
  items: string[];
  addOns?: { name: string; price_display: string }[];
}) {
  return (
    <div>
      <h4 className="mb-3.5 font-hanken text-[12px] font-bold tracking-[0.12em] text-green-dark uppercase">
        {title}
      </h4>
      <div className="flex flex-wrap gap-[7px]">
        {items.map((i) => (
          <span
            key={i}
            className="rounded-full bg-green/10 px-3 py-1.5 font-hanken text-[13.5px] font-medium"
          >
            {i}
          </span>
        ))}
        {addOns?.map((a) => (
          <span
            key={a.name}
            className="rounded-full bg-gold/28 px-3 py-1.5 font-hanken text-[13.5px] font-semibold"
          >
            {a.name} {a.price_display}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function MenuSection() {
  const [{ menu }, items] = await Promise.all([
    getWebsiteContent(),
    getWebsiteMenuItems(),
  ]);
  const menuCopy = menu.copy;

  return (
    <section id="build" className="bg-green-dark py-[90px] text-cream">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="animate-reveal-view mx-auto mb-[50px] max-w-[660px] text-center">
          <span className="font-cormorant text-[12.5px] tracking-[0.18em] text-green-light uppercase">
            {menuCopy.eyebrow}
          </span>
          <h2 className="mt-3.5 font-playfair text-[clamp(34px,5.4vw,62px)] leading-[0.98] font-bold tracking-tight">
            {menuCopy.heading}
          </h2>
          <p className="mt-[18px] font-cormorant text-[17px] leading-normal text-text-light">
            {menuCopy.subheading}
          </p>
        </div>

        <div className="animate-reveal-view relative mx-auto max-w-[980px] rounded-[calc(var(--radius-mm)+4px)] border border-[#e3d6b4] bg-cream-paper p-[clamp(30px,4.5vw,56px)] text-green-dark shadow-[0_44px_84px_-36px_rgba(0,0,0,0.62)]">
          <div className="pointer-events-none absolute inset-[13px] rounded-mm border-[1.5px] border-green-dark/16" />
          <div className="relative">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3.5 text-accent">
                <span className="h-[1.5px] w-[42px] bg-current opacity-50" />
                <span className="font-cormorant text-[11px] tracking-[0.3em] uppercase">
                  {menuCopy.deli_counter_eyebrow}
                </span>
                <span className="h-[1.5px] w-[42px] bg-current opacity-50" />
              </div>
              <h3 className="mt-3.5 font-playfair text-[clamp(26px,3.6vw,40px)] leading-[1.02] font-bold tracking-tight">
                {menuCopy.deli_counter_heading}
              </h3>
              <p className="mt-[9px] font-cormorant text-[16px] text-green-dark italic">
                {menuCopy.deli_counter_subheading}
              </p>
            </div>

            <div className="mt-[34px] grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-11 gap-y-0.5">
              {items.meats.map((m) => (
                <MeatRow key={m.name} meat={m} />
              ))}
            </div>

            <div className="my-10 flex items-center gap-4">
              <span className="h-px flex-1 bg-green-dark/18" />
              <span className="font-cormorant text-[11px] tracking-[0.26em] text-accent uppercase">
                {menuCopy.build_your_way_label}
              </span>
              <span className="h-px flex-1 bg-green-dark/18" />
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[26px]">
              <BuildGroup title={menuCopy.breads_group_title} items={items.breads} />
              <BuildGroup title={menuCopy.cheeses_group_title} items={items.cheeses} />
              <BuildGroup
                title={menuCopy.veggies_group_title}
                items={items.veggies}
                addOns={items.addons}
              />
            </div>
          </div>
        </div>

        <div className="animate-reveal-view mt-[34px] flex flex-wrap items-center justify-between gap-5 rounded-mm bg-accent p-[30px]">
          <div>
            <h3 className="m-0 font-playfair text-[28px] font-bold text-white">
              {menuCopy.soups_heading}
            </h3>
            <p className="mt-2 font-hanken text-base text-white/92">
              {menuCopy.soups_subheading}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 font-hanken text-[14px] font-semibold text-white">
            {items.soup_sizes.map((s) => (
              <span
                key={s}
                className="rounded-full bg-black/18 px-4 py-2.5"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-reveal-view relative mt-[70px]">
          <span className="pointer-events-none absolute -top-[52px] -left-0.5 font-bricolage text-[clamp(70px,13vw,160px)] leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-cream/5">
            {menuCopy.hot_sandwiches_watermark}
          </span>
          <h3 className="relative m-0 font-playfair text-[clamp(26px,3.5vw,40px)] font-bold text-cream">
            {menuCopy.hot_sandwiches_heading}
          </h3>
          <p className="relative mt-2 font-hanken text-[12px] font-bold tracking-[0.1em] text-green-light uppercase">
            {menuCopy.hot_sandwiches_subheading}
          </p>
        </div>
        <div className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-[18px]">
          {items.hot_sandwiches.map((h) => (
            <div
              key={h.num}
              className="animate-reveal-view relative overflow-hidden rounded-mm border-t-4 border-accent bg-cream px-6 pt-[26px] pb-6 text-green-dark transition-[transform,box-shadow] duration-200 hover:-translate-y-[7px] hover:shadow-[0_26px_46px_-22px_rgba(0,0,0,0.6)]"
            >
              <span className="pointer-events-none absolute right-3.5 -bottom-[18px] font-bricolage text-[98px] leading-none font-extrabold text-green-dark/6">
                {h.num}
              </span>
              <span
                className={`absolute top-[18px] right-[18px] rounded-full px-[13px] py-[7px] font-bricolage text-[15px] font-extrabold ${
                  h.accent_price
                    ? "bg-accent text-white"
                    : "bg-green-dark text-cream"
                }`}
              >
                {h.price_display}
              </span>
              <MenuItemHoverName
                name={h.name}
                imageUrl={h.image_url}
                className="relative mt-0.5 max-w-[74%] font-playfair text-[23px] font-bold"
              />
              <p className="relative mt-2.5 font-hanken text-[15px] leading-snug text-text-muted">
                {h.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
