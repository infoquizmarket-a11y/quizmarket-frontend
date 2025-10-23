import React, { useState, useEffect } from "react";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [samples, setSamples] = useState([]);
  const [storePDFs, setStorePDFs] = useState([]);

  useEffect(() => {
    loadSamples();
    loadStore();
  }, []);

  function uploadPDF(prefix, callback) {
    const fi = document.createElement("input");
    fi.type = "file";
    fi.accept = "application/pdf";
    fi.onchange = () => {
      const f = fi.files && fi.files[0];
      if (!f) return;

      const renamedFile = new File([f], `${prefix}_${f.name}`, { type: f.type });
      const formData = new FormData();
      formData.append("pdf", renamedFile);

      fetch("https://quizmarket-backend.onrender.com/upload", {
        method: "POST",
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          if (data.url) {
            alert("✅ PDF uploaded successfully!");
            if (callback) callback();
          } else {
            alert("❌ Upload failed: " + (data.error || "Unknown error"));
          }
        })
        .catch(err => {
          console.error("❌ Upload error:", err);
          alert("❌ Upload failed");
        });
    };
    fi.click();
  }

  function deleteFile(title, callback) {
    fetch("https://quizmarket-backend.onrender.com/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("🗑️ File deleted successfully");
          if (callback) callback();
        } else {
          alert("❌ Delete failed: " + (data.error || "Unknown error"));
        }
      })
      .catch(err => {
        console.error("❌ Delete error:", err);
        alert("❌ Delete failed");
      });
  }

  function loadSamples() {
    fetch("https://quizmarket-backend.onrender.com/list")
      .then(res => res.json())
      .then(data => {
        const sampleFiles = data.samples
          .filter(file => file.title.startsWith("sample_"))
          .map(file => ({
            name: file.title + ".pdf",
            url: file.url,
          }));
        setSamples(sampleFiles);
      })
      .catch(err => {
        console.error("❌ Failed to fetch samples from backend:", err);
        setSamples([]);
      });
  }

  function loadStore() {
    fetch("https://quizmarket-backend.onrender.com/list")
      .then(res => res.json())
      .then(data => {
        const storeFiles = data.samples
          .filter(file => file.title.startsWith("store_"))
          .map(file => ({
            name: file.title + ".pdf",
            url: file.url,
          }));
        setStorePDFs(storeFiles);
      })
      .catch(err => {
        console.error("❌ Failed to fetch store PDFs from backend:", err);
        setStorePDFs([]);
      });
  }

  function logoutAdmin() {
    setIsAdmin(false);
    setSamples([]);
    setStorePDFs([]);
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome to QuizMarket</h2>

      {!isAdmin ? (
        <button onClick={() => setIsAdmin(true)}>Login as Admin</button>
      ) : (
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => uploadPDF("sample", loadSamples)}>Upload Sample PDF</button>
          <button onClick={() => uploadPDF("store", loadStore)}>Upload Store PDF</button>
          <button onClick={logoutAdmin} style={{ marginLeft: "1rem" }}>Logout</button>
        </div>
      )}

      <h3>Free Samples</h3>
      <div>
        {samples.length === 0 ? (
          <p>No sample PDFs found.</p>
        ) : (
          samples.map(file => (
            <div key={file.url} className="sample-card">
              <div className="sample-icon"><i className="fas fa-file-pdf"></i></div>
              <h4>{file.name}</h4>
              <button
                className="download-btn"
                onClick={() => window.open(file.url, "_blank")}
              >
                Download
              </button>
              {isAdmin && (
                <button
                  className="download-btn"
                  style={{ background: "#dc3545", marginTop: "8px" }}
                  onClick={() => deleteFile(file.name.replace(".pdf", ""), loadSamples)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <h3>Store PDFs</h3>
      <div>
        {storePDFs.length === 0 ? (
          <p>No store PDFs found.</p>
        ) : (
          storePDFs.map(file => (
            <div key={file.url} className="store-card">
              <div className="store-icon"><i className="fas fa-file-pdf"></i></div>
              <h4>{file.name}</h4>
              <button
                className="download-btn"
                onClick={() => window.open(file.url, "_blank")}
              >
                Download
              </button>
              {isAdmin && (
                <button
                  className="download-btn"
                  style={{ background: "#dc3545", marginTop: "8px" }}
                  onClick={() => deleteFile(file.name.replace(".pdf", ""), loadStore)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}