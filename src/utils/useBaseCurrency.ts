import { useState, useEffect } from "react";

export function useBaseCurrency() {
  const [base, setBase] = useState<string>(
    localStorage.getItem("base") || "USD",
  );

  useEffect(() => {
    localStorage.setItem("base", base);
  }, [base]);

  return [base, setBase] as [string, (b: string) => void];
}

export const currencies = ["USD", "EUR", "RUB", "GBP", "JPY", "GEL"];
