"use client";

import { useEffect, useState } from "react";
import type { OpenStatusContent, StructuredHourRow } from "@/lib/cms";
import { computeWebsiteStatus } from "@/lib/compute-website-status";
import { fetchManualStoreClosure } from "@/lib/store-status";
import type { OpenStatus } from "@/types/status.types";

function mapServerStatus(initial: OpenStatusContent): OpenStatus {
  return {
    statusOpen: initial.is_open_now,
    statusLabel: initial.status_label,
    statusSub: initial.status_sub,
    dayName: initial.day_name,
    signWord: initial.sign_word,
    statusDot: initial.status_dot,
    todayIdx: initial.today_idx,
  };
}

function mapComputedStatus(status: OpenStatusContent): OpenStatus {
  return {
    statusOpen: status.is_open_now,
    statusLabel: status.status_label,
    statusSub: status.status_sub,
    dayName: status.day_name,
    signWord: status.sign_word,
    statusDot: status.status_dot,
    todayIdx: status.today_idx,
  };
}

/** Admin's manual store closure (Settings → close store) always wins over posted hours. */
function applyManualClosure(
  status: OpenStatus,
  closure: { is_open: boolean; reason?: string } | null,
): OpenStatus {
  if (!closure || closure.is_open) return status;

  return {
    ...status,
    statusOpen: false,
    signWord: "CLOSED",
    statusLabel: "Closed Right Now",
    // Never surface the admin close reason on the public site.
    statusSub: "Temporarily closed — check back soon.",
    statusDot: "#D2452A",
  };
}

export function useOpenStatus(
  structuredHours: StructuredHourRow[],
  initial: OpenStatusContent,
): OpenStatus | null {
  const [status, setStatus] = useState<OpenStatus | null>(() =>
    mapServerStatus(initial),
  );

  useEffect(() => {
    let cancelled = false;

    const update = async () => {
      const base =
        structuredHours.length > 0
          ? mapComputedStatus(computeWebsiteStatus(structuredHours))
          : mapServerStatus(initial);

      const closure = await fetchManualStoreClosure();
      if (cancelled) return;
      setStatus(applyManualClosure(base, closure));
    };

    update();
    const id = setInterval(update, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [structuredHours, initial]);

  return status;
}
