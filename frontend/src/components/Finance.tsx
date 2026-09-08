import { useMemo, useState } from "react";
import AnimatedNumber from "./AnimatedNumber";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

 import type {
  Income,
  Expense,
} from "../types";

type FinanceProps = {
  incomes: Income[];
  expenses: Expense[];
  onAddIncome: (income: Omit<Income, "id">) => Promise<void>;
  balance: number;
  onLoadExpenses: (
    period: "month" | "previous" | "all",
    category?: string
  ) => Promise<void>;
};

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

function getCategoryLabel(category: string) {
  return (
    categoryLabels[category] ??
    category.charAt(0).toUpperCase() + category.slice(1)
  );
}

function formatMoney(value: number) {
  return value.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getMonthName(date: Date) {
  return date.toLocaleDateString("pl-PL", {
    month: "long",
    year: "numeric",
  });
}

function Finance({
  incomes,
  expenses,
  onAddIncome,
  balance,
  onLoadExpenses,
}: FinanceProps) {
  const [showForm, setShowForm] = useState(false);

  const [type, setType] =
    useState<"salary" | "grind">("salary");

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");

  const [expensePeriod, setExpensePeriod] =
    useState<"month" | "previous" | "all">("month");

  const [expenseCategory, setExpenseCategory] =
    useState("");

  const now = new Date();

 

  const previousMonthDate = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );


  const salaryIncomes = incomes.filter(
    (income) => income.type === "salary"
  );

  const grindIncomes = incomes.filter(
    (income) => income.type === "grind"
  );

  const totalSalary = salaryIncomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );

  const totalGrind = grindIncomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );

  const totalIncome = totalSalary + totalGrind;

  /*
   * WYDATKI
   */

  const filteredExpenses = expenses;

