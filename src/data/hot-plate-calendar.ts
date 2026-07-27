export type HotPlateDayKind = "special" | "closed" | "indian" | "note";

export type HotPlateDayEntry = {
  day: number;
  items: string;
  kind?: HotPlateDayKind;
  /** Override month default; omit to use month/CMS default */
  price?: string;
};

export type HotPlateMonth = {
  year: number;
  month: number;
  title: string;
  /** Default hot plate price for this month, e.g. "8.99" */
  defaultPrice?: string;
  leadingBanner?: string;
  sundayNote?: string;
  days: HotPlateDayEntry[];
};

export type HotPlateCalendarApiMonth = {
  year: number;
  month: number;
  title: string;
  default_price?: string;
  leading_banner?: string;
  sunday_note?: string;
  days: Array<{
    day: number;
    items: string;
    kind?: HotPlateDayKind;
    price?: string;
  }>;
};

export type HotPlateCalendarApi = { months: HotPlateCalendarApiMonth[] };

/** Map CMS snake_case calendar blob to website camelCase months. */
export function mapHotPlateCalendarFromApi(
  api: HotPlateCalendarApi,
): HotPlateMonth[] {
  return api.months.map((m) => ({
    year: m.year,
    month: m.month,
    title: m.title,
    defaultPrice: m.default_price,
    leadingBanner: m.leading_banner,
    sundayNote: m.sunday_note,
    days: m.days.map((d) => ({
      day: d.day,
      items: d.items,
      kind: d.kind,
      price: d.price,
    })),
  }));
}

export function monthKey(month: HotPlateMonth): string {
  return `${month.year}-${String(month.month).padStart(2, "0")}`;
}

export function formatHotPlatePrice(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
}

export function resolveDayPrice(
  entry: HotPlateDayEntry,
  month: HotPlateMonth,
  cmsFallback: string,
): string {
  if (entry.kind === "closed") return "";
  const raw = entry.price ?? month.defaultPrice ?? cmsFallback;
  return formatHotPlatePrice(raw);
}

export type WeekdayFilter = "all" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
export type KindFilter = "all" | "indian" | "regular";

export function filterHotPlateDays(
  days: HotPlateDayWithMeta[],
  weekday: WeekdayFilter,
  kind: KindFilter,
): HotPlateDayWithMeta[] {
  return days.filter((entry) => {
    if (weekday !== "all" && entry.weekdayShort !== weekday) return false;
    if (kind === "indian" && entry.kind !== "indian") return false;
    if (kind === "regular" && (entry.kind === "indian" || entry.kind === "closed"))
      return false;
    return true;
  });
}

export function findCurrentMonthKey(
  months: HotPlateMonth[],
  referenceDate: Date = new Date(),
): string {
  if (months.length === 0) return "";
  const match = months.find(
    (m) =>
      m.year === referenceDate.getFullYear() &&
      m.month === referenceDate.getMonth() + 1,
  );
  return match ? monthKey(match) : monthKey(months[0]);
}

