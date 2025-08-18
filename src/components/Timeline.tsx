import { RoadmapItem } from "../data/roadmapData";

interface TimelineProps {
  items: RoadmapItem[];
  startDate: Date;
  endDate: Date;
}

export default function Timeline({ items, startDate, endDate }: TimelineProps) {
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const monthsInRange = [];

  // Generate months for timeline
  const current = new Date(startDate);
  while (current <= endDate) {
    monthsInRange.push(new Date(current));
    current.setMonth(current.getMonth() + 1);
  }

  return (
    <div className="relative w-full h-4 mb-8">
      {/* Timeline line */}
      <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full" />

      {/* Month markers */}
      {monthsInRange.map((month, index) => {
        const daysSinceStart = Math.ceil(
          (month.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        const position = (daysSinceStart / totalDays) * 100;

        return (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${position}%`, top: "50%" }}
          >
            {/* Month dot */}
            <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-sm" />

            {/* Month label */}
            <div className="absolute top-6 transform -translate-x-1/2 text-xs text-gray-600 font-medium whitespace-nowrap">
              {month.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
