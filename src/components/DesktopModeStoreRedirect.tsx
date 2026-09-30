"use client";

import { useEffect } from "react";
import { ANDROID_URL, IOS_URL, IOS_PUBLISHED } from "@/lib/store-links";

/**
 * Chrome "Desktop site" mode makes a phone send a Linux/Mac desktop User-Agent,
 * so the server-side check in /get-app returns "other". The browser still
 * reports touch support and the real (small) screen size, so we detect the
 * phone here and send it to the right store.
 */
export default function DesktopModeStoreRedirect() {
  useEffect(() => {
    const ua = navigator.userAgent;
    const isTouch = navigator.maxTouchPoints > 1;
    const shortSide = Math.min(screen.width, screen.height);

    // Android phone/tablet in desktop mode: UA says "X11; Linux x86_64".
    const isDesktopUaLinux =
      /Linux/i.test(ua) && !/Android/i.test(ua) && !/Windows|Macintosh/i.test(ua);
    if (isTouch && shortSide <= 820 && isDesktopUaLinux) {
      window.location.replace(ANDROID_URL);
      return;
    }

    // iPhone in desktop mode (and iPadOS default): UA says "Macintosh".
    const isMacUaTouch = /Macintosh/i.test(ua) && isTouch;
    if (isMacUaTouch && IOS_PUBLISHED) {
      window.location.replace(IOS_URL);
    }
  }, []);

  return null;
}