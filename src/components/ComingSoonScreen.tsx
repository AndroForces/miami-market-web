"use client";

/* eslint-disable @next/next/no-img-element */

export default function ComingSoonScreen() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-cream font-hanken text-green-dark antialiased dark:bg-green-darker dark:text-cream">
      <main className="mx-auto flex min-h-screen max-w-[720px] flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <img
          src="/images/logo.png"
          alt="Miami Market"
          className="h-14 w-auto object-contain sm:h-16"
        />
        <span className="mt-8 font-bricolage text-[13px] font-extrabold tracking-[0.14em] text-accent uppercase">
          iOS app
        </span>
        <h1 className="mt-3.5 font-bricolage text-[clamp(34px,5vw,52px)] leading-[0.95] font-extrabold tracking-tight">
          Coming soon
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-text-muted dark:text-text-light/85">
          The Miami Market iOS app is currently in review. Check back shortly —
          we&apos;ll open the App Store listing as soon as it is live.
        </p>
      </main>
    </div>
  );
}
