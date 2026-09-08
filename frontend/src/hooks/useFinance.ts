import { useEffect, useState } from "react";

import {
  getFinanceSummary,
  getIncomes,
  getExpenses,
  createIncome,
  createExpense,
} from "../api/finance";

import type {
  Income,
  Expense,
} from "../types";

export function useFinance(loggedIn: boolean) {
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] =
    useState<Expense[]>([]);
  const [incomes, setIncomes] =
    useState<Income[]>([]);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }

    const loadFinance = async () => {
      try {
        const [
          incomesData,
          expensesData,
          financeSummary,
        ] = await Promise.all([
          getIncomes(),
          getExpenses("month"),
          getFinanceSummary(),
        ]);

        setIncomes(incomesData);
        setExpenses(expensesData);
        setBalance(financeSummary.balance);
      } catch (error) {
        console.error(
          "Błąd ładowania finansów:",
          error
        );
      }
    };

    loadFinance();
  }, [loggedIn]);

  const loadExpenses = async (
    period: "month" | "previous" | "all",
    category?: string
  ) => {
    const data = await getExpenses(
      period,
      category
    );

    setExpenses(data);
  };

  const addExpense = async (
    expense: Omit<Expense, "id">
  ) => {
    const newExpense =
      await createExpense(expense);

    setExpenses((current) => [
      ...current,
      newExpense,
    ]);

    const summary =
      await getFinanceSummary();

    setBalance(summary.balance);
  };

  const addIncome = async (
    income: Omit<Income, "id">
  ) => {
    const newIncome =
      await createIncome(income);

    setIncomes((current) => [
      ...current,
      newIncome,
    ]);

    const summary =
      await getFinanceSummary();

    setBalance(summary.balance);
  };

  return {
    balance,
    expenses,
    incomes,
    loadExpenses,
    addExpense,
    addIncome,
  };
}