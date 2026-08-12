import { describe, expect, it } from "vitest";
import { mapMenuApiToWebsiteItems } from "./menu-section-map";
import type { MenuApiCategory, MenuApiItem } from "./menu-api.types";

function item(
  partial: Pick<MenuApiItem, "id" | "name" | "price"> & {
    categoryId: string;
    categoryName: string;
    description?: string | null;
    image_url?: string | null;
    image_thumb_url?: string | null;
    show_on_website?: boolean;
  },
): MenuApiItem {
  return {
    id: partial.id,
    name: partial.name,
    price: partial.price,
    description: partial.description ?? null,
    compare_at_price: null,
    is_available: true,
    show_on_website: partial.show_on_website ?? true,
    is_item_of_day: false,
    tags: [],
    image_url: partial.image_url ?? null,
    image_thumb_url: partial.image_thumb_url ?? null,
    popularity_score: 0,
    category: { id: partial.categoryId, name: partial.categoryName },
  };
}

describe("mapMenuApiToWebsiteItems", () => {
  it("should_return_every_category_in_display_order_including_empty", () => {
    const cats: MenuApiCategory[] = [
      { id: "c-hot", name: "Hot Sandwiches", display_order: 1, is_active: true },
      { id: "c-deli", name: "Deli Favorites", display_order: 3, is_active: true },
      { id: "c-drinks", name: "Drinks", display_order: 6, is_active: true },
      { id: "c-soft", name: "Soft", display_order: 12, is_active: true },
    ];
    const result = mapMenuApiToWebsiteItems(cats, [
      item({
        id: "1",
        name: "Reuben",
        price: 7.75,
        categoryId: "c-hot",
        categoryName: "Hot Sandwiches",
      }),
      item({
        id: "2",
        name: "Pastrami",
        price: 7.5,
        categoryId: "c-deli",
        categoryName: "Deli Favorites",
      }),
    ]);

    expect(result.categories.map((c) => c.title)).toEqual([
      "Hot Sandwiches",
      "Deli Favorites",
      "Drinks",
      "Soft",
    ]);
    expect(result.categories.find((c) => c.title === "Drinks")?.items).toEqual([]);
    expect(result.categories.find((c) => c.title === "Soft")?.items).toEqual([]);
    expect(result.categories.find((c) => c.title === "Deli Favorites")?.items).toEqual([
      {
        name: "Pastrami",
        price: 7.5,
        image_url: null,
        description: null,
      },
    ]);
  });

  it("should_fill_hot_sandwiches_and_soups_helpers_from_matching_categories", () => {
    const cats: MenuApiCategory[] = [
      { id: "c-hot", name: "Hot Sandwiches", display_order: 1, is_active: true },
      { id: "c-soups", name: "Soups", display_order: 2, is_active: true },
    ];
    const result = mapMenuApiToWebsiteItems(cats, [
      item({
        id: "1",
        name: "Reuben",
        price: 7.75,
        categoryId: "c-hot",
        categoryName: "Hot Sandwiches",
        description: "On rye",
        image_thumb_url: "https://cdn.example/r.webp",
      }),
      item({
        id: "2",
        name: "Chili (12 oz)",
        price: 4,
        categoryId: "c-soups",
        categoryName: "Soups",
      }),
    ]);

    expect(result.soup_sizes).toEqual(["Chili (12 oz)"]);
    expect(result.hot_sandwiches).toEqual([
      {
        num: "01",
        name: "Reuben",
        price_display: "$7.75",
        accent_price: false,
        description: "On rye",
        image_url: "https://cdn.example/r.webp",
      },
    ]);
  });

  it("should_map_chip_categories_for_build_your_way", () => {
    const cats: MenuApiCategory[] = [
      { id: "c-breads", name: "Breads", display_order: 1, is_active: true },
      { id: "c-addons", name: "Add-ons", display_order: 2, is_active: true },
    ];
    const result = mapMenuApiToWebsiteItems(cats, [
      item({
        id: "1",
        name: "White",
        price: 0,
        categoryId: "c-breads",
        categoryName: "Breads",
      }),
      item({
        id: "2",
        name: "Bacon",
        price: 1.25,
        categoryId: "c-addons",
        categoryName: "Add-ons",
      }),
    ]);

    expect(result.breads).toEqual(["White"]);
    expect(result.addons).toEqual([{ name: "Bacon", price_display: "+$1.25" }]);
  });

  it("should_prefer_bound_category_ids_over_name_fallback_for_soups_and_hot_sandwiches", () => {
    const cats: MenuApiCategory[] = [
      { id: "c-hot", name: "Hot Sandwiches", display_order: 1, is_active: true },
      { id: "c-soups", name: "Soups", display_order: 2, is_active: true },
      { id: "c-special", name: "Lunch Specials", display_order: 3, is_active: true },
    ];
    const result = mapMenuApiToWebsiteItems(
      cats,
      [
        item({
          id: "1",
          name: "Reuben",
          price: 7.75,
          categoryId: "c-hot",
          categoryName: "Hot Sandwiches",
        }),
        item({
          id: "2",
          name: "Chili (12 oz)",
          price: 4,
          categoryId: "c-soups",
          categoryName: "Soups",
        }),
        item({
          id: "3",
          name: "Daily Soup",
          price: 5,
          categoryId: "c-special",
          categoryName: "Lunch Specials",
        }),
        item({
          id: "4",
          name: "Club",
          price: 8,
          categoryId: "c-special",
          categoryName: "Lunch Specials",
          description: "Turkey club",
        }),
      ],
      {
        soupsCategoryId: "c-special",
        hotSandwichesCategoryId: "c-special",
      },
    );

    expect(result.soup_sizes).toEqual(["Daily Soup", "Club"]);
    expect(result.hot_sandwiches.map((h) => h.name)).toEqual(["Daily Soup", "Club"]);
  });

  it("should_exclude_items_with_show_on_website_false_from_soups_and_hot_sandwiches", () => {
    const cats: MenuApiCategory[] = [
      { id: "c-hot", name: "Hot Sandwiches", display_order: 1, is_active: true },
      { id: "c-soups", name: "Soups", display_order: 2, is_active: true },
    ];
    const result = mapMenuApiToWebsiteItems(cats, [
      item({
        id: "1",
        name: "Reuben",
        price: 7.75,
        categoryId: "c-hot",
        categoryName: "Hot Sandwiches",
        show_on_website: false,
      }),
      item({
        id: "2",
        name: "Hot Italian",
        price: 7.75,
        categoryId: "c-hot",
        categoryName: "Hot Sandwiches",
      }),
      item({
        id: "3",
        name: "Hidden Chili",
        price: 4,
        categoryId: "c-soups",
        categoryName: "Soups",
        show_on_website: false,
      }),
      item({
        id: "4",
        name: "Chili (12 oz)",
        price: 4,
        categoryId: "c-soups",
        categoryName: "Soups",
      }),
    ]);

    expect(result.soup_sizes).toEqual(["Chili (12 oz)"]);
    expect(result.hot_sandwiches.map((h) => h.name)).toEqual(["Hot Italian"]);
  });

  it("should_include_only_checked_item_ids_for_hot_sandwiches_when_provided", () => {
    const cats: MenuApiCategory[] = [
      { id: "c-hot", name: "Hot Sandwiches", display_order: 1, is_active: true },
    ];
    const result = mapMenuApiToWebsiteItems(
      cats,
      [
        item({
          id: "1",
          name: "Reuben",
          price: 7.75,
          categoryId: "c-hot",
          categoryName: "Hot Sandwiches",
        }),
        item({
          id: "2",
          name: "Hot Italian",
          price: 7.75,
          categoryId: "c-hot",
          categoryName: "Hot Sandwiches",
        }),
        item({
          id: "3",
          name: "Miami Rascal",
          price: 7.75,
          categoryId: "c-hot",
          categoryName: "Hot Sandwiches",
          show_on_website: false,
        }),
      ],
      {
        hotSandwichesCategoryId: "c-hot",
        hotSandwichesItemIds: ["1", "3"],
      },
    );

    expect(result.hot_sandwiches.map((h) => h.name)).toEqual(["Reuben", "Miami Rascal"]);
  });
});
