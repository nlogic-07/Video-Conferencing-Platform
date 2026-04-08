import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
