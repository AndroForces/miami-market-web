/**
 * Resolve CMS / upload media paths the same way admin does:
 * backend stores relative `/media/...` paths and returns absolute URLs via
 * `ASSET_PUBLIC_BASE_URL`. If a relative path slips through, join it to
 * `NEXT_PUBLIC_BACKEND_URL` so the browser always hits the API host.
 */
export function getBackendRootUrl(): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "";
}

export function resolveMediaUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl || pathOrUrl.trim() === "") {
    return null;
  }

  const value = pathOrUrl.trim();

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const base = getBackendRootUrl();
  if (!base) {
    return value.startsWith("/") ? value : null;
  }

  if (value.startsWith("/")) {
    return `${base}${value}`;
  }

  return `${base}/${value}`;
}
