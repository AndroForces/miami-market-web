import { getBackendRootUrl, resolveMediaUrl } from "@/lib/media-url";
import {
  mapHotPlateCalendarFromApi,
  type HotPlateCalendarApi,
  type HotPlateMonth,
} from "@/data/hot-plate-calendar";

export interface HeroContent {
  badge_text: string;
  heading_line1: string;
  heading_line2: string;
  heading_line3: string;
  subheadline: string;
  image_url: string | null;
}

export interface AboutContent {
  eyebrow: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  image1_url: string | null;
  image2_url: string | null;
  image3_url: string | null;
}

export interface HotPlateContent {
  eyebrow: string;
  heading_prefix: string;
  heading_accent: string;
  description: string;
  price_label: string;
  badge_label: string;
  circle_top_label: string;
  circle_bottom_label: string;
  cta_label: string;
  image_caption: string;
  image_url: string | null;
  menu_pdf_url: string | null;
}

export interface MenuCopyContent {
  eyebrow: string;
  heading: string;
  subheading: string;
  deli_counter_eyebrow: string;
  deli_counter_heading: string;
  deli_counter_subheading: string;
  build_your_way_label: string;
  breads_group_title: string;
  cheeses_group_title: string;
  veggies_group_title: string;
  soups_heading: string;
  soups_subheading: string;
  hot_sandwiches_watermark: string;
  hot_sandwiches_heading: string;
  hot_sandwiches_subheading: string;
}

export interface HoursCopyContent {
  eyebrow: string;
  heading: string;
  footer_note: string;
  holiday_disclaimer: string;
}

export interface VisitCopyContent {
  eyebrow: string;
  heading: string;
  find_us_label: string;
  feature_chip1: string;
  feature_chip2: string;
  feature_chip3: string;
}

export interface SiteSettingsContent {
  ticker_text: string;
  phone: string;
  phone_href: string;
  fax: string;
  address_line1: string;
  address_line2: string;
  address_full: string;
  directions_url: string;
  map_embed_url: string;
  map_overlay_label: string;
  seo_title: string;
  seo_description: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface SocialLink {
  href: string;
  label: string;
}

export interface MenuMeat {
  name: string;
  price: number;
}

export interface MenuAddon {
  name: string;
  price_display: string;
}

export interface HotSandwichItem {
  num: string;
  name: string;
  price_display: string;
  accent_price: boolean;
  description: string;
}

export interface ScheduleRow {
  day: string;
  idx: number;
  deli: string;
  drive: string;
  hot: string;
}

export interface StructuredHourRow {
  day_of_week: number;
  service_type: string;
  is_closed: boolean;
  open_time: string | null;
  close_time: string | null;
  display_label: string | null;
}

export interface OpenStatusContent {
  is_open_now: boolean;
  status_label: string;
  status_sub: string;
  day_name: string;
  sign_word: string;
  today_idx: number;
  status_dot: string;
}

export interface MenuBlockContent {
  copy: MenuCopyContent;
  meats: MenuMeat[];
  breads: string[];
  cheeses: string[];
  veggies: string[];
  addons: MenuAddon[];
  hot_sandwiches: HotSandwichItem[];
  soup_sizes: string[];
}

export interface HoursBlockContent {
  copy: HoursCopyContent;
  schedule: ScheduleRow[];
  structured: StructuredHourRow[];
  status: OpenStatusContent;
}

export interface WebsiteContent {
  site: SiteSettingsContent;
  nav_links: NavLink[];
  social_links: SocialLink[];
  hero: HeroContent;
  about: AboutContent;
  hot_plate: HotPlateContent;
  menu: MenuBlockContent;
  hours: HoursBlockContent;
  visit: VisitCopyContent;
}

function getBackendUrl(): string {
  const url = getBackendRootUrl();
  if (!url) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
  }
  return url;
}

/** Absolute media URLs — same contract admin uses (`image_url` from API). */
function withResolvedMediaUrls(content: WebsiteContent): WebsiteContent {
  return {
    ...content,
    hero: {
      ...content.hero,
      image_url: resolveMediaUrl(content.hero.image_url),
    },
    about: {
      ...content.about,
      image1_url: resolveMediaUrl(content.about.image1_url),
      image2_url: resolveMediaUrl(content.about.image2_url),
      image3_url: resolveMediaUrl(content.about.image3_url),
    },
    hot_plate: {
      ...content.hot_plate,
      image_url: resolveMediaUrl(content.hot_plate.image_url),
      menu_pdf_url: resolveMediaUrl(content.hot_plate.menu_pdf_url),
    },
  };
}

/** No fallback data — a failed fetch throws and fails the render. */
export async function getWebsiteContent(): Promise<WebsiteContent> {
  const res = await fetch(`${getBackendUrl()}/api/v1/web/website-content`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`CMS fetch failed: ${res.status}`);
  }

  const body = await res.json();
  return withResolvedMediaUrls(body.data as WebsiteContent);
}

/** Monthly Hot Plate day calendar — separate from the aggregate payload. */
export async function getHotPlateCalendar(): Promise<HotPlateMonth[]> {
  const res = await fetch(`${getBackendUrl()}/api/v1/web/hot-plate-calendar`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`CMS fetch failed: ${res.status}`);
  }

  const body = await res.json();
  return mapHotPlateCalendarFromApi(body.data as HotPlateCalendarApi);
}

export async function getSiteSettingsForMetadata(): Promise<SiteSettingsContent> {
  const res = await fetch(`${getBackendUrl()}/api/v1/web/site-settings`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`CMS fetch failed: ${res.status}`);
  }

  const body = await res.json();
  return body.data as SiteSettingsContent;
}
