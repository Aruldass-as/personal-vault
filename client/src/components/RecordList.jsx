import React from "react";
import { api } from "../api.js";

export default function RecordList({ records, onChanged }) {
  async function remove(id) {
    await api.deleteRecord(id);
    onChanged?.();
  }
  return (
    <div>
      <h3>Records</h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {records.map(r => (
          <li key={r._id} style={{ border: "1px solid #ddd", marginBottom: 8, padding: 12, borderRadius: 6 }}>
            <b>{r.title}</b> — {r.category}
            {r.tags?.length ? <div><i>Tags:</i> {r.tags.join(", ")}</div> : null}
            {r.notes ? <div style={{ whiteSpace: "pre-wrap" }}>{r.notes}</div> : null}
            {r.fileIds?.length ? <div><i>Files:</i> {r.fileIds.length}</div> : null}
            <div style={{ marginTop: 6 }}>
              <button onClick={() => remove(r._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
