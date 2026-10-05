import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ComingSoonScreen from "@/components/ComingSoonScreen";
import GetAppClientFallback from "@/components/GetAppClientFallback";
import { getBackendRootUrl } from "@/lib/media-url";
import { detectScanPlatform, isIosPublished } from "@/lib/store-links";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Get the App · Miami Market",
  description: "Download the Miami Market app for Android or iOS.",
};

/**
 * QR landing. Store URLs come from admin CMS site-settings.
 * - Android → Google Play listing
 * - iOS with App Store URL → App Store
 * - iOS with blank URL → Coming soon page only (app in review)
 * - Other → client fallback, then /download
 */
export default async function GetAppPage() {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") ?? "";
  const platform = detectScanPlatform(
    userAgent,
    headerList.get("sec-ch-ua-platform"),
  );

  let androidUrl = "";
  let iosUrl = "";
  try {
    const base = getBackendRootUrl();
    if (!base) throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
    const res = await fetch(`${base}/api/v1/web/site-settings`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`CMS fetch failed: ${res.status}`);
    const body = (await res.json()) as {
      data?: { android_app_url?: string; ios_app_url?: string };
    };
    androidUrl = body.data?.android_app_url?.trim() ?? "";
    iosUrl = body.data?.ios_app_url?.trim() ?? "";
  } catch (err) {
    console.error("get-app: failed to load site settings", err);
    redirect("/download");
  }

  if (platform === "android") {
    if (androidUrl) redirect(androidUrl);
    redirect("/download");
  }

  if (platform === "ios") {
    if (isIosPublished(iosUrl)) redirect(iosUrl);
    return <ComingSoonScreen />;
  }

  return <GetAppClientFallback androidUrl={androidUrl} iosUrl={iosUrl} />;
}