/** Column index for Mon–Sat grid (Mon = 0, Sat = 5). Returns -1 for Sunday. */
export function weekdayColumn(date: Date): number {
  const day = date.getDay();
  if (day === 0) return -1;
  return day - 1;
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export type CalendarCell =
  | { type: "empty" }
  | { type: "banner"; text: string; colSpan: number }
  | { type: "day"; day: number; items: string; kind?: HotPlateDayKind };

export type CalendarRow = CalendarCell[];

const WEEKDAY_LABELS = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"] as const;

export function buildHotPlateGrid(month: HotPlateMonth): {
  weekdayLabels: readonly string[];
  rows: CalendarRow[];
} {
  const { year, month: monthNum, days, leadingBanner } = month;
  const lastDay = daysInMonth(year, monthNum);
  const dayMap = new Map(days.map((d) => [d.day, d]));
  const firstCol = weekdayColumn(new Date(year, monthNum - 1, 1));

  const cellMap = new Map<string, CalendarCell>();
  let row = 0;
  let prevCol = -1;

  for (let day = 1; day <= lastDay; day += 1) {
    const wcol = weekdayColumn(new Date(year, monthNum - 1, day));
    if (wcol === -1) continue;

    if (prevCol !== -1 && wcol <= prevCol) {
      row += 1;
    }
    prevCol = wcol;

    const entry = dayMap.get(day);
    cellMap.set(`${row}-${wcol}`, {
      type: "day",
      day,
      items: entry?.items ?? "",
      kind: entry?.kind,
    });
  }

  const rows: CalendarRow[] = [];
  for (let r = 0; r <= row; r += 1) {
    const calendarRow: CalendarCell[] = [];
    for (let c = 0; c < 6; c += 1) {
      if (r === 0 && c === 0 && leadingBanner && firstCol > 0) {
        calendarRow.push({
          type: "banner",
          text: leadingBanner,
          colSpan: firstCol,
        });
        for (let skip = 1; skip < firstCol; skip += 1) {
          calendarRow.push({ type: "empty" });
        }
        c = firstCol - 1;
        continue;
      }

      if (r === 0 && c < firstCol) {
        calendarRow.push({ type: "empty" });
        continue;
      }

      calendarRow.push(cellMap.get(`${r}-${c}`) ?? { type: "empty" });
    }
    rows.push(calendarRow);
  }

  return { weekdayLabels: WEEKDAY_LABELS, rows };
}

export type HotPlateDayWithMeta = HotPlateDayEntry & {
  weekday: string;
  weekdayShort: string;
  dateLabel: string;
  /** Stable key when a day has multiple entries. */
  entryKey: string;
};

export type HotPlateWeekGroup = {
  id: string;
  label: string;
  weekNumber: number;
  dateRange: string;
  dayCount: number;
  isCurrentWeek: boolean;
  days: HotPlateDayWithMeta[];
};

export type ParsedHotPlateItems = {
  title: string;
  sides: string[];
};

export type ParsedClosedDay = {
  headline: string;
  deliStatus: string;
  hoursLine: string;
};

/** Split comma-separated plate copy into main dish + sides. */
export function parseHotPlateItems(items: string): ParsedHotPlateItems {
  const trimmed = items.trim();
  if (!trimmed) return { title: "", sides: [] };

  const parts = trimmed
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return { title: trimmed, sides: [] };
  }

  return { title: parts[0], sides: parts.slice(1) };
}

/** Parse Indian Saturday copy on em dash when present. */
export function parseIndianPlateItems(items: string): ParsedHotPlateItems {
  const trimmed = items.trim();
  const dashParts = trimmed.split("—").map((part) => part.trim()).filter(Boolean);
  if (dashParts.length >= 2) {
    return { title: dashParts[0], sides: [dashParts[1]] };
  }
  return parseHotPlateItems(trimmed);
}

/** Extract headline and hours from closed-day announcement text. */
export function parseClosedDayMessage(items: string): ParsedClosedDay {
  const lines = items
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Structured admin format: headline / deli status / hours (newline-separated)
  if (lines.length >= 2) {
    return {
      headline: lines[0],
      deliStatus: lines[1],
      hoursLine: lines[2] ?? lines[1],
    };
  }

  const trimmed = items.trim();
  const lower = trimmed.toLowerCase();

  let headline = "Holiday Hours";
  if (/4th of july|independence day/i.test(trimmed)) {
    headline = "Independence Day";
  } else if (/christmas/i.test(trimmed)) {
    headline = "Christmas";
  } else if (/thanksgiving/i.test(trimmed)) {
    headline = "Thanksgiving";
  }

  const deliStatus =
    lower.includes("deli") && lower.includes("closed")
      ? "DELI CLOSED"
      : "CLOSED";

  const driveThruMatch = trimmed.match(
    /drive[-\s]?thru[^.]*?(?:open|will be open)\s+([^.]+)/i,
  );
  const genericHoursMatch = trimmed.match(
    /(?:open|will be open)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)[^\.]*)/i,
  );
  const hoursRaw = driveThruMatch?.[1] ?? genericHoursMatch?.[1] ?? "";
  const hoursLine = hoursRaw
    ? `Drive-Thru Open ${hoursRaw.replace(/\s+/g, " ").trim()}`
    : trimmed;

  return { headline, deliStatus, hoursLine };
}

