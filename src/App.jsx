import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/about"
          element={
            <div style={{ padding: "2rem" }}>
              <h2>About Page</h2>
              <p>This is a placeholder About page.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;