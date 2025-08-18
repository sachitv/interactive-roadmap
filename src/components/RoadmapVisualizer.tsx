import React, { useMemo, useState } from "react";
import { Calendar, Filter, RotateCcw } from "lucide-react";
import { RoadmapItem, roadmapItems } from "../data/roadmapData";
import RoadmapItemComponent from "./RoadmapItem";
import Timeline from "./Timeline";
import MarkdownModal from "./MarkdownModal";

export default function RoadmapVisualizer() {
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");

  // Calculate date range
  const dateRange = useMemo(() => {
    // Fixed timeline from September 2025 to December 2025
    const startDate = new Date("2025-09-01");
    const endDate = new Date("2025-12-31");

    return { startDate, endDate };
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return roadmapItems.filter((item) => {
      const statusMatch = statusFilter === "all" ||
        item.status === statusFilter;
      const ownerMatch = ownerFilter === "all" || item.owner === ownerFilter;
      return statusMatch && ownerMatch;
    });
  }, [statusFilter, ownerFilter]);

  // Calculate positions and organize by owner rows
  const itemsWithPositions = useMemo(() => {
    const totalDays = Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    // Get unique owners and assign each a row
    const uniqueOwners = [...new Set(filteredItems.map((item) => item.owner))];
    const ownerToRow = Object.fromEntries(
      uniqueOwners.map((owner, index) => [owner, index]),
    );

    const itemsWithBasicPositions = filteredItems.map((item) => {
      const itemStartDate = new Date(item.startDate);
      const itemEndDate = new Date(item.endDate);

      const startDays = Math.ceil(
        (itemStartDate.getTime() - dateRange.startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const endDays = Math.ceil(
        (itemEndDate.getTime() - dateRange.startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      const left = (startDays / totalDays) * 100;
      const width = ((endDays - startDays) / totalDays) * 100;

      return {
        ...item,
        position: { left, width },
        row: ownerToRow[item.owner],
      };
    });

    return itemsWithBasicPositions;
  }, [filteredItems, dateRange]);

  // Get unique owners and statuses
  const owners = [...new Set(roadmapItems.map((item) => item.owner))];
  const statuses = [...new Set(roadmapItems.map((item) => item.status))];

  const resetFilters = () => {
    setStatusFilter("all");
    setOwnerFilter("all");
  };

  // Calculate container height based on number of rows
  const maxRow = Math.max(0, ...itemsWithPositions.map((item) => item.row));
  const containerHeight = (maxRow + 1) * 200 + 150;

  // Get unique owners for row labels
  const uniqueOwners = [...new Set(filteredItems.map((item) => item.owner))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Project Roadmap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our comprehensive development roadmap with interactive
            timeline visualization and detailed project insights.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filters:</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">
                Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() +
                      status.slice(1).replace("-", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">
                Owner:
              </label>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Owners</option>
                {owners.map((owner) => (
                  <option key={owner} value={owner}>
                    {owner}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Timeline View</h2>
            <span className="text-sm text-gray-500">
              ({filteredItems.length} of {roadmapItems.length} items shown)
            </span>
          </div>

          {/* Timeline */}
          <div className="mb-16">
            <Timeline
              items={filteredItems}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </div>

          {/* Roadmap Items */}
          <div className="relative" style={{ height: `${containerHeight}px` }}>
            {/* Owner row labels */}
            {uniqueOwners.map((owner, index) => (
              <div
                key={owner}
                className="absolute left-0 transform -translate-y-1/2 bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 shadow-sm"
                style={{ top: `${50 + index * 200}px` }}
              >
                {owner}
              </div>
            ))}

            {itemsWithPositions.map((item) => (
              <RoadmapItemComponent
                key={item.id}
                item={item}
                position={item.position}
                row={item.row}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Filter className="w-16 h-16 mx-auto mb-4" />
                <p className="text-xl font-medium">
                  No items match your filters
                </p>
                <p className="text-gray-500">
                  Try adjusting your filter criteria
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status Legend
          </h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded" />
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded" />
              <span className="text-sm text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded" />
              <span className="text-sm text-gray-600">Planned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Markdown Modal */}
      <MarkdownModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        markdownPath={selectedItem?.details || ""}
        title={selectedItem?.name || ""}
      />
    </div>
  );
}
