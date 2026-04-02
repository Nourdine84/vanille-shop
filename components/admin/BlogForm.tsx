"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// 🔥 IMPORTANT (évite bug SSR)
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function BlogForm() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  return (
    <form
      action="/api/admin/blog"
      method="POST"
      onSubmit={() => setLoading(true)}
      style={form}
    >
      <input name="title" placeholder="Titre article" required style={input} />

      <input name="slug" placeholder="Slug (URL)" required style={input} />

      <input name="excerpt" placeholder="Résumé SEO" style={input} />

      {/* 🔥 EDITEUR RICHE */}
      <div style={{ background: "white" }}>
        <ReactQuill
  theme="snow"
  value={content}
  onChange={setContent}
  modules={{
    toolbar: {
      container: [
        ["bold", "italic", "underline"],
        ["header", [1, 2, 3, false]],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: () => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.click();

          input.onchange = () => {
            const file = input.files?.[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = () => {
              setContent((prev) => prev + `<p><img src="${reader.result}" /></p>`);
            };

            reader.readAsDataURL(file);
          };
        },
      },
    },
  }}
  style={{ height: 200, marginBottom: 20 }}
/>
      </div>

      {/* 🔥 hidden field */}
      <textarea
        name="content"
        value={content}
        readOnly
        hidden
      />

      <button style={button}>
        {loading ? "Publication..." : "Publier"}
      </button>
    </form>
  );
}

/* STYLE */

const form = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const button = {
  background: "#a16207",
  color: "white",
  padding: 12,
  borderRadius: 10,
  border: "none",
};