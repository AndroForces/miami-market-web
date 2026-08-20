import { describe, expect, it } from "vitest";
import {
  applyStoreStatusOverride,
  computeWebsiteStatus,
} from "./compute-website-status";
import type { StructuredHourRow } from "./cms";

const weekdayRows: StructuredHourRow[] = [
  {
    day_of_week: 1,
    service_type: "deli",
    is_closed: false,
    open_time: "10:00",
    close_time: "20:00",
    display_label: null,
  },
  {
    day_of_week: 1,
    service_type: "drive_thru",
    is_closed: false,
    open_time: "10:00",
    close_time: "20:00",
    display_label: null,
  },
  {
    day_of_week: 1,
    service_type: "hot_plate",
    is_closed: false,
    open_time: "11:00",
    close_time: "20:00",
    display_label: null,
  },
];

describe("applyStoreStatusOverride", () => {
  it("should_force_open_when_admin_store_is_open_outside_hours", () => {
    const closedByHours = computeWebsiteStatus(
      weekdayRows,
      new Date("2026-07-06T08:00:00-04:00"),
    );
    expect(closedByHours.is_open_now).toBe(false);

    const status = applyStoreStatusOverride(closedByHours, true);
    expect(status.is_open_now).toBe(true);
    expect(status.sign_word).toBe("OPEN");
    expect(status.status_label).toBe("Open Now");
  });

  it("should_force_closed_when_admin_store_is_closed", () => {
    const openByHours = computeWebsiteStatus(
      weekdayRows,
      new Date("2026-07-06T15:00:00-04:00"),
    );
    const status = applyStoreStatusOverride(openByHours, false);
    expect(status.is_open_now).toBe(false);
    expect(status.sign_word).toBe("CLOSED");
  });
});
