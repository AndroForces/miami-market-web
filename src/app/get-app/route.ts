import { NextRequest, NextResponse } from "next/server";
import {
  ANDROID_APP_URL,
  ANDROID_INTENT_URL,
  ANDROID_URL,
  IOS_APP_URL,
  IOS_URL,
} from "@/lib/store-links";

export const dynamic = "force-dynamic";

/**
 * One QR → /get-app → correct store.
 * Platform is detected in the browser (not via server UA), because camera /
 * QR apps often omit "Android" / "iPhone" from the request User-Agent.
 *
 * Android → Play Store app (market://)
 * iOS → App Store (itms-apps://, then https://apps.apple.com)
 * Desktop → /download
 */
export function GET(req: NextRequest): NextResponse {
  const userAgent = req.headers.get("user-agent") ?? "";
  console.log({
    timestamp: new Date().toISOString(),
    platform: "bridge",
    userAgent,
  });

  const downloadUrl = new URL("/download", req.url).toString();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>Get Miami Market</title>
  <style>
    body {
      margin: 0; min-height: 100vh; display: grid; place-items: center;
      font-family: system-ui, -apple-system, sans-serif;
      background: #143d22; color: #faf4e8; text-align: center; padding: 24px;
    }
    .btn {
      display: block; width: 100%; max-width: 360px; box-sizing: border-box;
      border-radius: 999px; padding: 18px 20px; font-size: 1.15rem; font-weight: 800;
      text-decoration: none; background: #3dbe54; color: #0f2e1a; margin: 12px auto 0;
    }
    .btn-secondary {
      background: transparent; color: #faf4e8;
      border: 1px solid rgba(250,244,232,0.35); font-size: 0.95rem; padding: 14px 18px;
    }
    a.muted { color: #cfe0d3; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div style="max-width:360px;width:100%">
    <h1 style="margin:0 0 8px;font-size:1.4rem">Miami Market</h1>
    <p id="msg" style="margin:0;opacity:0.9">Detecting your device&hellip;</p>
    <a class="btn" id="primary" href="${escapeHtml(downloadUrl)}">Get the app</a>
    <a class="btn btn-secondary" id="secondary" href="${escapeHtml(downloadUrl)}" style="display:none">Store listing</a>
    <p style="margin-top:16px"><a class="muted" href="${escapeHtml(downloadUrl)}">All download options</a></p>
  </div>
  <script>
(function () {
  var MARKET = ${JSON.stringify(ANDROID_APP_URL)};
  var INTENT = ${JSON.stringify(ANDROID_INTENT_URL)};
  var ANDROID_WEB = ${JSON.stringify(ANDROID_URL)};
  var IOS_APP = ${JSON.stringify(IOS_APP_URL)};
  var IOS_WEB = ${JSON.stringify(IOS_URL)};
  var DOWNLOAD = ${JSON.stringify(downloadUrl)};

  var ua = navigator.userAgent || "";
  var isAndroid = /android/i.test(ua);
  var isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);

  var primary = document.getElementById("primary");
  var secondary = document.getElementById("secondary");
  var msg = document.getElementById("msg");

  function openStore(url) {
    try {
      var iframe = document.createElement("iframe");
      iframe.style.cssText = "display:none;width:0;height:0;border:0";
      iframe.src = url;
      document.body.appendChild(iframe);
    } catch (e) {}
    window.location.href = url;
  }

  if (isAndroid) {
    msg.textContent = "Opening Play Store\\u2026 Tap below if it does not open.";
    primary.href = MARKET;
    primary.textContent = "Open Play Store";
    secondary.href = ANDROID_WEB;
    secondary.textContent = "Open listing in browser";
    secondary.style.display = "block";
    openStore(MARKET);
    setTimeout(function () { openStore(INTENT); }, 300);
    return;
  }

  if (isIOS) {
    msg.textContent = "Opening App Store\\u2026 Tap below if it does not open.";
    // https://apps.apple.com is the most reliable Camera → Safari → App Store path.
    // itms-apps:// is tried first to jump straight into the App Store app.
    primary.href = IOS_WEB;
    primary.textContent = "Open App Store";
    secondary.href = IOS_APP;
    secondary.textContent = "Open with App Store app";
    secondary.style.display = "block";
    openStore(IOS_APP);
    setTimeout(function () {
      if (!document.hidden) openStore(IOS_WEB);
    }, 500);
    return;
  }

  window.location.replace(DOWNLOAD);
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
