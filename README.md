This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_BACKEND_URL` plus the store listing URLs.

## Smart QR — Get the App

The QR encodes `{current website origin}/get-app` (from `window.location.origin` — no site URL env var). That route serves a tiny bridge page that opens the **native store app** (not Chrome/Safari):

| Device | Opens |
|--------|--------|
| Android | Play Store app via `market://` Intent (`com.miamimarket.app`) |
| iPhone / iPad / iPod | App Store app via `itms-apps://` |
| Desktop / unknown | `/download` fallback page |

HTTPS listing URLs (`NEXT_PUBLIC_ANDROID_URL` / `NEXT_PUBLIC_IOS_URL`) are only used as fallbacks and on `/download` buttons.

The fallback page (`/download`) shows both store buttons and the same QR for print/scan.

**Change store links without reprinting the QR:** update `NEXT_PUBLIC_ANDROID_URL` / `NEXT_PUBLIC_IOS_URL` in `.env` (or defaults in `src/lib/store-links.ts`). The QR never points at the stores directly — only at `/get-app`.

**Phone testing / production QR:** The QR must encode a URL phones can open.

| Environment | What the QR encodes |
|-------------|---------------------|
| Production | `{NEXT_PUBLIC_SITE_URL}/get-app` (set in `infra/.env.<env>`) |
| Local | LAN IP `/get-app` (never `localhost` or `0.0.0.0`) |

`0.0.0.0` is only a server bind address — it is **not** a URL phones can load. If you open the site as `http://0.0.0.0:3001`, Chrome on a phone will show “connection refused”.

| Device | After `/get-app` |
|--------|------------------|
| Android | Play Store app |
| iOS | App Store |
| Desktop | `/download` |

Redeploy after setting `NEXT_PUBLIC_SITE_URL` (it is baked in at **build** time).

**Print the QR:** open `/download` on the public website and use **Download PNG**.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
