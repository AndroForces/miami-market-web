"use client";

import { useState } from "react";

interface MenuItemHoverNameProps {
  name: string;
  imageUrl: string | null;
  className?: string;
}

/**
 * Dish name that optionally shows the Menu API image on hover.
 * When `imageUrl` is null, renders as a plain span (no preview chrome).
 */
export function MenuItemHoverName({
  name,
  imageUrl,
  className,
}: MenuItemHoverNameProps) {
  const [open, setOpen] = useState(false);

  if (!imageUrl) {
    return <span className={className}>{name}</span>;
  }

  return (
    <span
      className={`relative inline-block ${className ?? ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="cursor-default">{name}</span>
      {open ? (
        <span
          className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 block w-[140px] -translate-x-1/2 overflow-hidden rounded-mm border border-green-dark/15 bg-cream shadow-[0_18px_36px_-16px_rgba(0,0,0,0.55)]"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            className="block h-[140px] w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </span>
      ) : null}
    </span>
  );
}
