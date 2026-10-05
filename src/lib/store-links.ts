/**
 * Helpers for mobile app store links.
 * Store listing URLs come from CMS site-settings (admin Public Website),
 * not from NEXT_PUBLIC_* env vars. The QR always encodes /get-app.
 */

export const GET_APP_PATH = "/get-app";

export const DEFAULT_ANDROID_PACKAGE_ID = "com.miamimarket.app";

/** True when an App Store URL is configured (non-empty after trim). */
export function isIosPublished(iosUrl: string | null | undefined): boolean {
  return Boolean(iosUrl?.trim());
}

export type ScanPlatform = "android" | "ios" | "other";

export function detectScanPlatform(
  userAgent: string,
  platformHint: string | null,
): ScanPlatform {
  if (platformHint && /android/i.test(platformHint)) return "android";
  if (platformHint && /ios/i.test(platformHint)) return "ios";
  if (/android/i.test(userAgent)) return "android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Macintosh/i.test(userAgent) && /Mobile/i.test(userAgent)) return "ios";
  return "other";
}

/** Parse `id=` from a Play Store HTTPS URL; fall back to the default package. */
export function androidPackageIdFromUrl(androidUrl: string): string {
  try {
    const id = new URL(androidUrl).searchParams.get("id");
    if (id) return id;
  } catch {
    // ignore invalid URL
  }
  return DEFAULT_ANDROID_PACKAGE_ID;
}

/** Direct `market://` link for Android Camera / Play Store app. */
export function androidMarketUrl(androidUrl: string): string {
  return `market://details?id=${androidPackageIdFromUrl(androidUrl)}`;
}

/** Fallback market:// when no CMS Android URL is available (compact QR direct mode). */
export const ANDROID_APP_URL = `market://details?id=${DEFAULT_ANDROID_PACKAGE_ID}`;
