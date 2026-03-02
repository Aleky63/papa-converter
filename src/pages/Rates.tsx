import { useEffect, useState } from "react";
import { useBaseCurrency, currencies } from "../utils/useBaseCurrency";
import { currencyNames } from "../utils/currenciesNames";
import { currencyToCountry } from "../utils/currencyFlags";

type Props = {
  dark?: boolean;
};

type RatesResponse = {
  result: string;
  rates: Record<string, number>;
};

export default function Rates({ dark = false }: Props) {
  const [base, setBase] = useBaseCurrency();
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      const data: RatesResponse = await response.json(); // ✅ Тип используется

      if (data.result === "success") {
        const filtered: Record<string, number> = {};
        currencies.forEach((cur) => {
          if (data.rates[cur]) {
            filtered[cur] = data.rates[cur];
          }
        });
        setRates(filtered);
        setUpdatedAt(new Date().toLocaleString());
      } else {
        setRates(null);
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      setRates(null);
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchRates();
  }, [base]);

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        // 👇 Прозрачный фон для видимости собаки
        backgroundColor: dark
          ? "rgba(31, 41, 55, 0.15)"
          : "rgba(249, 249, 249, 0.7)",
        color: dark ? "#f3f4f6" : "#333",
        transition: "background-color 0.3s, color 0.3s",
        backdropFilter: dark ? "blur(2px)" : "none",
      }}
    >
      <h1 style={{ marginBottom: 20, color: dark ? "#f3f4f6" : "#333" }}>
        Курсы валют
      </h1>

      <div
        style={{
          marginBottom: 15,
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <select
          value={base}
          onChange={(e) => setBase(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            backgroundColor: dark ? "rgba(55, 65, 81, 0.25)" : "#fff",
            color: dark ? "#f3f4f6" : "#333",
            border: "1px solid #ccc",
          }}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        <button
          onClick={fetchRates}
          disabled={loading}
          style={{
            padding: "6px 12px",
            cursor: loading ? "not-allowed" : "pointer",
            borderRadius: 6,
            border: "none",
            backgroundColor: loading ? "#9ca3af" : "#4f46e5",
            color: "#fff",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = "#4338ca";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = loading
              ? "#9ca3af"
              : "#4f46e5";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          🔄 Обновить
        </button>
      </div>

      {updatedAt && (
        <p
          style={{
            fontSize: 12,
            opacity: 0.7,
            color: dark ? "#9ca3af" : "#6b7280",
          }}
        >
          Последнее обновление: {updatedAt}
        </p>
      )}

      {loading && (
        <p style={{ color: dark ? "#9ca3af" : "#6b7280" }}>Загрузка...</p>
      )}

      {rates && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {Object.entries(rates).map(([code, value]) => (
            <li
              key={code}
              style={{
                padding: "8px 0",
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderBottom: dark ? "1px solid #374151" : "1px solid #e5e7eb",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = dark
                  ? "rgba(55, 65, 81, 0.3)"
                  : "rgba(243, 244, 246, 0.5)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <img
                src={`https://flagcdn.com/24x18/${currencyToCountry[code]}.png`}
                alt={code}
                width={24}
                height={18}
                style={{ borderRadius: 3, objectFit: "cover" }}
                loading="lazy"
              />
              <span>
                1 {base} = {value.toFixed(4)} {code}
              </span>
              <span
                style={{ opacity: 0.7, color: dark ? "#9ca3af" : "#6b7280" }}
              >
                — {currencyNames[code]}
              </span>
            </li>
          ))}
        </ul>
      )}

      {!loading && !rates && (
        <p style={{ color: "#ef4444" }}>Не удалось загрузить курсы</p>
      )}
    </div>
  );
}
