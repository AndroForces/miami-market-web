import { getBackendRootUrl, resolveMediaUrl } from "@/lib/media-url";
import type {
  MenuApiCategory,
  MenuApiItem,
  WebsiteMenuItems,
  WebsiteMenuSectionBindings,
} from "@/lib/menu-api.types";
import { mapMenuApiToWebsiteItems } from "@/lib/menu-section-map";

function getBackendUrl(): string {
  const url = getBackendRootUrl();
  if (!url) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
  }
  return url;
}

interface CategoriesBody {
  data: { categories: MenuApiCategory[] };
}

interface ItemsBody {
  data: {
    items: MenuApiItem[];
    total: number;
    page: number;
    total_pages: number;
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${getBackendUrl()}${path}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Menu API fetch failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

/** All menu items for website section mapping (visibility decided in mapper / CMS). */
async function fetchAllWebsiteItems(): Promise<MenuApiItem[]> {
  const limit = 100;
  let page = 1;
  let totalPages = 1;
  const items: MenuApiItem[] = [];

  while (page <= totalPages) {
    const body = await fetchJson<ItemsBody>(
      `/api/v1/menu/items?limit=${limit}&page=${page}`,
    );
    items.push(...body.data.items);
    totalPages = body.data.total_pages;
    page += 1;
  }

  return items.map((item) => ({
    ...item,
    image_url: resolveMediaUrl(item.image_url),
    image_thumb_url: resolveMediaUrl(item.image_thumb_url),
  }));
}

/** Public Menu catalogue shaped for the website Menu section. */
export async function getWebsiteMenuItems(
  bindings: WebsiteMenuSectionBindings = {},
): Promise<WebsiteMenuItems> {
  const categoriesBody = await fetchJson<CategoriesBody>("/api/v1/menu/categories");
  const items = await fetchAllWebsiteItems();
  return mapMenuApiToWebsiteItems(categoriesBody.data.categories, items, bindings);
}
