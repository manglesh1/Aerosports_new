"use client";

import React from "react";
import Link from "next/link";
import { AdminProvider, useAdmin } from "./AdminContext";

function AdminLayoutContentInner({ children }) {
  const { isLoggedIn } = useAdmin();

  if (!isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <aside
        style={{
          width: 250,
          backgroundColor: "#e91e63",
          color: "white",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h2 style={{ marginBottom: "2rem" }}>AeroSports Admin</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link href="/admin" style={{ color: "white", textDecoration: "none" }}>
            Dashboard
          </Link>
          <Link href="/admin/sheet" style={{ color: "white", textDecoration: "none" }}>
            Site Pages
          </Link>
          <Link href="/admin/settings" style={{ color: "white", textDecoration: "none" }}>
            Settings
          </Link>
        </nav>
      </aside>

      <main style={{ flexGrow: 1, padding: "2rem", backgroundColor: "#f9f9f9" }}>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayoutContent({ children }) {
  return (
    <AdminProvider>
      <AdminLayoutContentInner>{children}</AdminLayoutContentInner>
    </AdminProvider>
  );
}
