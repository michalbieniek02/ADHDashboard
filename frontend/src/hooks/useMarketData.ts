import { useEffect, useState } from "react";

const API_URL = "https://biquote.io/api";

type MarketData = {
  symbol: string;
  mid: number;
  bid: number;
  ask: number;
  dayDiffPercent: number;
  high: number;
  low: number;
  direction: string;
  timestamp: string;
  marketState: string;
  stale: boolean;
};

export function useMarketData(symbol: string) {
  const [data, setData] =
    useState<MarketData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch(
          `${API_URL}/${symbol}?allowStale=false`
        );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const result: MarketData =
          await response.json();

        if (cancelled) return;

        setData(result);
        setLoading(false);
      } catch (error) {
        console.error(
          `Market data error (${symbol}):`,
          error
        );

        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    const interval = setInterval(
      load,
      5000
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [symbol]);

  return {
    data,
    loading,
  };
}