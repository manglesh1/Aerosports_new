"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudioLogin() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/studio/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
      });
      if (res.ok) {
        router.replace("/studio");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="studio_login">
      <form className="studio_card" onSubmit={handleSubmit}>
        <h1>AeroSports Studio</h1>
        <p className="studio_muted">Sign in to manage content</p>
        <label className="studio_field">
          <span>User ID</span>
          <input value={id} onChange={(e) => setId(e.target.value)} required autoFocus />
        </label>
        <label className="studio_field">
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div className="studio_error">{error}</div>}
        <button className="studio_btn" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
