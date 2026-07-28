"use client";

import { useMemo } from "react";
import {
  findCurrentMonthKey,
  groupHotPlateByWeek,
  monthKey,
  parseClosedDayMessage,
  parseHotPlateItems,
  parseIndianPlateItems,
  resolveDayPrice,
  sortMonthsChronologically,
  weekdayColumn,
  type HotPlateDayWithMeta,
  type HotPlateMonth,
  type HotPlateWeekGroup,
} from "@/data/hot-plate-calendar";

interface HotPlateLiveBoardClientProps {
  months: HotPlateMonth[];
  defaultPrice: string;
  eyebrow: string;
  headingPrefix: string;
  headingAccent: string;
  description: string;
  ctaLabel: string;
  menuPdfUrl?: string | null;
}

function weekdayBadge(day: HotPlateDayWithMeta): string {
  return `${day.weekdayShort.slice(0, 3).toUpperCase()} ${day.day}`;
}

function HeroSection({
  eyebrow,
  headingPrefix,
  headingAccent,
  description,
}: {
  eyebrow: string;
  headingPrefix: string;
  headingAccent: string;
  description: string;
}) {
  return (
    <div className="mb-8 flex flex-col items-center text-center lg:mb-10">
      <span className="inline-flex items-center gap-[9px] rounded-full bg-green/12 px-4 py-[9px] font-bricolage text-[12.5px] font-extrabold tracking-[0.16em] text-green-dark uppercase">
        {eyebrow}
      </span>
      <h2 className="mt-5 font-bricolage text-[clamp(36px,6vw,64px)] leading-[0.94] font-extrabold tracking-tight">
        <span className="text-transparent [-webkit-text-stroke:1.75px_#143D22]">
          {headingPrefix}
        </span>{" "}
        <span className="text-accent">{headingAccent}</span>
      </h2>
      <p className="mt-4 max-w-[46ch] font-hanken text-[clamp(15px,1.6vw,18px)] leading-[1.55] text-text-muted">
        {description}
      </p>
    </div>
  );
}

function MealCard({
  day,
  month,
  defaultPrice,
}: {
  day: HotPlateDayWithMeta;
  month: HotPlateMonth;
  defaultPrice: string;
}) {
  const parsed = parseHotPlateItems(day.items);
  const price = resolveDayPrice(day, month, defaultPrice);

  return (
    <article className="group flex h-full w-full min-w-0 flex-col rounded-[18px] border border-green-dark/8 bg-white p-2.5 shadow-[0_8px_32px_-16px_rgba(20,61,34,0.12),0_2px_8px_-4px_rgba(20,61,34,0.06)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_-20px_rgba(20,61,34,0.2)]">
      <div className="mb-1.5">
        <span className="font-bricolage text-[10px] font-bold tracking-[0.14em] text-text-muted-2 uppercase">
          {weekdayBadge(day)}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-playfair text-[15px] leading-snug font-bold text-green-dark">
          {parsed.title}
        </h3>
        {parsed.sides.length > 0 && (
          <ul className="mt-0.5 space-y-0">
            {parsed.sides.map((side) => (
              <li
                key={side}
                className="font-hanken text-[11px] leading-snug text-text-muted-2"
              >
                {side}
              </li>
            ))}
          </ul>
        )}
        {price && (
          <p className="mt-0.5 font-hanken text-[11px] font-semibold text-text-muted-2">
            {price}
          </p>
        )}
      </div>

      <div className="mt-1.5 border-t border-green-dark/6 pt-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-green-open/12 px-2.5 py-1 font-bricolage text-[10px] font-bold text-green-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-green-open" aria-hidden />
          Available
        </span>
      </div>
    </article>
  );
}

