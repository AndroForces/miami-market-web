import { getHotPlateCalendar, getWebsiteContent } from "@/lib/cms";
import HotPlateCalendar from "@/components/sections/HotPlateCalendar";

export default async function HotPlate() {
  const [{ hot_plate: hotPlate }, calendarMonths] = await Promise.all([
    getWebsiteContent(),
    getHotPlateCalendar(),
  ]);

  return (
    <section
      id="hotplate"
      className="relative bg-cream-paper px-4 py-8 sm:px-6 sm:py-10 lg:py-12"
    >
      <HotPlateCalendar
        months={calendarMonths}
        defaultPrice={hotPlate.price_label}
        eyebrow={hotPlate.eyebrow}
        headingPrefix={hotPlate.heading_prefix}
        headingAccent={hotPlate.heading_accent}
        description={hotPlate.description}
      />
    </section>
  );
}
