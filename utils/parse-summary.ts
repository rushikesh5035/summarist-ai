export interface ParsedSection {
  title: string;
  points: string[];
}

export interface ParsedSummary {
  title: string;
  readTime: string;
  overview: string;
  keyPoints: string[];
  sections: ParsedSection[];
  actionItems: string[];
}

interface AiJsonSummary {
  title: string;
  readTime: string;
  overview: string;
  keyPoints: string[];
  sections: { title: string; content: string }[];
  actionItems: string[];
}

export function parseSummaryText(
  summaryText: string,
  // wordCount kept for API compatibility but readTime now comes from AI
  _wordCount: number
): ParsedSummary {
  try {
    const json: AiJsonSummary = JSON.parse(summaryText);

    return {
      title: json.title ?? "Summary",
      readTime: json.readTime ?? "5 min read",
      overview: json.overview ?? "",
      keyPoints: Array.isArray(json.keyPoints) ? json.keyPoints : [],
      sections: Array.isArray(json.sections)
        ? json.sections
            .filter((s) => s.title && s.content)
            .map((s) => ({ title: s.title, points: [s.content] }))
        : [],
      actionItems: Array.isArray(json.actionItems) ? json.actionItems : [],
    };
  } catch {
    // Fallback: return a minimal summary so the page never crashes
    return {
      title: "Summary",
      readTime: "5 min read",
      overview: summaryText.slice(0, 300),
      keyPoints: [],
      sections: [],
      actionItems: [],
    };
  }
}