function IndianSpecialCard({
  day,
  month,
  defaultPrice,
}: {
  day: HotPlateDayWithMeta;
  month: HotPlateMonth;
  defaultPrice: string;
}) {
  const parsed = parseIndianPlateItems(day.items);
  const price = resolveDayPrice(day, month, defaultPrice);

  return (
    <article className="group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-purple-900/20 bg-gradient-to-br from-[#4a1d6a] via-[#5c2780] to-[#3d1658] p-2.5 shadow-[0_12px_40px_-16px_rgba(74,29,106,0.55)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_56px_-20px_rgba(74,29,106,0.65)]">
      <div
        className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gold/15 blur-2xl"
        aria-hidden
      />
      <div className="mb-1.5">
        <span className="font-bricolage text-[10px] font-bold tracking-[0.14em] text-white/70 uppercase">
          {weekdayBadge(day)}
        </span>
      </div>

      <div className="mb-1.5 flex items-center gap-1.5">
        <svg className="h-3.5 w-3.5 text-gold" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
        </svg>
        <span className="font-bricolage text-[10px] font-extrabold tracking-[0.18em] text-gold uppercase">
          Indian Special
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-playfair text-[15px] leading-snug font-bold text-white">
          {parsed.title}
        </h3>
        {parsed.sides.map((side) => (
          <p
            key={side}
            className="mt-0.5 font-hanken text-[11px] leading-snug text-white/65"
          >
            {side}
          </p>
        ))}
        {price && (
          <p className="mt-0.5 font-hanken text-[11px] font-semibold text-gold/90">
            {price}
          </p>
        )}
      </div>

      <div className="mt-1.5 border-t border-white/10 pt-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 font-bricolage text-[10px] font-bold text-white">
          <svg className="h-3 w-3 text-gold" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
          </svg>
          Available
        </span>
      </div>
    </article>
  );
}

function HolidayCard({ day }: { day: HotPlateDayWithMeta }) {
  const parsed = parseClosedDayMessage(day.items);

  return (
    <article className="relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-accent/20 bg-gradient-to-br from-accent via-[#c0392b] to-[#8b1a1a] p-2.5 shadow-[0_16px_48px_-20px_rgba(210,69,42,0.55)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.25) 0 1.5px, transparent 2.5px), radial-gradient(circle at 45% 80%, rgba(255,255,255,0.2) 0 2px, transparent 3px)",
          backgroundSize: "120px 120px, 80px 80px, 100px 100px",
        }}
        aria-hidden
      />
      <div className="relative flex flex-1 flex-col gap-2">
        <div>
          <span className="font-bricolage text-[10px] font-bold tracking-[0.14em] text-white/75 uppercase">
            {weekdayBadge(day)}
          </span>
          <h3 className="mt-0.5 font-playfair text-[18px] font-bold text-white sm:text-[19px]">
            {parsed.headline}
          </h3>
          <p className="mt-0.5 font-bricolage text-[13px] font-extrabold tracking-wide text-white uppercase sm:text-[14px]">
            {parsed.deliStatus}
          </p>
        </div>
        <div className="mt-auto rounded-[14px] border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm">
          <p className="font-hanken text-[12px] font-semibold leading-snug text-white">
            {parsed.hoursLine}
          </p>
        </div>
      </div>
    </article>
  );
}

function DayCard({
  day,
  month,
  defaultPrice,
}: {
  day: HotPlateDayWithMeta;
  month: HotPlateMonth;
  defaultPrice: string;
}) {
  if (day.kind === "closed") {
    return <HolidayCard day={day} />;
  }
  if (day.kind === "indian") {
    return (
      <IndianSpecialCard day={day} month={month} defaultPrice={defaultPrice} />
    );
  }
  return <MealCard day={day} month={month} defaultPrice={defaultPrice} />;
}

function WeekHeaderCard({ week }: { week: HotPlateWeekGroup }) {
  return (
    <div
      className={`flex shrink-0 flex-row items-center gap-2.5 rounded-[18px] border border-green-dark/8 bg-cream-paper px-3 py-2.5 shadow-[0_8px_32px_-16px_rgba(20,61,34,0.1)] lg:w-[132px] lg:flex-col lg:items-start lg:gap-1.5 lg:px-3 lg:py-3 ${
        week.isCurrentWeek ? "ring-2 ring-green/25 ring-offset-1 ring-offset-cream" : ""
      }`}
    >
      <div>
        <span className="font-bricolage text-[10px] font-extrabold tracking-[0.2em] text-text-muted-2 uppercase">
          Week {week.weekNumber}
        </span>
        <p className="mt-0.5 font-playfair text-[14px] leading-tight font-bold text-green-dark">
          {week.dateRange}
        </p>
      </div>
      <span className="rounded-full bg-green-dark px-2 py-0.5 font-bricolage text-[9px] font-extrabold tracking-[0.12em] text-cream uppercase">
        {week.dayCount} {week.dayCount === 1 ? "Day" : "Days"}
      </span>
    </div>
  );
}

