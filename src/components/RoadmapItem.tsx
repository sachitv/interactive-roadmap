import { Calendar, Clock, User } from "lucide-react";
import { RoadmapItem as RoadmapItemType } from "../data/roadmapData";

interface RoadmapItemProps {
  item: RoadmapItemType;
  onClick: () => void;
  position: { left: number; width: number };
  row: number;
  rowHeight: number;
  rowOffset: number;
}

const statusColors = {
  completed: "bg-gradient-to-r from-green-500 to-emerald-600",
  "in-progress": "bg-gradient-to-r from-blue-500 to-cyan-600",
  planned: "bg-gradient-to-r from-purple-500 to-indigo-600",
};

const statusBorders = {
  completed: "border-green-200",
  "in-progress": "border-blue-200",
  planned: "border-purple-200",
};

const statusText = {
  completed: "text-green-700",
  "in-progress": "text-blue-700",
  planned: "text-purple-700",
};

const statusBg = {
  completed: "bg-green-50",
  "in-progress": "bg-blue-50",
  planned: "bg-purple-50",
};

export default function RoadmapItem(
  { item, onClick, position, row, rowHeight, rowOffset }: RoadmapItemProps,
) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="absolute transform -translate-y-1/2 cursor-pointer group"
      style={{
        left: `${position.left}%`,
        width: `${position.width}%`,
        top: `${rowOffset + row * rowHeight}px`,
      }}
      onClick={onClick}
    >
      <div
        className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
          statusBorders[item.status]
        } overflow-hidden group-hover:scale-105`}
      >
        {/* Status indicator bar */}
        <div className={`h-1 w-full ${statusColors[item.status]}`} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                {item.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{item.owner}</span>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                statusBg[item.status]
              } ${statusText[item.status]}`}
            >
              {item.status.replace("-", " ")}
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(item.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDate(item.endDate)}</span>
            </div>
          </div>

          {/* Hover indicator */}
          <div className="mt-4 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
            Click to view details
          </div>
        </div>
      </div>
    </div>
  );
}
