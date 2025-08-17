import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import RecordForm from "../components/RecordForm.jsx";
import RecordList from "../components/RecordList.jsx";
import FileUploader from "../components/FileUploader.jsx";
import FileList from "../components/FileList.jsx";

export default function Dashboard() {
  const [records, setRecords] = useState([]);

  async function refresh() {
    const data = await api.getRecords();
    setRecords(data || []);
  }
  useEffect(() => { refresh(); }, []);

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <RecordForm onCreated={refresh} />
      <RecordList records={records} onChanged={refresh} />
      <h3>Files</h3>
      <FileUploader />
      <FileList />
    </div>
  );
}
