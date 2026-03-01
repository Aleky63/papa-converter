import { Routes, Route } from "react-router-dom";
import { useState } from "react"; // ← добавь это
import Converter from "./pages/Converter";
import Rates from "./pages/Rates";
import Header from "./components/Header";

export default function App() {
  const [dark, setDark] = useState(false); // ← состояние темы

  return (
    <>
      <Header dark={dark} setDark={setDark} />

      <div style={{ padding: 20 }}>
        <Routes>
          <Route
            path="/"
            element={<Converter dark={dark} setDark={setDark} />}
          />
          <Route
            path="/rates"
            element={<Rates dark={dark} setDark={setDark} />}
          />
        </Routes>
      </div>
    </>
  );
}
