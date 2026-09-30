// import { NextRequest, NextResponse } from "next/server";
// import { ANDROID_URL, IOS_URL } from "@/lib/store-links";

// export const dynamic = "force-dynamic";

// type ScanPlatform = "android" | "ios" | "other";

// function detectPlatform(
//   userAgent: string,
//   platformHint: string | null,
// ): ScanPlatform {
//   if (platformHint && /android/i.test(platformHint)) return "android";
//   if (platformHint && /ios/i.test(platformHint)) return "ios";
//   if (/android/i.test(userAgent)) return "android";
//   if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
//   if (/Macintosh/i.test(userAgent) && /Mobile/i.test(userAgent)) return "ios";
//   return "other";
// }

// function redirect(location: string): NextResponse {
//   return new NextResponse(null, {
//     status: 302,
//     headers: { Location: location, "Cache-Control": "no-store, max-age=0" },
//   });
// }

// export function GET(req: NextRequest): NextResponse {
//   const userAgent = req.headers.get("user-agent") ?? "";
//   const platform = detectPlatform(
//     userAgent,
//     req.headers.get("sec-ch-ua-platform"),
//   );
//   console.log({ timestamp: new Date().toISOString(), platform, userAgent });

//   if (platform === "android") return redirect(ANDROID_URL);
//   if (platform === "ios") return redirect(IOS_URL);
//   return redirect("/download");
// }

import { NextRequest, NextResponse } from "next/server";
import { ANDROID_URL, IOS_URL, IOS_PUBLISHED } from "@/lib/store-links";

export const dynamic = "force-dynamic";

type ScanPlatform = "android" | "ios" | "other";

function detectPlatform(
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

/** Plain 302. A relative Location keeps the public host, never the internal 0.0.0.0. */
function redirect(location: string): NextResponse {
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: location,
      "Cache-Control": "private, no-store, max-age=0",
      Vary: "User-Agent, Sec-CH-UA-Platform",
    },
  });
}
/**
 * Smart store bridge for the QR code (/get-app).
 * - Android → Google Play listing (opens the Play Store app)
 * - iOS     → App Store listing (opens the App Store app); /download until published
 * - Other   → /download
 */
export function GET(req: NextRequest): NextResponse {
  const userAgent = req.headers.get("user-agent") ?? "";
  const platform = detectPlatform(
    userAgent,
    req.headers.get("sec-ch-ua-platform"),
  );

  console.log({ timestamp: new Date().toISOString(), platform, userAgent });

  if (platform === "android") return redirect(ANDROID_URL);
  if (platform === "ios") return redirect(IOS_PUBLISHED ? IOS_URL : "/download");
  return redirect("/download");
}