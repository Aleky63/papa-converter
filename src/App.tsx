import { Routes, Route, Link } from "react-router-dom";
import Converter from "./pages/Converter";
import Rates from "./pages/Rates";

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <Link to="/">Converter</Link>
        <Link to="/rates">Rates</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Converter />} />
        <Route path="/rates" element={<Rates />} />
      </Routes>
    </div>
  );
}
