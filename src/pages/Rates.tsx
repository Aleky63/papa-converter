import { useEffect, useState } from "react";
import { useBaseCurrency, currencies } from "../utils/useBaseCurrency";
import { currencyNames } from "../utils/currenciesNames";

type RatesResponse = {
  result: string;
  rates: Record<string, number>;
};

export default function Rates() {
  const [base, setBase] = useBaseCurrency();
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      setRates(null);

      try {
        const response = await fetch(
          `https://open.er-api.com/v6/latest/${base}`,
        );
        const data: RatesResponse = await response.json();

        if (data.result === "success") {
          const filteredRates: Record<string, number> = {};
          currencies.forEach((cur) => {
            if (data.rates[cur]) filteredRates[cur] = data.rates[cur];
          });
          setRates(filteredRates);
        } else {
          setRates(null);
        }
      } catch {
        setRates(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [base]);

  const handleChangeBase = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBase(e.target.value);
  };

  return (
    <div
      style={{
        maxWidth: 450,
        margin: "40px auto",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h1 style={{ marginBottom: 20, color: "#333" }}>Exchange Rates</h1>

      <label style={{ display: "block", marginBottom: 20, color: "#333" }}>
        Base currency:{" "}
        <select
          value={base}
          onChange={handleChangeBase}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            color: "#333",
            transition: "border 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.border = "1px solid #999")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.border = "1px solid #ccc")
          }
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </label>

      {loading && <p style={{ color: "#888" }}>Загрузка...</p>}

      {rates ? (
        <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
          {Object.entries(rates).map(([code, value]) => (
            <li
              key={code}
              style={{
                padding: "6px 10px",
                color: "#333",
                borderRadius: 6,
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#ececec")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              1 {base} = {value.toFixed(4)} {code} ({currencyNames[code] || ""})
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p style={{ color: "#888" }}>Не удалось загрузить курсы</p>
      )}
    </div>
  );
}
