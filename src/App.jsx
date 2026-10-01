/* eslint-disable no-unused-vars */
import DynamicForm from "./components/DynamicForm.jsx";
import "./App.css";
import React, { useEffect, useState } from "react";

function App() {
  const [fields, setFields] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/fields.json")
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to load fields.json (${res.status})`);
        return res.json();
      })
      .then(setFields)
      .catch((err) => setError(err.message));
  }, []);

  const handleFormSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="df-page">
      <div className="df-card">
        <h1 className="df-title">Dynamic Form</h1>
        <p className="df-subtitle">
          Rendered from an external fields.json file.
        </p>

        {error && <p className="df-error">{error}</p>}
        {!fields && !error && <p className="df-subtitle">Loading form…</p>}
        {fields && <DynamicForm fields={fields} onSubmit={handleFormSubmit} />}
      </div>
    </div>
  );
}

export default App;
