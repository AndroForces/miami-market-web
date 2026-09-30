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

/** Hosts phones cannot reach — never put these in a QR. */
export function isUnusableQrHost(hostname: string): boolean {
  const host = hostname.replace(/:\d+$/, "").toLowerCase();
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "[::]" ||
    host === "[::1]" ||
    host === "::" ||
    host === "::1"
  );
}

/**
 * Public website origin for the QR (no trailing slash).
 * Set NEXT_PUBLIC_SITE_URL in infra/.env.* — baked in at build time.
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

/**
 * Build an absolute /get-app URL from a request Host header (nginx sets
 * x-forwarded-host). Rejects 0.0.0.0 / localhost so those never enter the QR.
 */
export function getAppUrlFromRequestHost(
  hostHeader: string | null,
  protoHeader: string | null,
): string | null {
  if (!hostHeader) return null;
  const host = hostHeader.split(",")[0]?.trim() ?? "";
  if (!host || isUnusableQrHost(host)) return null;
  const proto =
    (protoHeader?.split(",")[0]?.trim() || "https").replace(/:$/, "") ||
    "https";
  return `${proto}://${host}${GET_APP_PATH}`;
}

function toItmsAppsUrl(httpsUrl: string): string {
  const match = httpsUrl.match(/id(\d+)/i);
  if (match) {
    return `itms-apps://apps.apple.com/app/id${match[1]}`;
  }
  return httpsUrl.replace(/^https?:\/\//i, "itms-apps://");
}
