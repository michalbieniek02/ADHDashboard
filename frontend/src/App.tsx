import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import QuickAdd from "./components/QuickAdd";
import Finance from "./components/Finance";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import { useTasks } from "./hooks/useTasks";
import { useFinance } from "./hooks/useFinance";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("jwt")
  );

  const [currentPage, setCurrentPage] =
    useState("dashboard");

  const [quickAddOpen, setQuickAddOpen] =
    useState(false);

 const {
  tasks,
  addTask,
  toggleTask,
  deleteTask,
} = useTasks(loggedIn);

  const {
    balance,
    expenses,
    incomes,
    loadExpenses,
    addExpense,
    addIncome,
  } = useFinance(loggedIn);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");

    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login />;
  }

  return (
    <div className="app">

      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="main">

        <Topbar
          onLogout={handleLogout}
          onQuickAdd={() =>
            setQuickAddOpen(true)
          }
        />

       {currentPage === "finance" ? (
  <Finance
    incomes={incomes}
    expenses={expenses}
    onAddIncome={addIncome}
    balance={balance}
    onLoadExpenses={loadExpenses}
  />
) : currentPage === "expenses" ? (
  <Expenses />
) : (
  <Dashboard
    tasks={tasks}
    balance={balance}
    toggleTask={toggleTask}
    deleteTask={deleteTask}
    incomes={incomes}
  />
)}

      </main>

      {quickAddOpen && (
        <QuickAdd
          onClose={() =>
            setQuickAddOpen(false)
          }
          onAddTask={addTask}
          onAddExpense={addExpense}
        />
      )}

    </div>
  );
}

export default App; 