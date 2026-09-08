import { useEffect, useMemo, useState } from "react";
import "../styles/expenses.css";
import {
  getExpenses,
  deleteExpense,
} from "../api/finance";

import type { Expense } from "../types";

const categoryLabels: Record<string, string> = {
  food: "Jedzenie",
  car: "Samochód",
  shopping: "Zakupy",
  entertainment: "Rozrywka",
  bills: "Rachunki",
  health: "Zdrowie",
  transport: "Transport",
  other: "Inne",
};

const categoryOrder = [
  "food",
  "car",
  "shopping",
  "entertainment",
  "bills",
  "health",
  "transport",
  "other",
];

type Period =
  | "month"
  | "previous"
  | "all";

function Expenses() {
  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [period, setPeriod] =
    useState<Period>("month");

  const [category, setCategory] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getExpenses(
        period,
        period === "all"
          ? category || undefined
          : undefined
      );

      setExpenses(data);
    } catch (error) {
      console.error(error);
      setError(
        "Nie udało się pobrać wydatków."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [period, category]);

  const total = useMemo(() => {
    return expenses.reduce(
      (sum, expense) =>
        sum + expense.amount,
      0
    );
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    const totals: Record<
      string,
      number
    > = {};

    for (const expense of expenses) {
      totals[expense.category] =
        (totals[expense.category] || 0) +
        expense.amount;
    }

    return categoryOrder
      .filter(
        (cat) => totals[cat] > 0
      )
      .map((cat) => ({
        category: cat,
        label:
          categoryLabels[cat] || cat,
        amount: totals[cat],
        percentage:
          total === 0
            ? 0
            : (totals[cat] / total) * 100,
      }));
  }, [expenses, total]);

  const handleDelete = async (
    id: number
  ) => {
    try {
      await deleteExpense(id);

      setExpenses((current) =>
        current.filter(
          (expense) =>
            expense.id !== id
        )
      );
    } catch (error) {
      console.error(error);
      setError(
        "Nie udało się usunąć wydatku."
      );
    }
  };

  return (
    <section className="content expenses-page">
      <div className="page-header">
        <div>
          <span className="label">
            FINANCE
          </span>

          <h1>Expenses</h1>

          <p className="page-description">
            Wszystkie Twoje wydatki w jednym miejscu.
          </p>
        </div>

        <div className="expense-filters">
          <button
            className={
              period === "month"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriod("month")
            }
          >
            Ten miesiąc
          </button>

          <button
            className={
              period === "previous"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriod("previous")
            }
          >
            Poprzedni
          </button>

          <button
            className={
              period === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setPeriod("all")
            }
          >
            Wszystko
          </button>
        </div>
      </div>

      {period === "all" && (
        <div className="category-filter">
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="">
              Wybierz kategorię
            </option>

            {categoryOrder.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {categoryLabels[cat]}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="expense-error">
          {error}
        </div>
      )}

      <div className="expenses-summary-grid">
        <div className="card">
          <span className="label">
            TOTAL
          </span>

          <strong>
            {total.toLocaleString(
              "pl-PL",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}{" "}
            PLN
          </strong>

          <p>
            {expenses.length} wydatków
          </p>
        </div>

        <div className="card">
          <span className="label">
            AVERAGE
          </span>

          <strong>
            {(
              expenses.length === 0
                ? 0
                : total /
                  expenses.length
            ).toLocaleString(
              "pl-PL",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}{" "}
            PLN
          </strong>

          <p>
            średni wydatek
          </p>
        </div>

        <div className="card">
          <span className="label">
            CATEGORIES
          </span>

          <strong>
            {categoryTotals.length}
          </strong>

          <p>
            aktywne kategorie
          </p>
        </div>
      </div>

      <div className="expenses-layout">

        <div className="card expense-breakdown">
          <span className="label">
            BREAKDOWN
          </span>

          <h2>
            Kategorie
          </h2>

          {categoryTotals.length === 0 ? (
            <p className="empty-state">
              Brak wydatków.
            </p>
          ) : (
            <div className="category-list">
              {categoryTotals.map(
                (item) => (
                  <div
                    className="category-row"
                    key={item.category}
                  >
                    <div className="category-info">
                      <span>
                        {item.label}
                      </span>

                      <small>
                        {item.percentage.toFixed(
                          0
                        )}
                        %
                      </small>
                    </div>

                    <div className="category-bar">
                      <div
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>

                    <strong>
                      {item.amount.toLocaleString(
                        "pl-PL",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}{" "}
                      PLN
                    </strong>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div className="card expense-history">
          <span className="label">
            HISTORY
          </span>

          <h2>
            Ostatnie wydatki
          </h2>

          {loading ? (
            <p className="empty-state">
              Ładowanie...
            </p>
          ) : expenses.length === 0 ? (
            <p className="empty-state">
              Brak wydatków.
            </p>
          ) : (
            <div className="expense-list">
              {expenses.map(
                (expense) => (
                  <div
                    className="expense-row"
                    key={expense.id}
                  >
                    <div className="expense-main">
                      <strong>
                        {expense.description ||
                          categoryLabels[
                            expense.category
                          ] ||
                          expense.category}
                      </strong>

                      <small>
                        {new Date(
                          expense.date
                        ).toLocaleDateString(
                          "pl-PL"
                        )}
                      </small>
                    </div>

                    <span className="expense-category">
                      {categoryLabels[
                        expense.category
                      ] ||
                        expense.category}
                    </span>

                    <strong className="expense-amount">
                      -
                      {expense.amount.toLocaleString(
                        "pl-PL",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}{" "}
                      PLN
                    </strong>

                    <button
                      className="expense-delete"
                      onClick={() =>
                        handleDelete(
                          expense.id
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default Expenses;