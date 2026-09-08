export type Income = {
  id: number;
  type: "salary" | "grind";
  amount: number;
  date: string;
  source?: string;
  description?: string;
};

export type Expense = {
  id: number;
  amount: number;
  date: string;
  category: string;
  description?: string;
};

export type Task = {
  id: number;
  title: string;
  done: boolean;
  type: "daily" | "general";
};