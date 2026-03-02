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
          backgroundColor: dark ? "#1f2937" : "#ffffffc4",
          minHeight: "100vh",
          transition: "background-color 0.3s",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 👇 Волк (только в тёмной теме на ЛЮБОЙ странице) */}
        {dark && (
          <div
            style={{
              position: "fixed",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "400px",
              height: "400px",
              backgroundImage: "url('/wolf.png')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.5,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}

        {/* 👇 Собака (только в светлой теме на ЛЮБОЙ странице) */}
        {!dark && (
          <div
            style={{
              position: "fixed",
              top: "60%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "400px",
              height: "400px",
              backgroundImage: "url('/dog.png')",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.5,
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        )}

        {/* 👇 Контент поверх фона */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<Converter dark={dark} />} />
            <Route path="/rates" element={<Rates dark={dark} />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
