"use client";

import { useEffect, useState } from "react";
import type { OpenStatusContent, StructuredHourRow } from "@/lib/cms";
import {
  applyStoreStatusOverride,
  computeWebsiteStatus,
} from "@/lib/compute-website-status";
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
          ? computeWebsiteStatus(structuredHours)
          : {
              is_open_now: initial.is_open_now,
              status_label: initial.status_label,
              status_sub: initial.status_sub,
              day_name: initial.day_name,
              sign_word: initial.sign_word,
              today_idx: initial.today_idx,
              status_dot: initial.status_dot,
            };

      const closure = await fetchManualStoreClosure();
      if (cancelled) return;

      // When the store-status API is unreachable, keep hours-based status.
      const resolved =
        closure === null
          ? base
          : applyStoreStatusOverride(base, closure.is_open);

      setStatus(mapComputedStatus(resolved));
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
