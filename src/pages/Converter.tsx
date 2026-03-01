import { useState, useEffect } from "react";
import { useBaseCurrency, currencies } from "../utils/useBaseCurrency";

type ApiResponse = {
  result: string;
  rates: Record<string, number>;
};

type Props = {
  dark?: boolean;
};

export default function Converter({ dark = false }: Props) {
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
        backgroundColor: dark ? "#1f2937" : "#f9f9f9",
        color: dark ? "#f3f4f6" : "#333",
        transition: "background-color 0.3s, color 0.3s",
      }}
    >
      <h1 style={{ marginBottom: 20, color: dark ? "#f3f4f6" : "#333" }}>
        Currency Converter
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 20,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <input
          type="number"
          value={amount || ""}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          placeholder="Сумма"
          style={{
            padding: 10,
            width: 100,
            borderRadius: 6,
            border: "1px solid #ccc",
            backgroundColor: dark ? "#374151" : "#fff",
            color: dark ? "#f3f4f6" : "#333",
          }}
        />

        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            backgroundColor: dark ? "#374151" : "#fff",
            color: dark ? "#f3f4f6" : "#333",
          }}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>

        <span style={{ fontSize: 20, color: dark ? "#9ca3af" : "#555" }}>
          →
        </span>

        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            backgroundColor: dark ? "#374151" : "#fff",
            color: dark ? "#f3f4f6" : "#333",
          }}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p style={{ marginTop: 10, color: dark ? "#9ca3af" : "#888" }}>
          Загрузка...
        </p>
      )}
      {result && (
        <p
          style={{
            marginTop: 10,
            fontWeight: "bold",
            color: dark ? "#f3f4f6" : "#222",
          }}
        >
          {result}
        </p>
      )}
    </div>
  );
}
