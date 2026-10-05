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

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_BACKEND_URL` plus `NEXT_PUBLIC_SITE_URL`.

## Smart QR — Get the App

The QR encodes `{NEXT_PUBLIC_SITE_URL}/get-app`. That page detects the device:

| Device | Opens |
|--------|--------|
| Android | Google Play listing URL from admin CMS |
| iPhone / iPad / iPod with App Store URL | App Store listing |
| iPhone / iPad / iPod with blank App Store URL | Coming soon page (no store buttons) |
| Desktop / unknown | `/download` fallback page |

**Change store links without reprinting the QR:** edit **Public Website → Contact & SEO → App store links** in the admin panel. Leave the iOS URL blank while the app is in review to show Coming soon. The QR never points at the stores directly — only at `/get-app`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
