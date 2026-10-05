"use client";

import { useEffect } from "react";
import { isIosPublished } from "@/lib/store-links";

type DesktopModeStoreRedirectProps = {
  androidUrl: string;
  iosUrl: string;
};

/**
 * Chrome "Desktop site" mode makes a phone send a Linux/Mac desktop User-Agent,
 * so the server-side check in /get-app returns "other". The browser still
 * reports touch support and the real (small) screen size, so we detect the
 * phone here and send it to the right store.
 */
export default function DesktopModeStoreRedirect({
  androidUrl,
  iosUrl,
}: DesktopModeStoreRedirectProps) {
  useEffect(() => {
    const ua = navigator.userAgent;
    const isTouch = navigator.maxTouchPoints > 1;
    const shortSide = Math.min(screen.width, screen.height);

    // Android phone/tablet in desktop mode: UA says "X11; Linux x86_64".
    const isDesktopUaLinux =
      /Linux/i.test(ua) &&
      !/Android/i.test(ua) &&
      !/Windows|Macintosh/i.test(ua);
    if (isTouch && shortSide <= 820 && isDesktopUaLinux && androidUrl) {
      window.location.replace(androidUrl);
      return;
    }

    // iPhone in desktop mode (and iPadOS default): UA says "Macintosh".
    const isMacUaTouch = /Macintosh/i.test(ua) && isTouch;
    if (isMacUaTouch && isIosPublished(iosUrl)) {
      window.location.replace(iosUrl.trim());
    }
  }, [androidUrl, iosUrl]);

  return null;
}
