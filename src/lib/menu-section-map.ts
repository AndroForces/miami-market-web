import type {
  MenuApiCategory,
  MenuApiItem,
  WebsiteHotSandwich,
  WebsiteMenuAddon,
  WebsiteMenuCategoryGroup,
  WebsiteMenuItems,
  WebsiteMenuMeat,
  WebsiteMenuSectionBindings,
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

function isShownOnWebsite(item: MenuApiItem): boolean {
  return item.show_on_website !== false;
}

/**
 * When `itemIds` is non-empty, only those IDs are included (checkbox selection).
 * When empty/omitted, all website-visible items in the category are included.
 */
function pickSectionItems(
  catItems: MenuApiItem[],
  itemIds: string[] | null | undefined,
): MenuApiItem[] {
  if (itemIds && itemIds.length > 0) {
    const allow = new Set(itemIds);
    return catItems.filter((item) => allow.has(item.id));
  }
  return catItems.filter(isShownOnWebsite);
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

function pushHotSandwich(result: WebsiteMenuItems, item: MenuApiItem): void {
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

/**
 * Builds website menu data from Menu API categories + items.
 * Soups / hot sandwiches prefer CMS category IDs when provided; otherwise
 * fall back to case-insensitive category name match.
 */
export function mapMenuApiToWebsiteItems(
  categories: MenuApiCategory[],
  items: MenuApiItem[],
  bindings: WebsiteMenuSectionBindings = {},
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

  const soupsCategoryId = bindings.soupsCategoryId ?? null;
  const hotSandwichesCategoryId = bindings.hotSandwichesCategoryId ?? null;
  const soupsBoundById = Boolean(soupsCategoryId);
  const hotBoundById = Boolean(hotSandwichesCategoryId);
  const soupsItemIds = bindings.soupsItemIds ?? [];
  const hotItemIds = bindings.hotSandwichesItemIds ?? [];

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
    }

    categoryGroups.push({
      id: category.id,
      title: category.name,
      items: catItems.map(toPricedItem),
    });

    const fillSoupsByName = !soupsBoundById && normalized === "soups";
    const fillSoupsById = soupsBoundById && category.id === soupsCategoryId;
    if (fillSoupsByName || fillSoupsById) {
      result.soup_sizes.push(...pickSectionItems(catItems, soupsItemIds).map((i) => i.name));
    }

    const fillHotByName = !hotBoundById && normalized === "hot sandwiches";
    const fillHotById = hotBoundById && category.id === hotSandwichesCategoryId;
    if (fillHotByName || fillHotById) {
      for (const item of pickSectionItems(catItems, hotItemIds)) {
        pushHotSandwich(result, item);
      }
    }
  }

  for (const [categoryId, catItems] of itemsByCategoryId) {
    if (seenIds.has(categoryId) || catItems.length === 0) continue;
    const title = catItems[0]?.category.name ?? "Menu";
    categoryGroups.push({
      id: categoryId,
      title,
      items: catItems.map(toPricedItem),
    });

    if (soupsBoundById && categoryId === soupsCategoryId) {
      result.soup_sizes.push(...pickSectionItems(catItems, soupsItemIds).map((i) => i.name));
    }
    if (hotBoundById && categoryId === hotSandwichesCategoryId) {
      for (const item of pickSectionItems(catItems, hotItemIds)) {
        pushHotSandwich(result, item);
      }
    }
  }

  result.categories = categoryGroups;
  return result;
}
