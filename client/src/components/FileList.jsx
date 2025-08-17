import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export default function FileList() {
  const [files, setFiles] = useState([]);

  async function refresh() {
    const res = await fetch(`${(import.meta.env.VITE_API_URL || "http://localhost:4000")}/api/files`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await res.json();
    setFiles(data || []);
  }
  useEffect(() => { refresh(); }, []);

  async function remove(id) {
    await api.deleteFile(id);
    refresh();
  }

  return (
    <div>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {files.map(f => (
          <li key={f._id} style={{ display: "flex", gap: 12, alignItems: "center", borderBottom: "1px solid #eee", padding: 8 }}>
            <div style={{ flex: 1 }}>
              <div><b>{f.filename}</b></div>
              <div style={{ fontSize: 12 }}>{f.length} bytes • {f.contentType}</div>
            </div>
            <a href={api.fileDownloadUrl(f._id)} target="_blank" rel="noreferrer">Download</a>
            <button onClick={() => remove(f._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
