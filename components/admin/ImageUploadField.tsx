"use client";

import { useEffect, useState } from "react";

type Props = {
  onChange?: (url: string) => void;
  initialUrl?: string;
};

export default function ImageUploadField({
  onChange,
  initialUrl = "",
}: Props) {
  const [preview, setPreview] = useState<string>(initialUrl);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(initialUrl || "");
  }, [initialUrl]);

  const uploadFile = async (file: File) => {
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
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

      if (data?.url) {
        setPreview(data.url);

        if (onChange) {
          onChange(data.url);
        }
      }
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Erreur upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div
      style={dropZone}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />

      {!preview && <p>Glisser une image ou cliquer</p>}

      {preview && (
        <img
          src={preview}
          alt="Prévisualisation"
          style={previewImg}
        />
      )}

      {uploading && <p>Upload en cours...</p>}
    </div>
  );
}

/* STYLE */

const dropZone: React.CSSProperties = {
  border: "2px dashed #ddd",
  padding: 20,
  borderRadius: 12,
  textAlign: "center",
  cursor: "pointer",
};

const previewImg: React.CSSProperties = {
  width: "100%",
  maxHeight: 200,
  objectFit: "cover",
  borderRadius: 12,
  marginTop: 12,
};