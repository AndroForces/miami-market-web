"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ANDROID_APP_URL, GET_APP_PATH } from "@/lib/store-links";

type AppQrProps = {
  size?: number;
  /** Absolute URL to encode. Defaults to a phone-reachable `{origin}/get-app`. */
  value?: string;
  /**
   * Encode `market://…` so Android Camera opens Play Store directly
   * (skips the smart /get-app page — Android-only).
   */
  directPlayStore?: boolean;
  /** Hide PNG export; still shows a tiny URL caption so you can verify the target. */
  compact?: boolean;
  className?: string;
};

function isLoopbackHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname === "::1"
  );
}

/** Best-effort LAN IPv4 via WebRTC so a phone on the same Wi‑Fi can hit the QR URL. */
function discoverLanIpv4(): Promise<string | null> {
  return new Promise((resolve) => {
    const RTC =
      window.RTCPeerConnection ||
      (
        window as unknown as {
          webkitRTCPeerConnection?: typeof RTCPeerConnection;
        }
      ).webkitRTCPeerConnection;
    if (!RTC) {
      resolve(null);
      return;
    }

    const pc = new RTC({ iceServers: [] });
    const finish = (ip: string | null) => {
      try {
        pc.close();
      } catch {
        /* ignore */
      }
      resolve(ip);
    };

    const timer = window.setTimeout(() => finish(null), 1500);

    pc.createDataChannel("");
    pc.onicecandidate = (event) => {
      const candidate = event.candidate?.candidate;
      if (!candidate) return;
      const match = /([0-9]{1,3}(?:\.[0-9]{1,3}){3})/.exec(candidate);
      if (!match) return;
      const ip = match[1];
      if (ip.startsWith("127.") || ip.startsWith("169.254.")) {
        return;
      }
      // Prefer private LAN ranges
      if (
        ip.startsWith("10.") ||
        ip.startsWith("192.168.") ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
      ) {
        window.clearTimeout(timer);
        finish(ip);
      }
    };

    void pc.createOffer().then((offer) => pc.setLocalDescription(offer));
  });
}

async function resolveQrValue(
  explicit: string | undefined,
  directPlayStore: boolean,
): Promise<string> {
  if (explicit) return explicit;
  if (directPlayStore) return ANDROID_APP_URL;
  if (typeof window === "undefined") return GET_APP_PATH;

  const { protocol, hostname, port } = window.location;
  if (!isLoopbackHost(hostname)) {
    return `${window.location.origin}${GET_APP_PATH}`;
  }

  const lan = await discoverLanIpv4();
  if (lan) {
    const portPart = port ? `:${port}` : "";
    return `${protocol}//${lan}${portPart}${GET_APP_PATH}`;
  }

  // Last resort — phone cannot open localhost; still encode something visible.
  return `${window.location.origin}${GET_APP_PATH}`;
}

export default function AppQr({
  size = 220,
  value,
  directPlayStore = false,
  compact = false,
  className,
}: AppQrProps) {
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [qrValue, setQrValue] = useState(() => value ?? "");

  useEffect(() => {
    let cancelled = false;
    void resolveQrValue(value, directPlayStore).then((next) => {
      if (!cancelled) setQrValue(next);
    });
    return () => {
      cancelled = true;
    };
  }, [value, directPlayStore]);

  async function downloadPng(): Promise<void> {
    const svg = svgWrapRef.current?.querySelector("svg");
    if (!svg) return;

    setExporting(true);
    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load QR SVG"));
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      const exportSize = size * 2;
      canvas.width = exportSize;
      canvas.height = exportSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, exportSize, exportSize);
      ctx.drawImage(img, 0, 0, exportSize, exportSize);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "miami-market-get-app-qr.png";
      link.click();
    } catch (err) {
      console.error("QR PNG export failed", err);
    } finally {
      setExporting(false);
    }
  }

  const pad = compact ? "p-1" : "p-4";
  const ready = Boolean(qrValue) && qrValue !== GET_APP_PATH;
  const isLocalhostTarget = /localhost|127\.0\.0\.1/.test(qrValue);

  if (!ready) {
    return (
      <div
        className={`rounded-mm bg-white ${pad} ${className ?? ""}`}
        style={{
          width: size + (compact ? 8 : 32),
          height: size + (compact ? 8 : 32),
        }}
        aria-hidden
      />
    );
  }

  const qrBlock = (
    <div
      ref={svgWrapRef}
      className={`rounded-mm bg-white ${pad} ${
        compact
          ? ""
          : "shadow-[0_8px_28px_rgba(20,61,34,0.12)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.45)]"
      }`}
    >
      <QRCodeSVG
        value={qrValue}
        size={size}
        level="M"
        marginSize={2}
        bgColor="#ffffff"
        fgColor="#143d22"
        title="Scan to get the Miami Market app"
      />
    </div>
  );

  if (compact) {
    return (
      <div className={`inline-flex flex-col items-center ${className ?? ""}`}>
        <a
          href={directPlayStore ? ANDROID_APP_URL : GET_APP_PATH}
          aria-label="Scan or tap to get the Miami Market app"
          className="inline-flex shrink-0 no-underline"
          title={qrValue}
        >
          {qrBlock}
        </a>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className ?? ""}`}>
      {qrBlock}
      <p className="max-w-xs break-all text-center text-xs text-text-muted-2 dark:text-text-light/60">
        {qrValue}
      </p>
      {isLocalhostTarget ? (
        <p className="max-w-xs text-center text-xs font-semibold text-accent">
          This QR points at localhost. A phone will open Chrome and fail — open
          this site via your PC Wi‑Fi IP first, then scan.
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => {
          void downloadPng();
        }}
        disabled={exporting}
        className="rounded-full border border-green-dark/20 bg-transparent px-5 py-2.5 text-[14px] font-bold text-green-dark transition-colors duration-150 hover:bg-green-dark/8 disabled:opacity-60 dark:border-cream/25 dark:text-cream dark:hover:bg-cream/10"
      >
        {exporting ? "Exporting…" : "Download PNG"}
      </button>
    </div>
  );
}