function WeekSection({
  week,
  month,
  defaultPrice,
}: {
  week: HotPlateWeekGroup;
  month: HotPlateMonth;
  defaultPrice: string;
}) {
  // Always Mon–Sat columns so every week uses the same card width.
  const columns = Array.from({ length: 6 }, () => [] as HotPlateDayWithMeta[]);
  for (const day of week.days) {
    const col = weekdayColumn(new Date(month.year, month.month - 1, day.day));
    if (col < 0) continue;
    columns[col].push(day);
  }

  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-3">
      <WeekHeaderCard week={week} />
      <div className="grid min-w-0 flex-1 grid-cols-2 items-stretch gap-2 sm:grid-cols-3 md:grid-cols-6 md:gap-2.5">
        {columns.map((entries, colIndex) => (
          <div
            key={`col-${colIndex}`}
            className={`flex min-w-0 flex-col gap-2 ${
              entries.length === 0 ? "hidden md:flex" : ""
            }`}
          >
            {entries.map((day) => (
              <div key={day.entryKey} className="flex min-h-0 min-w-0 flex-1">
                <DayCard
                  day={day}
                  month={month}
                  defaultPrice={defaultPrice}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function FooterLegend({
  ctaLabel,
  menuPdfUrl,
  sundayNote,
}: {
  ctaLabel: string;
  menuPdfUrl?: string | null;
  sundayNote?: string;
}) {
  const legendItems = [
    {
      color: "bg-green-open",
      icon: "check",
      label: "Available",
      detail: "Freshly prepared & ready to serve",
    },
    {
      color: "bg-[#5c2780]",
      icon: "star",
      label: "Indian Special",
      detail: "Chef's special Indian favorites (Saturday)",
    },
    {
      color: "bg-accent",
      icon: "alert",
      label: "Holiday",
      detail: "Deli closed / limited hours",
    },
  ] as const;

  return (
    <div className="mt-10 border-t border-green-dark/8 pt-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-3 sm:gap-x-8">
            {legendItems.map((item) => (
              <div
                key={item.label}
                className="flex max-w-[240px] items-start gap-2.5 text-left"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${item.color}`}
                >
                  {item.icon === "check" && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  )}
                  {item.icon === "star" && (
                    <svg className="h-3 w-3 text-gold" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
                    </svg>
                  )}
                  {item.icon === "alert" && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <div>
                  <p className="font-bricolage text-[13px] font-bold text-green-dark">
                    {item.label}
                  </p>
                  <p className="font-hanken text-[12px] leading-snug text-text-muted-2">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {sundayNote && (
            <p className="mx-auto max-w-[52ch] font-hanken text-[13px] leading-relaxed text-text-muted-2">
              {sundayNote}
            </p>
          )}
        </div>

        {menuPdfUrl && (
          <a
            href={menuPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-[20px] bg-green-dark px-8 py-4 font-bricolage text-[14px] font-bold tracking-wide text-cream no-underline shadow-[0_12px_32px_-12px_rgba(20,61,34,0.55)] transition-[background,transform] duration-200 hover:-translate-y-0.5 hover:bg-green-darker sm:w-auto"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {ctaLabel}
          </a>
        )}
      </div>
    </div>
  );
}

export default function HotPlateLiveBoardClient({
  months,
  defaultPrice,
  eyebrow,
  headingPrefix,
  headingAccent,
  description,
  ctaLabel,
  menuPdfUrl,
}: HotPlateLiveBoardClientProps) {
  const publishedMonths = useMemo(
    () => sortMonthsChronologically(months.filter((m) => m.days.length > 0)),
    [months],
  );

  const selectedMonth = useMemo(() => {
    if (publishedMonths.length === 0) return null;
    const key = findCurrentMonthKey(publishedMonths);
    return (
      publishedMonths.find((m) => monthKey(m) === key) ?? publishedMonths[0]
    );
  }, [publishedMonths]);

  const weeks = useMemo(
    () => (selectedMonth ? groupHotPlateByWeek(selectedMonth) : []),
    [selectedMonth],
  );

  if (publishedMonths.length === 0 || !selectedMonth || weeks.length === 0) {
    return null;
  }

  return (
    <div className="animate-reveal-view mx-auto w-full max-w-[1240px]">
      <HeroSection
        eyebrow={eyebrow}
        headingPrefix={headingPrefix}
        headingAccent={headingAccent}
        description={description}
      />

      <div className="space-y-4 lg:space-y-5">
        {weeks.map((week) => (
          <WeekSection
            key={week.id}
            week={week}
            month={selectedMonth}
            defaultPrice={defaultPrice}
          />
        ))}
      </div>

      <FooterLegend
        ctaLabel={ctaLabel}
        menuPdfUrl={menuPdfUrl}
        sundayNote={selectedMonth.sundayNote}
      />
    </div>
  );
}
