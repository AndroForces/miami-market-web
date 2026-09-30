/**
 * Store listing URLs for the smart QR (`/get-app`) and /download page.
 * Change via env without reprinting the QR.
 */

const ANDROID_PACKAGE_ID = "com.miamimarket.app";

/** HTTPS Play Store listing (download page + browser fallback). */
export const ANDROID_URL =
  process.env.NEXT_PUBLIC_ANDROID_URL ??
  `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_ID}`;

/** Opens the Play Store app on Android. */
export const ANDROID_APP_URL = `market://details?id=${ANDROID_PACKAGE_ID}`;

/** Chrome Intent — second attempt if market:// is blocked. */
export const ANDROID_INTENT_URL =
  `intent://details?id=${ANDROID_PACKAGE_ID}` +
  `#Intent;scheme=market;action=android.intent.action.VIEW;` +
  `package=com.android.vending;end`;

/** HTTPS App Store listing (download page + Safari fallback). */
export const IOS_URL =
  process.env.NEXT_PUBLIC_IOS_URL ??
  "https://apps.apple.com/app/miami-market/id0000000000";

/** Opens the App Store app on iOS. */
export const IOS_APP_URL = toItmsAppsUrl(IOS_URL);

export const GET_APP_PATH = "/get-app";

/**
 * Public website origin for the QR (no trailing slash).
 * Required in production — never encode localhost / 0.0.0.0 into the QR.
 */
export function getConfiguredSiteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, "");
}

/** Absolute smart-QR target when SITE_URL is configured. */
export function getConfiguredGetAppUrl(): string | null {
  const site = getConfiguredSiteUrl();
  return site ? `${site}${GET_APP_PATH}` : null;
}

function toItmsAppsUrl(httpsUrl: string): string {
  const match = httpsUrl.match(/id(\d+)/i);
  if (match) {
    return `itms-apps://apps.apple.com/app/id${match[1]}`;
  }
  return httpsUrl.replace(/^https?:\/\//i, "itms-apps://");
}
