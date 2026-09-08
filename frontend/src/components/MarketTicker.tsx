import { useMarketData } from "../hooks/useMarketData";
import "../styles/marketTicker.css"
function MarketTicker() {
  const {
    data,
    loading,
  } = useMarketData("XAUUSD");

  if (loading) {
    return (
      <div className="market-ticker">
        <span className="market-symbol">
          XAU/USD
        </span>

        <span className="market-price">
          Loading...
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="market-ticker">
        <span className="market-symbol">
          XAU/USD
        </span>

        <span className="market-price">
          —
        </span>
      </div>
    );
  }

  const positive =
    data.dayDiffPercent >= 0;

  return (
    <div className="market-ticker">

      <div className="market-main">

        <div className="market-header">
          <span className="market-symbol">
            XAU/USD
          </span>

          <div className="market-status">
            <span className="market-dot" />
            LIVE
          </div>
        </div>

        <div className="market-price-row">

          <span
  className={`market-price ${
    data.direction === "UP"
      ? "price-up"
      : data.direction === "DOWN"
      ? "price-down"
      : ""
  }`}
>
  ${data.mid.toFixed(2)}
</span>

          <span
            className={
              positive
                ? "market-change positive"
                : "market-change negative"
            }
          >
            {positive ? "+" : ""}
            {data.dayDiffPercent.toFixed(2)}%
          </span>

        </div>

      </div>

      <div className="market-stats">

        <div className="market-stat">
          <span>DAILY HIGH</span>

          <strong>
            ${data.high.toFixed(2)}
          </strong>
        </div>

        <div className="market-stat">
          <span>DAILY LOW</span>

          <strong>
            ${data.low.toFixed(2)}
          </strong>
        </div>

      </div>

    </div>
  );
}

export default MarketTicker;