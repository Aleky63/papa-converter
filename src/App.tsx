import { Routes, Route } from "react-router-dom";
import Converter from "./pages/Converter";
import Rates from "./pages/Rates";
import Header from "./components/Header";

export default function App() {
  return (
    <>
      <Header />

      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<Converter />} />
          <Route path="/rates" element={<Rates />} />
        </Routes>
      </div>
    </>
  );
}
