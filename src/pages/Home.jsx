import { useState, useEffect } from "react";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [samples, setSamples] = useState([]);
  const [storePDFs, setStorePDFs] = useState([]);

  useEffect(() => {
    loadSamples();
    loadStore();
  }, []);

  function uploadPDF(prefix, callback) {
    console.log("📤 uploadPDF called");

    const fi = document.createElement("input");
    fi.type = "file";
    fi.accept = "application/pdf";
    fi.onchange = () => {
      const f = fi.files && fi.files[0];
      if (!f) return;

      const renamedFile = new File([f], `${prefix}_${f.name}`, { type: f.type });
      console.log("📤 Upload triggered:", renamedFile.name);

      const formData = new FormData();
      formData.append("pdf", renamedFile);

      fetch("https://quizmarket-backend.onrender.com/upload", {
        method: "POST",
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          console.log("📦 Upload response:", data);

          if (data.url) {
            alert("✅ PDF uploaded successfully!");
            const uploaded = JSON.parse(localStorage.getItem("uploadedPDFs") || "[]");
            uploaded.push({ name: renamedFile.name, url: data.url });
            localStorage.setItem("uploadedPDFs", JSON.stringify(uploaded));
            console.log("📤 Saved to localStorage:", uploaded);
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

      console.log("📁 Loaded samples from backend:", sampleFiles);
      setSamples(sampleFiles);
    })
    .catch(err => {
      console.error("❌ Failed to fetch samples from backend:", err);
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

      console.log("🛒 Loaded store PDFs from backend:", storeFiles);
      setStorePDFs(storeFiles);
    })
    .catch(err => {
      console.error("❌ Failed to fetch store PDFs from backend:", err);
    });
}

  function logoutAdmin() {
    setIsAdmin(false);
    localStorage.removeItem("uploadedPDFs");
    setSamples([]);
    setStorePDFs([]);
    console.log("🚪 Admin logged out and localStorage cleared");
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
          <p>No sample PDFs uploaded yet.</p>
        ) : (
          samples.map(file => (
            <div key={file.url}>
              <h4>{file.name}</h4>
              <a href={file.url} target="_blank" rel="noopener noreferrer">Download</a>
            </div>
          ))
        )}
      </div>

      <h3>Store PDFs</h3>
      <div>
        {storePDFs.length === 0 ? (
          <p>No store PDFs uploaded yet.</p>
        ) : (
          storePDFs.map(file => (
            <div key={file.url}>
              <h4>{file.name}</h4>
              <a href={file.url} target="_blank" rel="noopener noreferrer">Download</a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}