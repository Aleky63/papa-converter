import { useState, useEffect } from "react";
import { useBaseCurrency, currencies } from "../utils/useBaseCurrency";
import "../styles.css";

type ApiResponse = {
  result: string;
  rates: Record<string, number>;
};

export default function Converter() {
  const [amount, setAmount] = useState<number>(0);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("RUB");
  const [rate, setRate] = useState<number | null>(null);

  const [baseCurrency] = useBaseCurrency();

  useEffect(() => {
    setFromCurrency(baseCurrency);
  }, [baseCurrency]);

  useEffect(() => {
    if (!fromCurrency || !toCurrency) return;

    const fetchRate = async () => {
      const res = await fetch(
        `https://open.er-api.com/v6/latest/${fromCurrency}`,
      );
      const data: ApiResponse = await res.json();
      if (data.result === "success") {
        setRate(data.rates[toCurrency]);
      }
    };

    fetchRate();
  }, [fromCurrency, toCurrency]);

  const result =
    amount && rate
      ? `${amount} ${fromCurrency} = ${(amount * rate).toFixed(4)} ${toCurrency}`
      : "";

  return (
    <div className="app-container">
      <div className="card">
        <h1>Currency Converter</h1>

        <div className="controls">
          <input
            type="number"
            value={amount === 0 ? "" : amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            placeholder="Сумма"
          />

          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map((cur) => (
              <option key={cur}>{cur}</option>
            ))}
          </select>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map((cur) => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
        </div>

        {result && <p>{result}</p>}
      </div>
    </div>
  );
}
