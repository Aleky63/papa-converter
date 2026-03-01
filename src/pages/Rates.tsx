import { useEffect, useState } from "react";
import { useBaseCurrency, currencies } from "../utils/useBaseCurrency";
import { currencyNames } from "../utils/currenciesNames";
import { currencyToCountry } from "../utils/currencyFlags";

type Props = {
  dark: boolean;
};

type RatesResponse = {
  result: string;
  rates: Record<string, number>;
};

export default function Rates({ dark }: Props) {
  const [base, setBase] = useBaseCurrency();
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const fetchRates = async () => {
    setLoading(true);

    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${base}`);

      const data: RatesResponse = await response.json();

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

  useEffect(() => {
    fetchRates();
  }, [base]);

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: 20 }}>Курсы валют</h1>

      <div style={{ marginBottom: 15 }}>
        <select
          value={base}
          onChange={(e) => setBase(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            marginRight: 10,
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
          style={{
            padding: "6px 12px",
            cursor: "pointer",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#4f46e5",
            color: "#fff",
          }}
        >
          🔄 Обновить
        </button>
      </div>

      {updatedAt && (
        <p style={{ fontSize: 12, opacity: 0.7 }}>
          Последнее обновление: {updatedAt}
        </p>
      )}

      {loading && <p>Загрузка...</p>}

      {rates && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.entries(rates).map(([code, value]) => (
            <li
              key={code}
              style={{
                padding: "8px 0",
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderBottom: dark ? "1px solid #374151" : "1px solid #e5e7eb",
              }}
            >
              <img
                src={`https://flagcdn.com/24x18/${currencyToCountry[code]}.png`}
                alt={code}
                width={24}
                height={18}
                style={{ borderRadius: 3 }}
              />

              <span>
                1 {base} = {value.toFixed(4)} {code}
              </span>

              <span style={{ opacity: 0.7 }}>— {currencyNames[code]}</span>
            </li>
          ))}
        </ul>
      )}

      {!loading && !rates && (
        <p style={{ color: "red" }}>Не удалось загрузить курсы</p>
      )}
    </div>
  );
}
