"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/studio/login", { method: "DELETE" });
    router.replace("/studio/login");
    router.refresh();
  }
  return (
    <button className="studio_btn studio_btn_ghost" onClick={logout}>
      Log out
    </button>
  );
}
