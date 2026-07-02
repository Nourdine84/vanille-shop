"use client";

import { useEffect } from "react";

export default function TocActiveTracker({
  sectionIds,
}: {
  sectionIds: string[];
}) {
  useEffect(() => {
    const links = new Map<string, HTMLAnchorElement>();

    document
      .querySelectorAll('nav[aria-label="Sommaire"] a[href^="#"]')
      .forEach((a) => {
        const id = a.getAttribute("href")?.slice(1);
        if (id) links.set(id, a as HTMLAnchorElement);
      });

    if (links.size === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = links.get(entry.target.id);
          if (!link) return;

          if (entry.isIntersecting) {
            links.forEach((l) => l.removeAttribute("aria-current"));
            link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return null;
}
