import type {
  MenuApiCategory,
  MenuApiItem,
  WebsiteHotSandwich,
  WebsiteMenuAddon,
  WebsiteMenuCategoryGroup,
  WebsiteMenuItems,
  WebsiteMenuMeat,
} from "./menu-api.types";

/** Categories rendered as Build-it-your-way chips instead of priced rows. */
const CHIP_CATEGORIES = new Set([
  "breads",
  "cheeses",
  "veggies",
  "veggies & condiments",
  "add-ons",
  "addons",
]);

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
    description: item.description ?? null,
  };
}

function emptyWebsiteMenuItems(): WebsiteMenuItems {
  return {
    categories: [],
    breads: [],
    cheeses: [],
    veggies: [],
    addons: [],
    soup_sizes: [],
    hot_sandwiches: [],
  };
}

/**
 * Builds website menu data from Menu API categories + available items.
 * Every category is kept (even with zero items) so the website can list all Admin categories.
 */
export function mapMenuApiToWebsiteItems(
  categories: MenuApiCategory[],
  items: MenuApiItem[],
): WebsiteMenuItems {
  const result = emptyWebsiteMenuItems();
  const itemsByCategoryId = new Map<string, MenuApiItem[]>();

  for (const item of items) {
    const list = itemsByCategoryId.get(item.category.id) ?? [];
    list.push(item);
    itemsByCategoryId.set(item.category.id, list);
  }

  const sortedCategories = [...categories].sort(
    (a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name),
  );

  const seenIds = new Set<string>();
  const categoryGroups: WebsiteMenuCategoryGroup[] = [];

  for (const category of sortedCategories) {
    seenIds.add(category.id);
    const catItems = itemsByCategoryId.get(category.id) ?? [];
    const normalized = normalizeCategoryName(category.name);

    if (CHIP_CATEGORIES.has(normalized)) {
      if (normalized === "breads") {
        result.breads.push(...catItems.map((i) => i.name));
      } else if (normalized === "cheeses") {
        result.cheeses.push(...catItems.map((i) => i.name));
      } else if (normalized === "veggies" || normalized === "veggies & condiments") {
        result.veggies.push(...catItems.map((i) => i.name));
      } else if (normalized === "add-ons" || normalized === "addons") {
        for (const item of catItems) {
          const addon: WebsiteMenuAddon = {
            name: item.name,
            price_display: `+$${formatMoney(item.price)}`,
          };
          result.addons.push(addon);
        }
      }
      // Chip categories still appear in the full category list when they have items,
      // or always so Admin category names stay visible.
    }

    categoryGroups.push({
      id: category.id,
      title: category.name,
      items: catItems.map(toPricedItem),
    });

    if (normalized === "soups") {
      result.soup_sizes.push(...catItems.map((i) => i.name));
    }

    if (normalized === "hot sandwiches") {
      for (const item of catItems) {
        const hot: WebsiteHotSandwich = {
          num: String(result.hot_sandwiches.length + 1).padStart(2, "0"),
          name: item.name,
          price_display: `$${formatMoney(item.price)}`,
          accent_price: false,
          description: item.description ?? "",
          image_url: resolveHoverImage(item),
        };
        result.hot_sandwiches.push(hot);
      }
    }
  }

  // Orphan items whose category wasn't in the categories list
  for (const [categoryId, catItems] of itemsByCategoryId) {
    if (seenIds.has(categoryId) || catItems.length === 0) continue;
    const title = catItems[0]?.category.name ?? "Menu";
    categoryGroups.push({
      id: categoryId,
      title,
      items: catItems.map(toPricedItem),
    });
  }

  result.categories = categoryGroups;
  return result;
}
