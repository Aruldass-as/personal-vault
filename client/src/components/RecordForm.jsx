import React, { useState } from "react";
import { api } from "../api.js";

export default function RecordForm({ onCreated }) {
  const [form, setForm] = useState({ title: "", category: "Other", tags: "", notes: "" });

  async function submit(e) {
    e.preventDefault();
    const payload = {
      title: form.title,
      category: form.category,
      tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
      notes: form.notes
    };
    await api.createRecord(payload);
    setForm({ title: "", category: "Other", tags: "", notes: "" });
    onCreated?.();
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
      <h3>Add record</h3>
      <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
        <option>ID</option><option>Finance</option><option>Health</option><option>Work</option><option>Other</option>
      </select>
      <input placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
      <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      <button>Save</button>
    </form>
  );
}
