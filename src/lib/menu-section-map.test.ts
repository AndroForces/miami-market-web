import { describe, expect, it } from "vitest";
import { mapMenuApiToWebsiteItems } from "./menu-section-map";
import type { MenuApiCategory, MenuApiItem } from "./menu-api.types";

const cats: MenuApiCategory[] = [
  { id: "c-meats", name: "Meats", display_order: 1, is_active: true },
  { id: "c-breads", name: "Breads", display_order: 2, is_active: true },
  { id: "c-cheeses", name: "Cheeses", display_order: 3, is_active: true },
  { id: "c-veggies", name: "Veggies", display_order: 4, is_active: true },
  { id: "c-addons", name: "Add-ons", display_order: 5, is_active: true },
  { id: "c-soups", name: "Soups", display_order: 6, is_active: true },
  { id: "c-hot", name: "hot sandwiches", display_order: 7, is_active: true },
];

function item(
  partial: Pick<MenuApiItem, "id" | "name" | "price"> & {
    categoryId: string;
    categoryName: string;
    description?: string | null;
    image_url?: string | null;
    image_thumb_url?: string | null;
  },
): MenuApiItem {
  return {
    id: partial.id,
    name: partial.name,
    price: partial.price,
    description: partial.description ?? null,
    compare_at_price: null,
    is_available: true,
    is_item_of_day: false,
    tags: [],
    image_url: partial.image_url ?? null,
    image_thumb_url: partial.image_thumb_url ?? null,
    popularity_score: 0,
    category: { id: partial.categoryId, name: partial.categoryName },
  };
}

describe("mapMenuApiToWebsiteItems", () => {
  it("should_group_items_by_case_insensitive_category_name", () => {
    const items = [
      item({
        id: "1",
        name: "Roast Beef",
        price: 7.5,
        categoryId: "c-meats",
        categoryName: "Meats",
        image_thumb_url: "https://cdn.example/rb-thumb.webp",
      }),
      item({
        id: "2",
        name: "White",
        price: 0,
        categoryId: "c-breads",
        categoryName: "Breads",
      }),
      item({
        id: "3",
        name: "Swiss",
        price: 0,
        categoryId: "c-cheeses",
        categoryName: "Cheeses",
      }),
      item({
        id: "4",
        name: "Lettuce",
        price: 0,
        categoryId: "c-veggies",
        categoryName: "Veggies",
      }),
      item({
        id: "5",
        name: "Bacon",
        price: 1.25,
        categoryId: "c-addons",
        categoryName: "Add-ons",
      }),
      item({
        id: "6",
        name: "12 oz",
        price: 4,
        categoryId: "c-soups",
        categoryName: "Soups",
      }),
      item({
        id: "7",
        name: "Reuben",
        price: 7.75,
        categoryId: "c-hot",
        categoryName: "Hot Sandwiches",
        description: "Corned beef on rye",
        image_url: "https://cdn.example/reuben.webp",
      }),
    ];

    const result = mapMenuApiToWebsiteItems(cats, items);

    expect(result.meats).toEqual([
      {
        name: "Roast Beef",
        price: 7.5,
        image_url: "https://cdn.example/rb-thumb.webp",
      },
    ]);
    expect(result.breads).toEqual(["White"]);
    expect(result.cheeses).toEqual(["Swiss"]);
    expect(result.veggies).toEqual(["Lettuce"]);
    expect(result.addons).toEqual([{ name: "Bacon", price_display: "+$1.25" }]);
    expect(result.soup_sizes).toEqual(["12 oz"]);
    expect(result.hot_sandwiches).toEqual([
      {
        num: "01",
        name: "Reuben",
        price_display: "$7.75",
        accent_price: false,
        description: "Corned beef on rye",
        image_url: "https://cdn.example/reuben.webp",
      },
    ]);
  });

  it("should_return_empty_blocks_when_categories_missing", () => {
    const result = mapMenuApiToWebsiteItems([], [
      item({
        id: "1",
        name: "Roast Beef",
        price: 7.5,
        categoryId: "c-meats",
        categoryName: "Meats",
      }),
    ]);
    expect(result.meats).toEqual([]);
    expect(result.hot_sandwiches).toEqual([]);
  });

  it("should_prefer_thumb_url_then_image_url_for_hover_source", () => {
    const result = mapMenuApiToWebsiteItems(cats, [
      item({
        id: "1",
        name: "A",
        price: 1,
        categoryId: "c-meats",
        categoryName: "Meats",
        image_url: "https://cdn.example/full.webp",
        image_thumb_url: null,
      }),
    ]);
    expect(result.meats[0].image_url).toBe("https://cdn.example/full.webp");
  });

  it("should_number_hot_sandwiches_from_input_order", () => {
    const result = mapMenuApiToWebsiteItems(cats, [
      item({
        id: "1",
        name: "First",
        price: 7,
        categoryId: "c-hot",
        categoryName: "Hot Sandwiches",
      }),
      item({
        id: "2",
        name: "Second",
        price: 8,
        categoryId: "c-hot",
        categoryName: "Hot Sandwiches",
      }),
    ]);
    expect(result.hot_sandwiches.map((h) => h.num)).toEqual(["01", "02"]);
  });
});
