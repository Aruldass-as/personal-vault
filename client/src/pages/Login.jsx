import React, { useState } from "react";
import { api } from "../api.js";

export default function Login({ goRegister, onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    const res = await api.login({ email, password });
    if (res.token) onAuth(res.token);
    else setMsg(res.message || "Login failed");
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <h3>Login</h3>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button>Login</button>
      <div>{msg}</div>
      <p>No account? <a onClick={goRegister} style={{ cursor: "pointer" }}>Register</a></p>
    </form>
  );
}
