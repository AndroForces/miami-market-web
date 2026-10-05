"use client";

import { QRCodeSVG } from "qrcode.react";
import { ANDROID_APP_URL, GET_APP_PATH } from "@/lib/store-links";

type AppQrProps = {
  size?: number;
  /** Absolute URL to encode. Defaults to `NEXT_PUBLIC_SITE_URL` + `/get-app`. */
  value?: string;
  /** Encode `market://…` so Android Camera opens Play Store directly (Android-only). */
  directPlayStore?: boolean;
  /** Compact footer QR — no export controls. */
  compact?: boolean;
  className?: string;
};

function getQrValue(
  explicit: string | undefined,
  directPlayStore: boolean,
): string {
  if (explicit) return explicit;
  if (directPlayStore) return ANDROID_APP_URL;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (!siteUrl) {
    console.error("NEXT_PUBLIC_SITE_URL is not set; QR code not rendered.");
    return "";
  }
  return `${siteUrl}${GET_APP_PATH}`;
}

export default function AppQr({
  size = 220,
  value,
  directPlayStore = false,
  compact = false,
  className,
}: AppQrProps) {
  const qrValue = getQrValue(value, directPlayStore);
  const pad = compact ? "p-1" : "p-4";

  if (!qrValue) {
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
    <div className={`flex flex-col items-center ${className ?? ""}`}>
      {qrBlock}
    </div>
  );
}
