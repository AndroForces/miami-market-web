import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("getGallery", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_URL", "https://api.example.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("should_map_gallery_images_and_resolve_media_urls", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            eyebrow: "Our Gallery",
            heading: "A taste of Miami Market",
            intro: "Food and community.",
            images: [
              {
                id: "img-1",
                caption: "Deli case",
                category: "Food",
                image_url: "/media/gallery/rev.webp",
              },
            ],
          },
        }),
      }),
    );

    const { getGallery } = await import("./cms");
    const gallery = await getGallery();

    expect(gallery.eyebrow).toBe("Our Gallery");
    expect(gallery.heading).toBe("A taste of Miami Market");
    expect(gallery.intro).toBe("Food and community.");
    expect(gallery.images).toEqual([
      {
        id: "img-1",
        caption: "Deli case",
        category: "Food",
        image_url: "https://api.example.com/media/gallery/rev.webp",
      },
    ]);
  });

  it("should_return_empty_gallery_when_fetch_fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    const { getGallery } = await import("./cms");
    await expect(getGallery()).resolves.toEqual({
      eyebrow: "",
      heading: "",
      intro: "",
      images: [],
    });
  });

  it("should_return_empty_gallery_when_fetch_throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network down")),
    );

    const { getGallery } = await import("./cms");
    await expect(getGallery()).resolves.toEqual({
      eyebrow: "",
      heading: "",
      intro: "",
      images: [],
    });
  });
});
