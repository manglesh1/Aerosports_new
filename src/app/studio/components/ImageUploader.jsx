"use client";

import { useRef, useState } from "react";
import AppImage from "../../components/AppImage";

export default function ImageUploader({ folder, onUploaded }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  async function handleFile(file) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (folder) fd.append("folder", folder);
      const res = await fetch("/api/studio/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPreview(data.desktop_url);
      onUploaded?.(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="studio_uploader">
      <label className="studio_uploader_drop">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          disabled={busy}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {busy
          ? "Optimizing & uploading…"
          : "Click to upload an image — auto-converts to WebP (desktop + mobile) and stores it"}
      </label>
      {error && <div className="studio_error" style={{ marginTop: 6 }}>{error}</div>}
      {preview && <AppImage className="studio_pp_img" src={preview} alt="uploaded preview" width={600} height={400} sizes="600px" />}
    </div>
  );
}
