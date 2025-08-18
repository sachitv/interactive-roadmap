export interface RoadmapItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  details: string; // path to markdown file
  status: "completed" | "in-progress" | "planned";
  owner: string;
}

export const roadmapItems: RoadmapItem[] = [
  {
    id: "1",
    name: "Project Foundation",
    startDate: "2025-09-01",
    endDate: "2025-09-30",
    details: "/markdown/project-foundation.md",
    status: "completed",
    owner: "Engineering Team",
  },
  {
    id: "2",
    name: "Core Features Development",
    startDate: "2025-09-15",
    endDate: "2025-10-31",
    details: "/markdown/core-features.md",
    status: "completed",
    owner: "Product Team",
  },
  {
    id: "3",
    name: "User Experience Enhancement",
    startDate: "2025-10-01",
    endDate: "2025-11-15",
    details: "/markdown/ux-enhancement.md",
    status: "in-progress",
    owner: "Design Team",
  },
  {
    id: "4",
    name: "Advanced Analytics",
    startDate: "2025-10-15",
    endDate: "2025-12-01",
    details: "/markdown/advanced-analytics.md",
    status: "in-progress",
    owner: "Data Team",
  },
  {
    id: "5",
    name: "Mobile Application",
    startDate: "2025-11-01",
    endDate: "2025-12-31",
    details: "/markdown/mobile-app.md",
    status: "planned",
    owner: "Mobile Team",
  },
  {
    id: "6",
    name: "AI Integration",
    startDate: "2025-11-15",
    endDate: "2025-12-31",
    details: "/markdown/ai-integration.md",
    status: "planned",
    owner: "AI Team",
  },
];