function formatWeekDateRange(
  year: number,
  month: number,
  firstDay: number,
  lastDay: number,
): string {
  const start = new Date(year, month - 1, firstDay);
  const end = new Date(year, month - 1, lastDay);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

export function sortMonthsChronologically(
  months: HotPlateMonth[],
): HotPlateMonth[] {
  return [...months].sort(
    (a, b) => a.year - b.year || a.month - b.month,
  );
}

/** Months that have at least one published day entry (shown on the website). */
export function monthsWithPublishedDays(
  months: HotPlateMonth[],
): HotPlateMonth[] {
  return sortMonthsChronologically(
    months.filter((month) => month.days.length > 0),
  );
}

export function getAdjacentMonthKey(
  months: HotPlateMonth[],
  currentKey: string,
  direction: "prev" | "next",
): string | null {
  const sorted = sortMonthsChronologically(months);
  const index = sorted.findIndex((m) => monthKey(m) === currentKey);
  if (index === -1) return null;
  const nextIndex = direction === "prev" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= sorted.length) return null;
  return monthKey(sorted[nextIndex]);
}

export function shortMonthName(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
  });
}

function weekdayNames(date: Date): { long: string; short: string } {
  return {
    long: date.toLocaleDateString("en-US", { weekday: "long" }),
    short: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonthYear(
  ref: Date,
  year: number,
  month: number,
): boolean {
  return ref.getFullYear() === year && ref.getMonth() + 1 === month;
}

export function findTodayEntry(
  month: HotPlateMonth,
  referenceDate: Date = new Date(),
): HotPlateDayWithMeta | null {
  if (!isSameMonthYear(referenceDate, month.year, month.month)) {
    return null;
  }

  const day = referenceDate.getDate();
  const entryIndex = month.days.findIndex((d) => d.day === day);
  if (entryIndex === -1) return null;
  const entry = month.days[entryIndex];

  const date = new Date(month.year, month.month - 1, day);
  const names = weekdayNames(date);
  return {
    ...entry,
    weekday: names.long,
    weekdayShort: names.short,
    dateLabel: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    entryKey: `${month.year}-${month.month}-${day}-${entryIndex}`,
  };
}

export function groupHotPlateByWeek(
  month: HotPlateMonth,
  referenceDate: Date = new Date(),
): HotPlateWeekGroup[] {
  const { year, month: monthNum, days } = month;
  const lastDay = daysInMonth(year, monthNum);
  const showToday = isSameMonthYear(referenceDate, year, monthNum);
  const todayDay = referenceDate.getDate();

  // Preserve all entries for a day (multiple meals / holiday on same date).
  const byDay = new Map<number, Array<{ entry: HotPlateDayEntry; index: number }>>();
  days.forEach((entry, index) => {
    const list = byDay.get(entry.day) ?? [];
    list.push({ entry, index });
    byDay.set(entry.day, list);
  });

  const weeks: HotPlateWeekGroup[] = [];
  let currentWeek: HotPlateDayWithMeta[] = [];

  const flushWeek = () => {
    if (currentWeek.length === 0) return;

    const first = currentWeek[0];
    const last = currentWeek[currentWeek.length - 1];
    const containsToday =
      showToday && currentWeek.some((d) => d.day === todayDay);

    weeks.push({
      id: `week-${first.day}`,
      label: `Week of ${first.dateLabel}`,
      weekNumber: weeks.length + 1,
      dateRange: formatWeekDateRange(year, monthNum, first.day, last.day),
      dayCount: currentWeek.length,
      isCurrentWeek: containsToday,
      days: currentWeek,
    });
    currentWeek = [];
  };

  for (let day = 1; day <= lastDay; day += 1) {
    const date = new Date(year, monthNum - 1, day);
    const wcol = weekdayColumn(date);
    if (wcol === -1) continue;

    if (currentWeek.length > 0 && wcol === 0) {
      flushWeek();
    }

    const entries = byDay.get(day);
    if (!entries || entries.length === 0) continue;

    const names = weekdayNames(date);
    const dateLabel = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    for (const { entry, index } of entries) {
      currentWeek.push({
        day,
        items: entry.items,
        kind: entry.kind,
        price: entry.price,
        weekday: names.long,
        weekdayShort: names.short,
        dateLabel,
        entryKey: `${year}-${monthNum}-${day}-${index}`,
      });
    }
  }

  flushWeek();
  return weeks;
}
