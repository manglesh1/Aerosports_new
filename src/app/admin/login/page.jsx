"use client";

import React, { useState } from "react";
import { useAdmin } from "../AdminContext";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const { login } = useAdmin();
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(userId, password);
    if (success) {
      router.replace("/admin"); // Redirect to dashboard, replaces history entry
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "5rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userId" style={{ display: "block", marginBottom: 4 }}>
          User ID
        </label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
          required
        />
        <label htmlFor="password" style={{ display: "block", marginBottom: 4 }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
          required
        />
        {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
        <button type="submit" style={{ backgroundColor: "#e91e63", color: "white", border: "none", padding: "0.6em 1.5em", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "1rem" }}>
          Login
        </button>
      </form>
    </div>
  );
}
