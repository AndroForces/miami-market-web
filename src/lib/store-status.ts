"use client";

export interface ManualStoreClosure {
  is_open: boolean;
  reason?: string;
}

function getBackendRootUrl(): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "";
}

/**
 * Public, unauthenticated status endpoint (same one the Flutter app uses).
 * Returns null on any failure so callers can fall back to hours-based status
 * rather than show an incorrect "closed" state from a transient network error.
 */
export async function fetchManualStoreClosure(): Promise<ManualStoreClosure | null> {
  const base = getBackendRootUrl();
  if (!base) return null;

  try {
    const res = await fetch(`${base}/api/v1/store/status`, { cache: "no-store" });
    if (!res.ok) return null;

    const body = await res.json();
    const data = body?.data ?? body;
    if (typeof data?.is_open !== "boolean") return null;

    return { is_open: data.is_open, reason: data.reason };
  } catch {
    return null;
  }
}
