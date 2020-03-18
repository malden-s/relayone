import { useState, useEffect } from "react";
import currencies from "../currencies.json";
import { getExchangeRate } from "../api";
import { Result } from "../types";

export function useExchangeRate(currency: string): [Result<number>] {
  const [rate, setRate] = useState<Result<number>>({
    isLoading: true
  });

  useEffect(() => {
    if (currency === "BSV") {
      setRate({ value: 1, isLoading: false });
      return;
    }
    setRate({ isLoading: true });

    getExchangeRate(currencies[currency])
      .then(rate => {
        setRate({ value: 1 / rate, isLoading: false });
      })
      .catch(err => {
        console.log("Rate fetch error", err);
      });
  }, [currency, setRate]);

  return [rate];
}
