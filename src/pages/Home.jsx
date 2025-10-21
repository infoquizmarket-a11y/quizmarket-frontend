import { useEffect, useState } from "react";
import API_BASE from "../services/api";

function Home() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => console.error("Error fetching health:", err));
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