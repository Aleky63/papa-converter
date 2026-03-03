import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Converter from "./pages/Converter";
import Rates from "./pages/Rates";
import Header from "./components/Header";
import "./styles.css";

function Background({ dark }: { dark: boolean }) {
  const image = dark ? "/wolf.png" : "/dog.png";

  return (
    <div
      style={{
        position: "fixed",
        top: "60%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        height: "400px",
        backgroundImage: `url(${image})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.35,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

export default function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const html = document.documentElement;

    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <>
      <Header dark={dark} setDark={setDark} />
      <Background dark={dark} />

      <Routes>
        <Route path="/" element={<Converter />} />
        <Route path="/rates" element={<Rates />} />
      </Routes>
    </>
  );
}
