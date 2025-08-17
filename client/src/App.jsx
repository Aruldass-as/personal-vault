import React, { useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [view, setView] = useState(localStorage.getItem("token") ? "dashboard" : "login");

  function onAuth(token) {
    localStorage.setItem("token", token);
    setView("dashboard");
  }
  function logout() {
    localStorage.removeItem("token");
    setView("login");
  }

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Personal Vault</h2>
        {view === "dashboard" && <button onClick={logout}>Logout</button>}
      </header>

      {view === "login" && <Login goRegister={() => setView("register")} onAuth={onAuth} />}
      {view === "register" && <Register goLogin={() => setView("login")} onAuth={onAuth} />}
      {view === "dashboard" && <Dashboard />}
    </div>
  );
}
