"use client";

import { useState } from "react";

export default function ImageSafe({ src, alt, style }: any) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      style={style}
      onError={() => setImgSrc("/images/default.jpg")}
    />
  );
}