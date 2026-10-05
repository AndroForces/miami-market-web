import { describe, expect, it } from "vitest";
import {
  groupHotPlateByWeek,
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

describe("groupHotPlateByWeek isToday", () => {
  it("should_mark_only_reference_date_as_today_when_reference_is_in_month", () => {
    const october = month(2026, 10, [
      { day: 5, items: "Chicken Pot Pie, Salad" },
      { day: 6, items: "Meatloaf, Potatoes" },
    ]);

    const weeks = groupHotPlateByWeek(october, new Date(2026, 9, 5));
    const allDays = weeks.flatMap((week) => week.days);
    const todayDays = allDays.filter((day) => day.isToday);

    expect(todayDays).toHaveLength(1);
    expect(todayDays[0].day).toBe(5);
    expect(allDays.find((day) => day.day === 6)?.isToday).toBe(false);
  });

  it("should_mark_no_days_as_today_when_reference_is_outside_month", () => {
    const october = month(2026, 10, [
      { day: 5, items: "Chicken Pot Pie, Salad" },
    ]);

    const weeks = groupHotPlateByWeek(october, new Date(2026, 8, 5)); // September
    const todayDays = weeks
      .flatMap((week) => week.days)
      .filter((day) => day.isToday);

    expect(todayDays).toHaveLength(0);
  });
});

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
