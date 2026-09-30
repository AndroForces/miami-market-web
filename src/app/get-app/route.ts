import { NextRequest, NextResponse } from "next/server";
import {
  ANDROID_APP_URL,
  ANDROID_INTENT_URL,
  ANDROID_URL,
  IOS_APP_URL,
  IOS_URL,
} from "@/lib/store-links";

export const dynamic = "force-dynamic";

type ScanPlatform = "android" | "ios" | "other";

function logScan(platform: ScanPlatform, userAgent: string): void {
  console.log({
    timestamp: new Date().toISOString(),
    platform,
    userAgent,
  });
}

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

/**
 * Smart store bridge for the footer QR (`/get-app`).
 * - Android → Play Store app (`market://`)
 * - iOS → App Store app (`itms-apps://` + https listing Safari hands off)
 * - Other → `/download`
 */
export function GET(req: NextRequest): NextResponse {
  const userAgent = req.headers.get("user-agent") ?? "";
  const platformHint = req.headers.get("sec-ch-ua-platform");
  const platform = detectPlatform(userAgent, platformHint);
  logScan(platform, userAgent);

  const downloadUrl = new URL("/download", req.url).toString();

  if (platform === "other") {
    return NextResponse.redirect(new URL("/download", req.url), 302);
  }

  const isAndroid = platform === "android";

  // Android: market:// opens Play Store app.
  // iOS: itms-apps:// opens App Store; https://apps.apple.com is the Safari fallback
  // (Camera → Safari often prefers https and still launches the App Store app).
  const primaryHref = isAndroid ? ANDROID_APP_URL : IOS_APP_URL;
  const primaryLabel = isAndroid ? "Open Play Store" : "Open App Store";
  const secondaryHref = isAndroid ? ANDROID_URL : IOS_URL;
  const secondaryLabel = isAndroid
    ? "Open in Chrome instead"
    : "Open App Store (Safari link)";

  const autoRefreshUrl = isAndroid ? ANDROID_APP_URL : IOS_APP_URL;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <meta http-equiv="refresh" content="0;url=${escapeHtml(autoRefreshUrl)}" />
  <title>${primaryLabel}</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: system-ui, -apple-system, sans-serif;
      background: #143d22;
      color: #faf4e8;
      text-align: center;
      padding: 24px;
    }
    .card { max-width: 360px; width: 100%; }
    h1 { font-size: 1.5rem; margin: 0 0 10px; }
    p { line-height: 1.5; margin: 0 0 20px; opacity: 0.9; }
    .btn {
      display: block;
      width: 100%;
      box-sizing: border-box;
      border-radius: 999px;
      padding: 18px 20px;
      font-size: 1.15rem;
      font-weight: 800;
      text-decoration: none;
      margin: 0 0 12px;
      background: #3dbe54;
      color: #0f2e1a;
    }
    .btn-secondary {
      background: transparent;
      color: #faf4e8;
      border: 1px solid rgba(250,244,232,0.35);
      font-size: 0.95rem;
      padding: 14px 18px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Miami Market</h1>
    <p>${
      isAndroid
        ? "Tap below to open the <strong>Play Store app</strong>."
        : "Tap below to open the <strong>App Store</strong>."
    }</p>
    <a class="btn" id="storeBtn" href="${escapeHtml(primaryHref)}">${primaryLabel}</a>
    <a class="btn btn-secondary" href="${escapeHtml(secondaryHref)}">${secondaryLabel}</a>
    <p style="font-size:0.85rem;opacity:0.7;margin-top:8px"><a href="${escapeHtml(downloadUrl)}" style="color:#cfe0d3">All download options</a></p>
  </div>
  <script>
(function () {
  var PRIMARY = ${JSON.stringify(primaryHref)};
  var INTENT = ${JSON.stringify(ANDROID_INTENT_URL)};
  var IOS_HTTPS = ${JSON.stringify(IOS_URL)};
  var isAndroid = ${isAndroid ? "true" : "false"};

  function openScheme(url) {
    var iframe = document.createElement("iframe");
    iframe.style.cssText = "display:none;width:0;height:0;border:0";
    iframe.src = url;
    document.body.appendChild(iframe);
    window.location.href = url;
  }

  openScheme(PRIMARY);
  if (isAndroid) {
    setTimeout(function () { openScheme(INTENT); }, 300);
  } else {
    // If itms-apps is blocked, Safari https listing still opens App Store.
    setTimeout(function () {
      if (!document.hidden) openScheme(IOS_HTTPS);
    }, 600);
  }
})();
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
