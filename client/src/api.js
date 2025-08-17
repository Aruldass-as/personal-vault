const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async register(data) {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async login(data) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async getRecords(params = "") {
    const res = await fetch(`${API}/api/records${params ? `?${params}` : ""}`, { headers: authHeaders() });
    return res.json();
  },
  async createRecord(payload) {
    const res = await fetch(`${API}/api/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async updateRecord(id, payload) {
    const res = await fetch(`${API}/api/records/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload)
    });
    return res.json();
  },
  async deleteRecord(id) {
    const res = await fetch(`${API}/api/records/${id}`, { method: "DELETE", headers: authHeaders() });
    return res.json();
  },
  async uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API}/api/files/upload`, { method: "POST", headers: authHeaders(), body: fd });
    return res.json(); // { fileId }
  },
  async linkFile(recordId, fileId) {
    const res = await fetch(`${API}/api/files/link`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ recordId, fileId })
    });
    return res.json();
  },
  fileDownloadUrl(fileId) {
    return `${API}/api/files/${fileId}`;
  },
  async deleteFile(fileId) {
    const res = await fetch(`${API}/api/files/${fileId}`, { method: "DELETE", headers: authHeaders() });
    return res.json();
  }
};
