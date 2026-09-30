import type { Metadata } from "next";
import { headers } from "next/headers";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import AppQr from "@/components/AppQr";
import {
  ANDROID_URL,
  IOS_URL,
  getAppUrlFromRequestHost,
  getConfiguredGetAppUrl,
} from "@/lib/store-links";

export const metadata: Metadata = {
  title: "Get the App · Miami Market",
  description:
    "Download the Miami Market app for Android or iOS — order pickup, earn loyalty points, and skip the line.",
};

export default async function DownloadPage() {
  const configured = getConfiguredGetAppUrl();
  const h = await headers();
  const qrValue =
    configured ??
    getAppUrlFromRequestHost(
      h.get("x-forwarded-host") ?? h.get("host"),
      h.get("x-forwarded-proto"),
    ) ??
    undefined;

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream font-hanken text-green-dark antialiased dark:bg-green-darker dark:text-cream">
      <Nav />

      <main className="mx-auto flex max-w-[720px] flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-20">
        <span className="font-bricolage text-[13px] font-extrabold tracking-[0.14em] text-accent uppercase">
          Mobile app
        </span>
        <h1 className="mt-3.5 font-bricolage text-[clamp(34px,5vw,52px)] leading-[0.95] font-extrabold tracking-tight">
          Miami Market
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-text-muted dark:text-text-light/85">
          Order pickup, earn loyalty points, and skip the line. Scan the QR code
          on your phone, or choose your store below.
        </p>

        <div className="mt-10">
          <AppQr value={qrValue} />
        </div>

        <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={ANDROID_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-green px-5 py-3.5 text-[15px] font-bold text-white no-underline transition-[background,transform] duration-150 hover:-translate-y-px hover:bg-green-dark dark:bg-green-open dark:text-green-darker dark:hover:bg-green-light"
          >
            <PlayStoreIcon />
            Get it on Google Play
          </a>
          <a
            href={IOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-green-dark/20 bg-white px-5 py-3.5 text-[15px] font-bold text-green-dark no-underline transition-colors duration-150 hover:bg-cream-dark dark:border-cream/25 dark:bg-transparent dark:text-cream dark:hover:bg-cream/10"
          >
            <AppStoreIcon />
            Download on the App Store
          </a>
        </div>

        <p className="mt-8 text-sm text-text-muted-2 dark:text-text-light/60">
          Already on a phone? Open{" "}
          <a
            href="/get-app"
            className="font-semibold text-green underline-offset-2 hover:underline dark:text-green-light"
          >
            /get-app
          </a>{" "}
          for an automatic store redirect.
        </p>
      </main>

      <Footer />
    </div>
  );
}

function PlayStoreIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M4 2.5c-.4.3-.7.8-.7 1.4v16.2c0 .6.3 1.1.7 1.4L13.4 12 4 2.5z"
        fill="#00C2FF"
      />
      <path
        d="M13.4 12 4 2.5c.2-.1.4-.2.6-.2.3 0 .6.1.8.3l11 6.2-3 3.2z"
        fill="#00E676"
      />
      <path
        d="M13.4 12l3-3.2 3.4 1.9c.6.3.9.8.9 1.3s-.3 1-.9 1.3l-3.4 1.9-3-3.2z"
        fill="#FFC400"
      />
      <path
        d="M13.4 12 4 21.5c.2.1.4.2.6.2.3 0 .6-.1.8-.3l11-6.2-3-3.2z"
        fill="#FF3D57"
      />
    </svg>
  );
}

function AppStoreIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0 fill-current"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
