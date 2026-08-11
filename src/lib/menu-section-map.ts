import type {
  MenuApiCategory,
  MenuApiItem,
  WebsiteHotSandwich,
  WebsiteMenuAddon,
  WebsiteMenuItems,
  WebsiteMenuMeat,
} from "./menu-api.types";

const CATEGORY_KEYS = {
  meats: "meats",
  breads: "breads",
  cheeses: "cheeses",
  veggies: "veggies",
  "add-ons": "addons",
  soups: "soups",
  "hot sandwiches": "hotSandwiches",
} as const;

type BucketKey = (typeof CATEGORY_KEYS)[keyof typeof CATEGORY_KEYS];

function normalizeCategoryName(name: string): string {
  return name.trim().toLowerCase();
}

function resolveHoverImage(item: MenuApiItem): string | null {
  return item.image_thumb_url || item.image_url || null;
}

function formatMoney(amount: number): string {
  return amount.toFixed(2);
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
  };
}

/**
 * Groups available Menu API items into the website Menu section blocks.
 * Category match is case-insensitive on the public category list names.
 * Item order within each block follows the `items` array order.
 */
export function mapMenuApiToWebsiteItems(
  categories: MenuApiCategory[],
  items: MenuApiItem[],
): WebsiteMenuItems {
  const idToBucket = new Map<string, BucketKey>();

  for (const category of categories) {
    const key = CATEGORY_KEYS[normalizeCategoryName(category.name) as keyof typeof CATEGORY_KEYS];
    if (key) {
      idToBucket.set(category.id, key);
    }
  }

  const result = emptyWebsiteMenuItems();
  const hot: WebsiteHotSandwich[] = [];

  for (const item of items) {
    const bucket = idToBucket.get(item.category.id);
    if (!bucket) continue;

    switch (bucket) {
      case "meats": {
        const meat: WebsiteMenuMeat = {
          name: item.name,
          price: item.price,
          image_url: resolveHoverImage(item),
        };
        result.meats.push(meat);
        break;
      }
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
      default:
        break;
    }
  }

  result.hot_sandwiches = hot;
  return result;
}
