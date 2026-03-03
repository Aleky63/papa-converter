import { useEffect, useState, useCallback } from "react";
import { useBaseCurrency, currencies } from "../utils/useBaseCurrency";
import { currencyNames } from "../utils/currenciesNames";
import { currencyToCountry } from "../utils/currencyFlags";
import "../styles.css";

type RatesResponse = {
  result: string;
  rates: Record<string, number>;
};

const SIX_HOURS = 21600000;

export default function Rates() {
  const [base, setBase] = useBaseCurrency();
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");

  const storageKey = `rates_${base}`;

  const fetchRates = useCallback(
    async (force = false) => {
      setLoading(true);

      try {
        const cached = localStorage.getItem(storageKey);

        if (cached && !force) {
          const parsed = JSON.parse(cached);
          const isExpired = Date.now() - parsed.timestamp > SIX_HOURS;

          if (!isExpired) {
            setRates(parsed.rates);
            setUpdatedAt(new Date(parsed.timestamp).toLocaleString());
            setLoading(false);
            return;
          }
        }

        const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
        const data: RatesResponse = await res.json();

        if (data.result !== "success") {
          setRates(null);
          return;
        }

        const filtered: Record<string, number> = {};
        currencies.forEach((cur) => {
          if (data.rates[cur]) filtered[cur] = data.rates[cur];
        });

        const now = Date.now();

        localStorage.setItem(
          storageKey,
          JSON.stringify({
            rates: filtered,
            timestamp: now,
          }),
        );

        setRates(filtered);
        setUpdatedAt(new Date(now).toLocaleString());
      } catch {
        setRates(null);
      } finally {
        setLoading(false);
      }
    },
    [base, storageKey],
  );

  useEffect(() => {
    fetchRates();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchRates(true);
    }, SIX_HOURS);
    return () => clearInterval(interval);
  }, [fetchRates]);

  return (
    <div className="app-container">
      <div className="card">
        <h1>Курсы валют</h1>

        <div className="controls">
          <select value={base} onChange={(e) => setBase(e.target.value)}>
            {currencies.map((cur) => (
              <option key={cur}>{cur}</option>
            ))}
          </select>

          <button onClick={() => fetchRates(true)} disabled={loading}>
            Обновить
          </button>
        </div>

        {updatedAt && <p>Обновлено: {updatedAt}</p>}
        {loading && <p>Загрузка...</p>}

        {rates && (
          <ul className="rates-list">
            {Object.entries(rates).map(([code, value]) => (
              <li key={code} className="rate-item">
                {/* 👇 ЗДЕСЬ МЕНЯЕТСЯ РАЗМЕР ФЛАГА */}
                <img
                  src={`https://flagcdn.com/24x18/${currencyToCountry[code]}.png`}
                  width={24}
                  height={18}
                  loading="lazy"
                  alt={code}
                />

                <span>
                  1 {base} = {value.toFixed(4)} {code}
                </span>

                <span className="currency-name">— {currencyNames[code]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
