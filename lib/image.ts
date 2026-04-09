export function getImageUrl(image?: string | null) {
  if (!image || image.trim() === "") {
    return "/images/default.jpg";
  }

  const clean = image.trim();

  // URL externe
  if (clean.startsWith("http")) return clean;

  // 🔥 upload local
  if (clean.startsWith("uploads/")) {
    return `/${clean}`;
  }

  // 🔥 fallback legacy
  const fileName = clean
    .replace(/^.*[\\/]/, "")
    .replace(/^images\//, "")
    .replace(/^products\//, "")
    .replace(/^collections\//, "");

  return `/images/${fileName}`;
}