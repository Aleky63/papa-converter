import { NavLink } from "react-router-dom";

export default function Header() {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: "none",
    padding: "8px 14px",
    borderRadius: 8,
    color: isActive ? "#ffffff" : "#333",
    backgroundColor: isActive ? "#4f46e5" : "transparent",
    transition: "all 0.2s ease",
  });

  return (
    <header
      style={{
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h2 style={{ margin: 0, fontWeight: 600 }}>💱 Currency App</h2>

      <nav style={{ display: "flex", gap: 12 }}>
        <NavLink to="/" style={linkStyle}>
          Конвертер
        </NavLink>

        <NavLink to="/rates" style={linkStyle}>
          Курсы
        </NavLink>
      </nav>
    </header>
  );
}
