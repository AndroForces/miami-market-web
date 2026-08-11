export interface MenuApiCategory {
  id: string;
  name: string;
  display_order: number;
  is_active: boolean;
}

export interface MenuApiItemCategory {
  id: string;
  name: string;
}

export interface MenuApiItem {
  id: string;
  category: MenuApiItemCategory;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  is_available: boolean;
  is_item_of_day: boolean;
  tags: string[];
  image_url: string | null;
  image_thumb_url: string | null;
  popularity_score: number;
}

export interface WebsiteMenuMeat {
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
}

export interface WebsiteMenuAddon {
  name: string;
  price_display: string;
}

export interface WebsiteHotSandwich {
  num: string;
  name: string;
  price_display: string;
  accent_price: boolean;
  description: string;
  image_url: string | null;
}

/** One Admin Menu category as shown on the website (may have zero items). */
export interface WebsiteMenuCategoryGroup {
  id: string;
  title: string;
  items: WebsiteMenuMeat[];
}

export interface WebsiteMenuItems {
  /** Every category from Menu API, in display_order (includes empty categories). */
  categories: WebsiteMenuCategoryGroup[];
  breads: string[];
  cheeses: string[];
  veggies: string[];
  addons: WebsiteMenuAddon[];
  soup_sizes: string[];
  hot_sandwiches: WebsiteHotSandwich[];
}
