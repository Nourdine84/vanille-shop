export function getImageUrl(image?: string | null) {
    if (!image || image.trim() === "") {
      return "/images/default.jpg";
    }
  
    const clean = image.trim();
  
    // URL externe
    if (clean.startsWith("http")) return clean;
  
    // 🔥 NORMALISATION FORCÉE
    const fileName = clean
      .replace(/^.*[\\/]/, "") // enlève dossier
      .replace(/^images\//, "")
      .replace(/^products\//, "")
      .replace(/^collections\//, "");
  
    return `/images/${fileName}`;
  }