import React, { useState } from "react";
import { api } from "../api.js";

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  async function upload() {
    if (!file) return;
    const res = await api.uploadFile(file);
    if (res.fileId) setMsg(`Uploaded: ${res.fileId}`);
    else setMsg(res.message || "Upload failed");
    setFile(null);
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input type="file" onChange={e => setFile(e.target.files?.[0])} />
      <button onClick={upload}>Upload</button>
      <span>{msg}</span>
    </div>
  );
}
