// "use client";

// import { useRef, useState } from "react";
// import { QRCodeSVG } from "qrcode.react";
// import { ANDROID_APP_URL, GET_APP_PATH } from "@/lib/store-links";

// type AppQrProps = {
//   size?: number;
//   /** Absolute URL to encode. Defaults to `NEXT_PUBLIC_SITE_URL` + `/get-app`. */
//   value?: string;
//   /** Encode `market://…` so Android Camera opens Play Store directly (Android-only). */
//   directPlayStore?: boolean;
//   /** Hide PNG export; still shows a tiny URL caption so you can verify the target. */
//   compact?: boolean;
//   className?: string;
// };

// function getQrValue(
//   explicit: string | undefined,
//   directPlayStore: boolean,
// ): string {
//   if (explicit) return explicit;
//   if (directPlayStore) return ANDROID_APP_URL;

//   const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
//   if (!siteUrl) {
//     console.error("NEXT_PUBLIC_SITE_URL is not set; QR code not rendered.");
//     return "";
//   }
//   return `${siteUrl}${GET_APP_PATH}`;
// }

// export default function AppQr({
//   size = 220,
//   value,
//   directPlayStore = false,
//   compact = false,
//   className,
// }: AppQrProps) {
//   const svgWrapRef = useRef<HTMLDivElement>(null);
//   const [exporting, setExporting] = useState(false);
//   const qrValue = getQrValue(value, directPlayStore);

//   async function downloadPng(): Promise<void> {
//     const svg = svgWrapRef.current?.querySelector("svg");
//     if (!svg) return;

//     setExporting(true);
//     try {
//       const svgString = new XMLSerializer().serializeToString(svg);
//       const blob = new Blob([svgString], {
//         type: "image/svg+xml;charset=utf-8",
//       });
//       const url = URL.createObjectURL(blob);

//       const img = new Image();
//       await new Promise<void>((resolve, reject) => {
//         img.onload = () => resolve();
//         img.onerror = () => reject(new Error("Failed to load QR SVG"));
//         img.src = url;
//       });

//       const canvas = document.createElement("canvas");
//       const exportSize = size * 2;
//       canvas.width = exportSize;
//       canvas.height = exportSize;
//       const ctx = canvas.getContext("2d");
//       if (!ctx) {
//         URL.revokeObjectURL(url);
//         return;
//       }

//       ctx.fillStyle = "#ffffff";
//       ctx.fillRect(0, 0, exportSize, exportSize);
//       ctx.drawImage(img, 0, 0, exportSize, exportSize);
//       URL.revokeObjectURL(url);

//       const link = document.createElement("a");
//       link.href = canvas.toDataURL("image/png");
//       link.download = "miami-market-get-app-qr.png";
//       link.click();
//     } catch (err) {
//       console.error("QR PNG export failed", err);
//     } finally {
//       setExporting(false);
//     }
//   }

//   const pad = compact ? "p-1" : "p-4";

//   if (!qrValue) {
//     return (
//       <div
//         className={`rounded-mm bg-white ${pad} ${className ?? ""}`}
//         style={{
//           width: size + (compact ? 8 : 32),
//           height: size + (compact ? 8 : 32),
//         }}
//         aria-hidden
//       />
//     );
//   }

//   const qrBlock = (
//     <div
//       ref={svgWrapRef}
//       className={`rounded-mm bg-white ${pad} ${
//         compact
//           ? ""
//           : "shadow-[0_8px_28px_rgba(20,61,34,0.12)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.45)]"
//       }`}
//     >
//       <QRCodeSVG
//         value={qrValue}
//         size={size}
//         level="M"
//         marginSize={2}
//         bgColor="#ffffff"
//         fgColor="#143d22"
//         title="Scan to get the Miami Market app"
//       />
//     </div>
//   );

//   if (compact) {
//     return (
//       <div className={`inline-flex flex-col items-center ${className ?? ""}`}>
//         <a
//           href={directPlayStore ? ANDROID_APP_URL : GET_APP_PATH}
//           aria-label="Scan or tap to get the Miami Market app"
//           className="inline-flex shrink-0 no-underline"
//           title={qrValue}
//         >
//           {qrBlock}
//         </a>
//       </div>
//     );
//   }

//   return (
//     <div className={`flex flex-col items-center gap-4 ${className ?? ""}`}>
//       {qrBlock}
//       <p className="max-w-xs break-all text-center text-xs text-text-muted-2 dark:text-text-light/60">
//         {qrValue}
//       </p>
//       <button
//         type="button"
//         onClick={() => {
//           void downloadPng();
//         }}
//         disabled={exporting}
//         className="rounded-full border border-green-dark/20 bg-transparent px-5 py-2.5 text-[14px] font-bold text-green-dark transition-colors duration-150 hover:bg-green-dark/8 disabled:opacity-60 dark:border-cream/25 dark:text-cream dark:hover:bg-cream/10"
//       >
//         {exporting ? "Exporting…" : "Download PNG"}
//       </button>
//     </div>
//   );
// }

"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ANDROID_APP_URL, GET_APP_PATH } from "@/lib/store-links";

type AppQrProps = {
  size?: number;
  /** Absolute URL to encode. Defaults to `NEXT_PUBLIC_SITE_URL` + `/get-app`. */
  value?: string;
  /** Encode `market://…` so Android Camera opens Play Store directly (Android-only). */
  directPlayStore?: boolean;
  /** Hide PNG export; still shows a tiny URL caption so you can verify the target. */
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
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const qrValue = getQrValue(value, directPlayStore);

  async function downloadPng(): Promise<void> {
    const svg = svgWrapRef.current?.querySelector("svg");
    if (!svg) return;

    setExporting(true);
    try {
      const svgString = new XMLSerializer().serializeToString(svg);
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

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "miami-market-get-app-qr.png";
      link.click();
    } catch (err) {
      console.error("QR PNG export failed", err);
    } finally {
      setExporting(false);
    }
  }

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