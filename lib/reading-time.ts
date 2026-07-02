import { isValidElement, type ReactNode } from "react";

function extractText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join(" ");
  }

  if (isValidElement(node)) {
    const children = (node.props as { children?: ReactNode })?.children;
    return extractText(children);
  }

  return "";
}

export function estimateReadingTime(
  sections: { content: ReactNode }[],
  wordsPerMinute = 200
): number {
  const text = sections.map((s) => extractText(s.content)).join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(words / wordsPerMinute));
}
