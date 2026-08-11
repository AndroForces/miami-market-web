import type {
  MenuApiCategory,
  MenuApiItem,
  WebsiteHotSandwich,
  WebsiteMenuAddon,
  WebsiteMenuCategoryGroup,
  WebsiteMenuItems,
  WebsiteMenuMeat,
} from "./menu-api.types";

/**
 * Reserved website blocks. Keys are normalized category names (and aliases).
 * Any other category with available items becomes an `other_groups` entry
 * (shown as its own titled list — not under Build it your way).
 */
const CATEGORY_BUCKETS: Record<string, BucketKey> = {
  meats: "meats",
  "deli favorites": "meats",
  breads: "breads",
  cheeses: "cheeses",
  veggies: "veggies",
  "veggies & condiments": "veggies",
  "add-ons": "addons",
  addons: "addons",
  soups: "soups",
  "hot sandwiches": "hotSandwiches",
};

type BucketKey =
  | "meats"
  | "breads"
  | "cheeses"
  | "veggies"
  | "addons"
  | "soups"
  | "hotSandwiches"
  | "other";

function normalizeCategoryName(name: string): string {
  return name.trim().toLowerCase();
}

function resolveHoverImage(item: MenuApiItem): string | null {
  return item.image_thumb_url || item.image_url || null;
}

function formatMoney(amount: number): string {
  return amount.toFixed(2);
}

function toPricedItem(item: MenuApiItem): WebsiteMenuMeat {
  return {
    name: item.name,
    price: item.price,
    image_url: resolveHoverImage(item),
  };
}

function resolveBucket(categoryName: string): BucketKey {
  return CATEGORY_BUCKETS[normalizeCategoryName(categoryName)] ?? "other";
}

function emptyWebsiteMenuItems(): WebsiteMenuItems {
  return {
    meats: [],
    breads: [],
    cheeses: [],
    veggies: [],
    addons: [],
    soup_sizes: [],
    hot_sandwiches: [],
    other_groups: [],
  };
}

/**
 * Groups every available Menu API item into website Menu section blocks.
 * Uses category name aliases; items whose category is inactive / missing from
 * the categories list still appear (via `item.category`).
 */
export function mapMenuApiToWebsiteItems(
  categories: MenuApiCategory[],
  items: MenuApiItem[],
): WebsiteMenuItems {
  const idToBucket = new Map<string, BucketKey>();
  const idToTitle = new Map<string, string>();
  const otherOrder: string[] = [];

  const sortedCategories = [...categories].sort(
    (a, b) => a.display_order - b.display_order,
  );

  for (const category of sortedCategories) {
    const bucket = resolveBucket(category.name);
    idToBucket.set(category.id, bucket);
    idToTitle.set(category.id, category.name);
    if (bucket === "other" && !otherOrder.includes(category.id)) {
      otherOrder.push(category.id);
    }
  }

  const result = emptyWebsiteMenuItems();
  const hot: WebsiteHotSandwich[] = [];
  const otherItems = new Map<string, WebsiteMenuMeat[]>();

  for (const item of items) {
    let bucket = idToBucket.get(item.category.id);
    if (!bucket) {
      bucket = resolveBucket(item.category.name);
      idToBucket.set(item.category.id, bucket);
      idToTitle.set(item.category.id, item.category.name);
      if (bucket === "other" && !otherOrder.includes(item.category.id)) {
        otherOrder.push(item.category.id);
      }
    }

    switch (bucket) {
      case "meats":
        result.meats.push(toPricedItem(item));
        break;
      case "breads":
        result.breads.push(item.name);
        break;
      case "cheeses":
        result.cheeses.push(item.name);
        break;
      case "veggies":
        result.veggies.push(item.name);
        break;
      case "addons": {
        const addon: WebsiteMenuAddon = {
          name: item.name,
          price_display: `+$${formatMoney(item.price)}`,
        };
        result.addons.push(addon);
        break;
      }
      case "soups":
        result.soup_sizes.push(item.name);
        break;
      case "hotSandwiches": {
        hot.push({
          num: String(hot.length + 1).padStart(2, "0"),
          name: item.name,
          price_display: `$${formatMoney(item.price)}`,
          accent_price: false,
          description: item.description ?? "",
          image_url: resolveHoverImage(item),
        });
        break;
      }
      case "other": {
        const list = otherItems.get(item.category.id) ?? [];
        list.push(toPricedItem(item));
        otherItems.set(item.category.id, list);
        break;
      }
      default:
        break;
    }
  }

  const other_groups: WebsiteMenuCategoryGroup[] = [];
  for (const categoryId of otherOrder) {
    const groupItems = otherItems.get(categoryId);
    if (!groupItems || groupItems.length === 0) continue;
    other_groups.push({
      title: idToTitle.get(categoryId) ?? "Menu",
      items: groupItems,
    });
  }

  result.hot_sandwiches = hot;
  result.other_groups = other_groups;
  return result;
}
