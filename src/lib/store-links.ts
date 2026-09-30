// /**
//  * Single source of truth for mobile app store URLs.
//  * Override via env without reprinting the QR code (QR always points at /get-app).
//  *
//  * TODO: replace the iOS default with the real App Store listing URL once published.
//  */

// export const ANDROID_PACKAGE_ID =
//   process.env.NEXT_PUBLIC_ANDROID_PACKAGE_ID ?? "com.miamimarket.app";

// /** HTTPS listing — /download page + last-resort browser fallback only. */
// export const ANDROID_URL =
//   process.env.NEXT_PUBLIC_ANDROID_URL ??
//   `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_ID}`;

// /**
//  * Opens the Play Store *app* (not Chrome).
//  * Plain market:// — do NOT add browser_fallback_url or Chrome will stay on the web listing.
//  */
// export const ANDROID_APP_URL = `market://details?id=${ANDROID_PACKAGE_ID}`;

// /**
//  * Chrome Intent without HTTPS fallback — used as a second attempt after market://.
//  */
// export const ANDROID_INTENT_URL =
//   `intent://details?id=${ANDROID_PACKAGE_ID}` +
//   `#Intent;scheme=market;action=android.intent.action.VIEW;` +
//   `package=com.android.vending;end`;

// /** HTTPS App Store listing — /download buttons + fallback. */
// export const IOS_URL =
//   process.env.NEXT_PUBLIC_IOS_URL ??
//   "https://apps.apple.com/app/miami-market/id0000000000";

// /** Opens the App Store *app* on iOS (not Safari). */
// export const IOS_APP_URL = toItmsAppsUrl(IOS_URL);

// export const GET_APP_PATH = "/get-app";

// /** Convert https://apps.apple.com/.../id123 → itms-apps://apps.apple.com/app/id123 */
// function toItmsAppsUrl(httpsUrl: string): string {
//   const match = httpsUrl.match(/id(\d+)/i);
//   if (match) {
//     return `itms-apps://apps.apple.com/app/id${match[1]}`;
//   }
//   return httpsUrl.replace(/^https?:\/\//i, "itms-apps://");
// }
/**
 * Single source of truth for mobile app store URLs.
 * Override via env without reprinting the QR code (the QR always points at /get-app).
 */

export const ANDROID_PACKAGE_ID =
  process.env.NEXT_PUBLIC_ANDROID_PACKAGE_ID ?? "com.miamimarket.app";

/** HTTPS Play Store listing. Android Chrome hands this link to the Play Store app. */
export const ANDROID_URL =
  process.env.NEXT_PUBLIC_ANDROID_URL ??
  `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_ID}`;

/** Direct `market://` link. Only used when AppQr is rendered with `directPlayStore`. */
export const ANDROID_APP_URL = `market://details?id=${ANDROID_PACKAGE_ID}`;

/** HTTPS App Store listing. iOS Safari hands this link to the App Store app. */
export const IOS_URL =
  process.env.NEXT_PUBLIC_IOS_URL ??
  "https://apps.apple.com/app/miami-market/id0000000000";

/** True only when the iOS URL holds a real App Store id (not the 0000000000 placeholder). */
export const IOS_PUBLISHED = (() => {
  const match = IOS_URL.match(/id(\d+)/i);
  return Boolean(match && Number(match[1]) > 0);
})();

export const GET_APP_PATH = "/get-app";