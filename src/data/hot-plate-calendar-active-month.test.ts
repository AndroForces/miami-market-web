import { describe, expect, it } from "vitest";
import {
  resolveActiveHotPlateMonth,
  type HotPlateMonth,
} from "@/data/hot-plate-calendar";

function month(
  year: number,
  monthNum: number,
  days: HotPlateMonth["days"] = [],
): HotPlateMonth {
  return {
    year,
    month: monthNum,
    title: "Hot Plate Specials",
    days,
  };
}

describe("resolveActiveHotPlateMonth", () => {
  it("should_return_active_month_meals_when_current_month_is_published", () => {
    const august = month(2026, 8, [
      { day: 1, items: "Meatloaf, Potatoes" },
    ]);
    const september = month(2026, 9, [
      { day: 2, items: "Chicken, Rice" },
    ]);

    const result = resolveActiveHotPlateMonth(
      [august, september],
      new Date(2026, 8, 15), // September
    );

    expect(result.month).toBe(9);
    expect(result.days).toEqual([{ day: 2, items: "Chicken, Rice" }]);
  });

  it("should_return_empty_active_month_instead_of_falling_back_to_previous_month", () => {
    const august = month(2026, 8, [
      { day: 1, items: "Meatloaf, Potatoes" },
    ]);
    const september = month(2026, 9, []); // intentionally unpublished

    const result = resolveActiveHotPlateMonth(
      [august, september],
      new Date(2026, 8, 3), // September
    );

    expect(result.year).toBe(2026);
    expect(result.month).toBe(9);
    expect(result.days).toEqual([]);
  });

  it("should_synthesize_active_month_shell_when_cms_has_no_entry", () => {
    const august = month(2026, 8, [
      { day: 1, items: "Meatloaf, Potatoes" },
    ]);

    const result = resolveActiveHotPlateMonth(
      [august],
      new Date(2026, 8, 1), // September, not in CMS list
    );

    expect(result.year).toBe(2026);
    expect(result.month).toBe(9);
    expect(result.days).toEqual([]);
  });
});
