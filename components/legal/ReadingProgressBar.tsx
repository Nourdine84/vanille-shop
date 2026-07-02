"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;

      setProgress(Math.min(100, Math.max(0, pct)));
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="no-print"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: `${progress}%`,
        background: "linear-gradient(90deg,#a16207,#d4af37)",
        zIndex: 10000,
        transition: "width 0.1s linear",
      }}
    />
  );
}
