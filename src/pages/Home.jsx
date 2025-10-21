import { useState, useEffect } from "react";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [samples, setSamples] = useState([]);
  const [storePDFs, setStorePDFs] = useState([]);

  useEffect(() => {
    loadSamples();
    loadStore();
  }, []);

  function uploadPDF(callback) {
    const fi = document.createElement("input");
    fi.type = "file";
    fi.accept = "application/pdf";
    fi.onchange = () => {
      const f = fi.files && fi.files[0];
      if (!f) return;

      const formData = new FormData();
      formData.append("pdf", f);

      fetch("https://quizmarket-backend.onrender.com/upload", {
        method: "POST",
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          if (data.url) {
            alert("✅ PDF uploaded successfully!");
            const uploaded = JSON.parse(localStorage.getItem("uploadedPDFs") || "[]");
            uploaded.push({ name: f.name, url: data.url });
            localStorage.setItem("uploadedPDFs", JSON.stringify(uploaded));
            if (callback) callback();
          } else {
            alert("❌ Upload failed: " + (data.error || "Unknown error"));
          }
        })
        .catch(() => alert("❌ Upload failed"));
    };
    fi.click();
  }

  function loadSamples() {
    const uploaded = JSON.parse(localStorage.getItem("uploadedPDFs") || "[]");
    setSamples(uploaded.filter(file => file.name.startsWith("sample_")));
  }

  function loadStore() {
    const uploaded = JSON.parse(localStorage.getItem("uploadedPDFs") || "[]");
    setStorePDFs(uploaded.filter(file => file.name.startsWith("store_")));
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to QuizMarket</h2>

      {!isAdmin ? (
        <button onClick={() => setIsAdmin(true)}>Login as Admin</button>
      ) : (
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => uploadPDF(loadSamples)}>Upload Sample PDF</button>
          <button onClick={() => uploadPDF(loadStore)}>Upload Store PDF</button>
        </div>
      )}

      <h3>Free Samples</h3>
      <div>
        {samples.map(file => (
          <div key={file.url}>
            <h4>{file.name}</h4>
            <a href={file.url} target="_blank" rel="noopener noreferrer">Download</a>
          </div>
        ))}
      </div>

      <h3>Store PDFs</h3>
      <div>
        {storePDFs.map(file => (
          <div key={file.url}>
            <h4>{file.name}</h4>
            <a href={file.url} target="_blank" rel="noopener noreferrer">Download</a>
          </div>
        ))}
      </div>
    </div>
  );
}