import React, { useState } from "react";
import { api } from "../api.js";

export default function Register({ goLogin, onAuth }) {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    const res = await api.register(form);
    if (res.token) onAuth(res.token);
    else setMsg(res.message || "Registration failed");
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <h3>Register</h3>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <button>Create account</button>
      <div>{msg}</div>
      <p>Have an account? <a onClick={goLogin} style={{ cursor: "pointer" }}>Login</a></p>
    </form>
  );
}
