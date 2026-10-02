import { getBackendRootUrl } from "@/lib/media-url";

export const dynamic = "force-dynamic";

/**
 * Proxies the printable Hot Plate calendar PNG from the Nest public API.
 * Keeps the browser on same-origin so download works without CORS issues.
 */
export async function GET(): Promise<Response> {
  const base = getBackendRootUrl();
  if (!base) {
    return Response.json(
      { message: "NEXT_PUBLIC_BACKEND_URL is not configured" },
      { status: 500 },
    );
  }

  const upstream = await fetch(`${base}/api/v1/web/hot-plate-calendar/png`, {
    method: "GET",
    cache: "no-store",
  });

  if (!upstream.ok) {
    const message = await upstream.text().catch(() => "Upstream render failed");
    return new Response(message || "Failed to render calendar PNG", {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const bytes = await upstream.arrayBuffer();
  const contentType = upstream.headers.get("Content-Type") ?? "image/png";
  const disposition =
    upstream.headers.get("Content-Disposition") ??
    'attachment; filename="hot-plate-calendar.png"';

  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": disposition,
      "Cache-Control": "no-store",
    },
  });
}
