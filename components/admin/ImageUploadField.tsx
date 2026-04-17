"use client";

import { useState } from "react";

/* 🔥 AJOUT DU TYPE */
type Props = {
  onChange?: (url: string) => void;
};

export default function ImageUploadField({ onChange }: Props) {
  const [preview, setPreview] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erreur upload");
      }

      setImageUrl(data.url);

      /* 🔥 CALLBACK VERS PARENT */
      if (onChange) {
        onChange(data.url);
      }

    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      alert("Erreur upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div style={wrapper}>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      {preview && <img src={preview} style={previewImg} />}

      {uploading && <p>Upload...</p>}

      <input
        name="imageUrl"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="URL image"
        required
      />
    </div>
  );
}

/* STYLE */

const wrapper = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
};

const previewImg = {
  width: "140px",
  borderRadius: "10px",
};