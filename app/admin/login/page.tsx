"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      alert("Mot de passe incorrect");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🔐 Admin Login</h1>

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "10px",
          marginTop: "20px",
          borderRadius: "8px",
        }}
      />

      <br />

      <button
        onClick={handleLogin}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#a16207",
          color: "white",
          borderRadius: "8px",
        }}
      >
        Se connecter
      </button>
    </div>
  );
}