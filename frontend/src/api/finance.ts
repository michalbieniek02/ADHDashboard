
import type {
  Income,
  Expense,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("jwt");
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getFinanceSummary() {
  const response = await fetch(
    `${API_URL}/finance/summary`,
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Nie udało się pobrać finansów"
    );
  }

  return response.json();
}

export async function getIncomes(): Promise<Income[]> {
  const response = await fetch(
    `${API_URL}/finance/incomes`,
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Nie udało się pobrać przychodów"
    );
  }

  return response.json();
}

export async function getExpenses(
  period: "month" | "previous" | "all" = "month",
  category?: string
): Promise<Expense[]> {
  const params = new URLSearchParams();

  params.set("period", period);

  if (category) {
    params.set("category", category);
  }

  const response = await fetch(
    `${API_URL}/finance/expenses?${params.toString()}`,
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Nie udało się pobrać wydatków"
    );
  }

  return response.json();
}

export async function createIncome(
  income: Omit<Income, "id">
): Promise<Income> {
  const response = await fetch(
    `${API_URL}/finance/incomes`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: income.amount,
        type: income.type,
        source: income.source,
        description: income.description,
        date: income.date,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Nie udało się dodać przychodu"
    );
  }

  return response.json();
}

export async function createExpense(
  expense: Omit<Expense, "id">
): Promise<Expense> {
  const response = await fetch(
    `${API_URL}/finance/expenses`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Nie udało się dodać wydatku"
    );
  }

  return response.json();
}

export async function deleteIncome(
  id: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/finance/incomes/${id}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Nie udało się usunąć przychodu"
    );
  }
}

export async function deleteExpense(
  id: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/finance/expenses/${id}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Nie udało się usunąć wydatku"
    );
  }
}
