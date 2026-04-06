"use client";

import { useAdmin } from "./AdminContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { isLoggedIn } = useAdmin();
  const router = useRouter();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/admin/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // or loading spinner while redirecting
  }

  return (
    <>
      <h1>Welcome to AeroSports Admin Panel</h1>
      <p>Manage users, settings, and site data from here.</p>
      {/* Add dashboard content here */}
    </>
  );
}
