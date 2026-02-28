import { useState, useEffect } from "react";
import { useBaseCurrency, currencies } from "../utils/useBaseCurrency";

type ApiResponse = {
  result: string;
  rates: Record<string, number>;
};

export default function Converter() {
  const [amount, setAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("RUB");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [baseCurrency] = useBaseCurrency();

  useEffect(() => {
    setFromCurrency(baseCurrency);
  }, [baseCurrency]);

  useEffect(() => {
    if (!amount || !fromCurrency || !toCurrency) {
      setResult("");
      return;
    }

    const convert = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://open.er-api.com/v6/latest/${fromCurrency}`,
        );
        const data: ApiResponse = await response.json();

        if (data.result !== "success") {
          setResult("Ошибка API");
          return;
        }

        const rate = data.rates[toCurrency];
        if (!rate) {
          setResult("Неизвестная валюта");
          return;
        }

        setResult(
          `${amount} ${fromCurrency} = ${(amount * rate).toFixed(4)} ${toCurrency}`,
        );
      } catch {
        setResult("Ошибка запроса к серверу");
      } finally {
        setLoading(false);
      }
    };

    convert();
  }, [amount, fromCurrency, toCurrency]);

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
      <h1 style={{ marginBottom: 20, color: "#333" }}>Currency Converter</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
          gap: 10,
        }}
      >
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Сумма"
          style={{
            padding: 10,
            width: 100,
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
        />

        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          style={{
            padding: 10,
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

        <span
          style={{ fontSize: 20, color: "#555", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#333")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
        >
          →
        </span>

        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          style={{
            padding: 10,
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
      </div>

      {loading && <p style={{ marginTop: 10, color: "#888" }}>Загрузка...</p>}
      {result && (
        <p style={{ marginTop: 10, fontWeight: "bold", color: "#222" }}>
          {result}
        </p>
      )}
    </div>
  );
}
