"use client";

import { useState } from "react";

export default function ImageUploadField() {
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      const input = document.querySelector<HTMLInputElement>(
        "input[name='imageUrl']"
      );

      if (input) {
        input.value = data.url;
      }
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      alert("Erreur upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={wrapper}>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        style={fileInput}
      />

      {preview ? (
        <img src={preview} alt="Prévisualisation" style={previewImg} />
      ) : null}

      {uploading ? <p style={uploadText}>Upload en cours...</p> : null}

      <input
        name="imageUrl"
        placeholder="URL image"
        style={textInput}
        required
      />
    </div>
  );
}

const wrapper = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
};

const fileInput = {
  padding: "10px",
};

const previewImg = {
  width: "140px",
  height: "140px",
  objectFit: "cover" as const,
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const uploadText = {
  fontSize: "12px",
  color: "#666",
};

const textInput = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};