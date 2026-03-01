import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Converter from "./pages/Converter";
import Rates from "./pages/Rates";
import Header from "./components/Header";

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <>
      <Header dark={dark} setDark={setDark} />
      <div
        style={{
          padding: 20,
          backgroundColor: dark ? "#1f2937" : "#fff",
          minHeight: "100vh",
          transition: "background-color 0.3s",
        }}
      >
        <Routes>
          <Route path="/" element={<Converter dark={dark} />} />
          <Route path="/rates" element={<Rates dark={dark} />} />
        </Routes>
      </div>
    </>
  );
}
