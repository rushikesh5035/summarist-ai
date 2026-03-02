import { BookOpen, Code, GraduationCap, Scale, TrendingUp } from "lucide-react";

export const cases = [
  {
    icon: Scale,
    title: "Legal Professionals",
    description:
      "Summarize contracts, NDAs, and case files. Extract key clauses and obligations in seconds.",
    iconColor: "text-blue-400",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/20",
    tag: "Legal",
    span: "col-span-1 md:col-span-2 row-span-1",
    stat: "3x faster reviews",
  },
  {
    icon: GraduationCap,
    title: "Students & Researchers",
    description:
      "Digest academic papers, textbooks, and research reports. Chat to understand complex topics.",
    iconColor: "text-purple-400",
    accentBg: "bg-purple-500/10",
    accentBorder: "border-purple-500/20",
    tag: "Education",
    span: "col-span-1 row-span-2",
    stat: "10K+ papers processed",
  },
  {
    icon: TrendingUp,
    title: "Business Analysts",
    description:
      "Quickly parse financial reports, market analyses, and strategy documents for key metrics.",
    iconColor: "text-[#0CF2A0]",
    accentBg: "bg-[#0CF2A0]/10",
    accentBorder: "border-[#0CF2A0]/20",
    tag: "Business",
    span: "col-span-1 md:col-span-2 row-span-1",
    stat: "85% time saved",
  },
  {
    icon: Code,
    title: "Developers",
    description:
      "Parse technical documentation, API specs, and architecture docs. Get instant code context.",
    iconColor: "text-amber-400",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/20",
    tag: "Tech",
    span: "col-span-1 md:col-span-2 row-span-1",
    stat: "API docs in seconds",
  },
  {
    icon: BookOpen,
    title: "Content Creators",
    description:
      "Research faster. Extract quotes, data points, and talking points from any source material.",
    iconColor: "text-cyan-400",
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/20",
    tag: "Content",
    span: "col-span-1 row-span-1",
    stat: "2x research speed",
  },
];
