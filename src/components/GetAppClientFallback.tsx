"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ComingSoonScreen from "@/components/ComingSoonScreen";
import { isIosPublished } from "@/lib/store-links";

type GetAppClientFallbackProps = {
  androidUrl: string;
  iosUrl: string;
};

/**
 * Server UA can look like desktop when a phone requests "Desktop site".
 * Touch + screen size still reveal the real device.
 */
export default function GetAppClientFallback({
  androidUrl,
  iosUrl,
}: GetAppClientFallbackProps) {
  const router = useRouter();
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isTouch = navigator.maxTouchPoints > 1;
    const shortSide = Math.min(screen.width, screen.height);

    const isDesktopUaLinux =
      /Linux/i.test(ua) &&
      !/Android/i.test(ua) &&
      !/Windows|Macintosh/i.test(ua);
    if (isTouch && shortSide <= 820 && isDesktopUaLinux && androidUrl) {
      window.location.replace(androidUrl);
      return;
    }

    const isIosDevice =
      /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && isTouch);
    if (isIosDevice) {
      if (isIosPublished(iosUrl)) {
        window.location.replace(iosUrl.trim());
        return;
      }
      setShowComingSoon(true);
      return;
    }

    router.replace("/download");
  }, [androidUrl, iosUrl, router]);

  if (showComingSoon) {
    return <ComingSoonScreen />;
  }

  return null;
}
