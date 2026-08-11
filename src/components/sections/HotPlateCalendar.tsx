import HotPlateLiveBoardClient from "@/components/sections/HotPlateLiveBoardClient";
import type { HotPlateMonth } from "@/data/hot-plate-calendar";

interface HotPlateCalendarProps {
  months: HotPlateMonth[];
  defaultPrice: string;
  eyebrow: string;
  headingPrefix: string;
  headingAccent: string;
  description: string;
  ctaLabel: string;
  menuPdfUrl?: string | null;
}

export default function HotPlateCalendar({
  months,
  defaultPrice,
  eyebrow,
  headingPrefix,
  headingAccent,
  description,
  ctaLabel,
  menuPdfUrl,
}: HotPlateCalendarProps) {
  return (
    <HotPlateLiveBoardClient
      months={months}
      defaultPrice={defaultPrice}
      eyebrow={eyebrow}
      headingPrefix={headingPrefix}
      headingAccent={headingAccent}
      description={description}
      ctaLabel={ctaLabel}
      menuPdfUrl={menuPdfUrl}
    />
  );
}
