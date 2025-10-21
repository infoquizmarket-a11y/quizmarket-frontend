import { useEffect, useState } from "react";
import API_BASE from "../services/api";

function Home() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    console.log("API_BASE:", API_BASE);
    console.log("Fetching from:", `${API_BASE}/health`);

    fetch(`${API_BASE}/health`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Backend response:", data);
        setHealth(data);
      })
      .catch((err) => {
        console.error("Error fetching health:", err);
        setHealth({ error: err.message });
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to QuizMarket 🎉</h1>
      <p>This is your frontend talking to your backend.</p>
      {health ? (
        <pre>{JSON.stringify(health, null, 2)}</pre>
      ) : (
        <p>Loading backend status...</p>
      )}
    </div>
  );
}

export default Home;
