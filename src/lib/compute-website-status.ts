import type { OpenStatusContent, StructuredHourRow } from "@/lib/cms";

export const WEBSITE_TIMEZONE = "America/New_York";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

type WebsiteServiceType = "deli" | "drive_thru" | "hot_plate";

function parseTimeToHours(time: string | null): number | null {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h + m / 60;
}

function getZonedParts(now: Date, timeZone: string): { day: number; hr: number } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return { day: dayMap[weekday] ?? 0, hr: hour + minute / 60 };
}

function isServiceOpen(row: StructuredHourRow | undefined, hr: number): boolean {
  if (!row || row.is_closed) return false;
  const open = parseTimeToHours(row.open_time);
  const close = parseTimeToHours(row.close_time);
  if (open === null || close === null) return false;
  return hr >= open && hr < close;
}

function findRow(
  rows: StructuredHourRow[],
  day: number,
  service: WebsiteServiceType,
): StructuredHourRow | undefined {
  return rows.find((r) => r.day_of_week === day && r.service_type === service);
}

export function computeWebsiteStatus(
  rows: StructuredHourRow[],
  now: Date = new Date(),
  timeZone: string = WEBSITE_TIMEZONE,
): OpenStatusContent {
  const { day, hr } = getZonedParts(now, timeZone);
  const deliOpen = isServiceOpen(findRow(rows, day, "deli"), hr);
  const driveOpen = isServiceOpen(findRow(rows, day, "drive_thru"), hr);

  let isOpenNow: boolean;
  let statusLabel: string;
  let statusSub: string;

  if (deliOpen) {
    isOpenNow = true;
    statusLabel = "Open Now";
    statusSub = "Deli & Drive-Thru — open until 8 PM today";
  } else if (driveOpen) {
    isOpenNow = true;
    statusLabel = "Drive-Thru Open";
    statusSub = `Open until ${day === 0 ? "5 PM" : "8 PM"} today`;
  } else {
    isOpenNow = false;
    statusLabel = "Closed Right Now";
    statusSub = day === 0 ? "Drive-Thru opens Sunday at 11 AM" : "We open at 10 AM";
  }

  const statusDot = isOpenNow ? "#3DBE54" : "#D2452A";

  return {
    is_open_now: isOpenNow,
    status_label: statusLabel,
    status_sub: statusSub,
    day_name: DAY_NAMES[day],
    sign_word: isOpenNow ? "OPEN" : "CLOSED",
    today_idx: day,
    status_dot: statusDot,
  };
}

/**
 * Admin store open/close toggle always wins over posted hours.
 * - Closed → force CLOSED on the public site
 * - Open → force OPEN on the public site
 */
export function applyStoreStatusOverride(
  status: OpenStatusContent,
  storeIsOpen: boolean,
): OpenStatusContent {
  if (!storeIsOpen) {
    return {
      ...status,
      is_open_now: false,
      sign_word: "CLOSED",
      status_label: "Closed Right Now",
      // Never surface the admin close reason on the public site.
      status_sub: "Temporarily closed — check back soon.",
      status_dot: "#D2452A",
    };
  }

  if (status.is_open_now) return status;

  return {
    ...status,
    is_open_now: true,
    sign_word: "OPEN",
    status_label: "Open Now",
    status_sub: "We are open right now — come visit.",
    status_dot: "#3DBE54",
  };
}
