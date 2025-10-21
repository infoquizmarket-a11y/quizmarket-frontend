// Central API base URL
const API_BASE =
  import.meta.env.MODE === "production"
    ? "https://quizmarket-backend.onrender.com"
    : "http://localhost:5000";

export default API_BASE;