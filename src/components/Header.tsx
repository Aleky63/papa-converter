import { NavLink } from "react-router-dom";

type Props = {
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ dark, setDark }: Props) {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: 8,
    color: isActive ? "#fff" : dark ? "#f9fafb" : "#111827",
    backgroundColor: isActive ? "#4f46e5" : "transparent",
  });

  return (
    <header
      style={{
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: dark ? "#111827" : "#ffffff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ margin: 0 }}>💱 Currency App</h2>

      <nav style={{ display: "flex", gap: 10 }}>
        <NavLink to="/" style={linkStyle}>
          Конвертер
        </NavLink>
        <NavLink to="/rates" style={linkStyle}>
          Курсы
        </NavLink>
      </nav>

      <button
        onClick={() => setDark((prev) => !prev)}
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
        }}
      >
        {dark ? "☀ Светлая" : "🌙 Тёмная"}
      </button>
    </header>
  );
}