const filteredExpensesTotal =
  filteredExpenses.reduce(
    (sum, expense) =>
      sum + expense.amount,
    0
  );

  /*
   * KATEGORIE
   */

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};

    filteredExpenses.forEach((expense) => {
      map[expense.category] =
        (map[expense.category] ?? 0) +
        expense.amount;
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        percentage:
          filteredExpensesTotal > 0
            ? (amount / filteredExpensesTotal) * 100
            : 0,
      }));
  }, [
    filteredExpenses,
    filteredExpensesTotal,
  ]);

  /*
   * WYKRES
   */

  const expenseChartData =
    categoryBreakdown.map((item) => ({
      category: getCategoryLabel(
        item.category
      ),
      amount: item.amount,
    }));

  /*
   * PRZYCHODY - WYKRES
   */

  const monthlySalaryData =
    [...salaryIncomes]
  .sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  )
  .map((income) => ({
      month: income.date.slice(0, 7),
      amount: income.amount,
    }));

  const dailyGrindData =
    [...grindIncomes]
  .sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  )
  .map((income) => ({
      date: income.date.slice(5),
      amount: income.amount,
    }));

  /*
   * FORMULARZ PRZYCHODU
   */

  const handleAddIncome = () => {
    if (!amount || !date) return;

    const newIncome: Income = {
      id: Date.now(),
      type,
      amount: Number(amount),
      date,
      source:
        type === "grind"
          ? source
          : undefined,
      description,
    };

    onAddIncome(newIncome);

    setAmount("");
    setDate("");
    setSource("");
    setDescription("");
    setShowForm(false);
  };

  /*
   * TYTUŁ WYDATKÓW
   */

  const expenseTitle =
    expensePeriod === "month"
      ? `Wydatki — ${getMonthName(now)}`
      : expensePeriod === "previous"
      ? `Wydatki — ${getMonthName(
          previousMonthDate
        )}`
      : expenseCategory
      ? `Wydatki — ${getCategoryLabel(
          expenseCategory
        )}`
      : "Wydatki — All time";

  return (
    <section className="finance-page">

      {/* HEADER */}

      <div className="finance-header">
        <div>
          <span className="label">
            FINANCE
          </span>

          <h1>Finanse</h1>

          <p>
            Przychody, wydatki i historia
            pieniędzy
          </p>
        </div>

        <button
          className="quick-add"
          onClick={() =>
            setShowForm(true)
          }
        >
          + Dodaj przychód
        </button>
      </div>

      {/* PODSUMOWANIE */}

      <div className="finance-summary">

        <div className="finance-summary-card">
          <span className="label">
            AKTUALNIE POSIADAM
          </span>

          <strong>
            <AnimatedNumber
              value={balance}
              duration={1500}
            />{" "}
            PLN
          </strong>

          <p>
            Aktualny stan pieniędzy
          </p>
        </div>

        <div className="finance-summary-card">
          <span className="label">
            PRZYCHODY ALL TIME
          </span>

          <strong>
            <AnimatedNumber
              value={totalIncome}
              duration={2500}
            />{" "}
            PLN
          </strong>

          <div className="income-breakdown">
            <span>
              Wypłaty{" "}
              <b>
                {formatMoney(totalSalary)} PLN
              </b>
            </span>

            <span>
              Grind{" "}
              <b>
                {formatMoney(totalGrind)} PLN
              </b>
            </span>
          </div>
        </div>

      </div>

      {/* WYDATKI */}

      <div className="expense-section">

        <div className="expense-section-header">

          <div>
            <span className="label">
              EXPENSES
            </span>

            <h2>
              {expenseTitle}
            </h2>

            <p>
              Kontrola wydatków w wybranym
              okresie
            </p>
          </div>

          <div className="expense-filters">

            <select
              value={expensePeriod}
              onChange={async (e) => {
  const value =
    e.target.value as
      | "month"
      | "previous"
      | "all";

  setExpensePeriod(value);

  if (value !== "all") {
    setExpenseCategory("");
    await onLoadExpenses(value);
  } else {
    setExpenseCategory("");
    await onLoadExpenses("all");
  }
}}
            >
              <option value="month">
                Ten miesiąc
              </option>

              <option value="previous">
                Poprzedni miesiąc
              </option>

              <option value="all">
                All time
              </option>
            </select>

            {expensePeriod === "all" && (
              <select
                value={expenseCategory}
                onChange={async (e) => {
  const category =
    e.target.value;

  setExpenseCategory(category);

  if (category) {
    await onLoadExpenses(
      "all",
      category
    );
  }
}}
              >
                <option value="">
                  Wybierz kategorię
                </option>

                {categoryOrder.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {getCategoryLabel(
                        category
                      )}
                    </option>
                  )
                )}
              </select>
            )}

          </div>

        </div>

        {/* ALL TIME BEZ KATEGORII */}

        {expensePeriod === "all" &&
          !expenseCategory && (
            <div className="expense-empty-state">
              <span>ALL TIME</span>

              <h3>
                Wybierz kategorię
              </h3>

              <p>
                Wybierz kategorię powyżej,
                żeby zobaczyć jej pełną
                historię.
              </p>
            </div>
          )}

        {/* DANE */}

        {!(
          expensePeriod === "all" &&
          !expenseCategory
        ) && (
          <>
            <div className="expense-total-card">

              <div>
                <span className="label">
                  ŁĄCZNIE WYDANO
                </span>

                <strong>
                  <AnimatedNumber
                    value={
                      filteredExpensesTotal
                    }
                    duration={1200}
                  />{" "}
                  PLN
                </strong>
              </div>

              <div className="expense-count">
                <span>
                  TRANSAKCJE
                </span>

                <b>
                  {filteredExpenses.length}
                </b>
              </div>

            </div>

            {/* KATEGORIE */}

            {categoryBreakdown.length > 0 && (
              <div className="expense-breakdown">

                <div className="expense-breakdown-header">
                  <div>
                    <span className="label">
                      BREAKDOWN
                    </span>

                    <h3>
                      Wydatki według kategorii
                    </h3>
                  </div>
                </div>

                <div className="expense-category-list">

                  {categoryBreakdown.map(
                    (item) => (
                      <div
                        className="expense-category-row"
                        key={item.category}
                      >

                        <div className="expense-category-info">
                          <span>
                            {getCategoryLabel(
                              item.category
                            )}
                          </span>

                          <b>
                            {formatMoney(
                              item.amount
                            )}{" "}
                            PLN
                          </b>
                        </div>

                        <div className="expense-category-bar">
                          <div
                            style={{
                              width: `${item.percentage}%`,
                            }}
                          />
                        </div>

                        <span className="expense-category-percent">
                          {item.percentage.toFixed(
                            0
                          )}
                          %
                        </span>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* WYKRES */}

            {expenseChartData.length > 0 && (
              <div className="finance-chart-card expense-chart-card">

                <div className="chart-header">

                  <div>
                    <span className="label">
                      EXPENSES
                    </span>

                    <h2>
                      Wydatki według kategorii
                    </h2>
                  </div>

                </div>

                <div className="real-chart">

                  <ResponsiveContainer
                    width="100%"
                    height={280}
                  >
                    <BarChart
                      data={
                        expenseChartData
                      }
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#242426"
                      />

                      <XAxis
                        dataKey="category"
                        stroke="#66666d"
                        tick={{
                          fontSize: 11,
                        }}
                      />

                      <YAxis
                        stroke="#66666d"
                        tick={{
                          fontSize: 11,
                        }}
                      />

                      <Tooltip
                        contentStyle={{
                          background:
                            "#151517",
                          border:
                            "1px solid #29292c",
                          borderRadius:
                            "8px",
                          color: "#fff",
                        }}
                        formatter={(value) => [
                          `${Number(
                            value
                          ).toLocaleString(
                            "pl-PL"
                          )} PLN`,
                          "Wydatki",
                        ]}
                      />

                      <Bar
                        dataKey="amount"
                        fill="#dddddd"
                        radius={[
                          5,
                          5,
                          0,
                          0,
                        ]}
                      />
                    </BarChart>
                  </ResponsiveContainer>

                </div>

              </div>
            )}

            {/* LISTA */}

            <div className="expense-history">

              <div className="expense-history-header">

                <div>
                  <span className="label">
                    HISTORY
                  </span>

                  <h3>
                    Ostatnie wydatki
                  </h3>
                </div>

              </div>

              {filteredExpenses.length ===
              0 ? (
                <div className="expense-empty">
                  Brak wydatków w wybranym
                  okresie.
                </div>
              ) : (
                <div className="expense-list">

                  {filteredExpenses.map(
                    (expense) => (
                      <div
                        className="expense-item"
                        key={expense.id}
                      >

                        <div className="expense-item-main">

                          <div className="expense-item-icon">
                            {getCategoryLabel(
                              expense.category
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {expense.description ||
                                getCategoryLabel(
                                  expense.category
                                )}
                            </strong>

                            <span>
                              {getCategoryLabel(
                                expense.category
                              )}{" "}
                              ·{" "}
                              {formatDate(
                                expense.date
                              )}
                            </span>
                          </div>

                        </div>

                        <strong className="expense-item-amount">
                          -
                          {formatMoney(
                            expense.amount
                          )}{" "}
                          PLN
                        </strong>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

          </>
        )}

      </div>

      {/* HISTORIA WYPŁAT */}

      <div className="finance-charts">

        <div className="finance-chart-card">

          <div className="chart-header">

            <div>
              <span className="label">
                WYPŁATY Z PRACY
              </span>

              <h2>
                Historia wypłat
              </h2>
            </div>

            <span className="chart-period">
              MONTHLY
            </span>

          </div>

          <div className="real-chart">

            {monthlySalaryData.length ===
            0 ? (
              <p className="empty-history">
                Brak zapisanych wypłat.
              </p>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={260}
              >
                <BarChart
                  data={monthlySalaryData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#242426"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="#66666d"
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    stroke="#66666d"
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "#151517",
                      border:
                        "1px solid #29292c",
                      borderRadius:
                        "8px",
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      `${Number(
                        value
                      ).toLocaleString(
                        "pl-PL"
                      )} PLN`,
                      "Wypłata",
                    ]}
                  />

                  <Bar
                    dataKey="amount"
                    fill="#dddddd"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

          </div>
        </div>

        <div className="finance-chart-card">

          <div className="chart-header">

            <div>
              <span className="label">
                GRIND
              </span>

              <h2>
                Historia zarobków
              </h2>
            </div>

            <span className="chart-period">
              DAILY
            </span>

          </div>

          <div className="real-chart">

            {dailyGrindData.length ===
            0 ? (
              <p className="empty-history">
                Brak zapisanych zarobków.
              </p>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={260}
              >
                <BarChart
                  data={dailyGrindData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#242426"
                  />

                  <XAxis
                    dataKey="date"
                    stroke="#66666d"
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    stroke="#66666d"
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "#151517",
                      border:
                        "1px solid #29292c",
                      borderRadius:
                        "8px",
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      `${Number(
                        value
                      ).toLocaleString(
                        "pl-PL"
                      )} PLN`,
                      "Grind",
                    ]}
                  />

                  <Bar
                    dataKey="amount"
                    fill="#dddddd"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

          </div>
        </div>

      </div>

      {/* MODAL DODAWANIA PRZYCHODU */}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowForm(false)
          }
        >
          <div
            className="quick-modal income-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <span className="modal-label">
                  ADD INCOME
                </span>

                <h2>
                  Dodaj przychód
                </h2>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>

            <div className="income-type">

              <button
                className={
                  type === "salary"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setType("salary")
                }
              >
                💼 Wypłata
              </button>

              <button
                className={
                  type === "grind"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setType("grind")
                }
              >
                💸 Grind
              </button>

            </div>

            <label>
              Kwota
            </label>

            <input
              className="finance-input"
              type="number"
              placeholder="np. 6420"
              value={amount}
              onChange={(e) =>
                setAmount(
                  e.target.value
                )
              }
            />

            <label>
              Data
            </label>

            <input
              className="finance-input"
              type="date"
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
            />

            {type === "grind" && (
              <>
                <label>
                  Źródło
                </label>

                <input
                  className="finance-input"
                  type="text"
                  placeholder="np. sprzedaż, projekt..."
                  value={source}
                  onChange={(e) =>
                    setSource(
                      e.target.value
                    )
                  }
                />
              </>
            )}

            <label>
              Opis{" "}
              <span>
                (opcjonalnie)
              </span>
            </label>

            <input
              className="finance-input"
              type="text"
              placeholder="Opcjonalny opis"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

            <button
              className="continue-button"
              onClick={
                handleAddIncome
              }
            >
              Zapisz przychód
            </button>

          </div>
        </div>
      )}

    </section>
  );
}

export default Finance;