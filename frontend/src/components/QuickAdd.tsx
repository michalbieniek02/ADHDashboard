import { useState } from "react";

type QuickAddProps = {
  onClose: () => void;
  onAddTask: (
    title: string,
    type: "daily" | "general"
  ) => Promise<void>;
  onAddExpense: (expense: {
    amount: number;
    date: string;
    category: string;
    description?: string;
  }) => Promise<void>;
};

function QuickAdd({
  onClose,
  onAddTask,
  onAddExpense,
}: QuickAddProps) {
  const [selected, setSelected] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskType, setTaskType] =
    useState<"daily" | "general">("daily");

  const [expenseAmount, setExpenseAmount] =
    useState("");
  const [expenseCategory, setExpenseCategory] =
    useState("");
  const [expenseDescription, setExpenseDescription] =
    useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [saving, setSaving] = useState(false);

  const options = [
    ["✓", "Task"],
    ["💸", "Expense"],
    ["🍗", "Meal"],
    ["🛒", "Shopping"],
    ["🚗", "Car"],
    ["📅", "Meeting"],
    ["📁", "File"],
    ["📝", "Note"],
  ];

  const handleSaveTask = async () => {
    if (!taskTitle.trim() || saving) {
      return;
    }

    setSaving(true);

    try {
      await onAddTask(
        taskTitle.trim(),
        taskType
      );

      onClose();
    } catch (error) {
      console.error(
        "Błąd zapisywania taska:",
        error
      );
      setSaving(false);
    }
  };

  const handleSaveExpense = async () => {
    const amount = Number(expenseAmount);

    if (
      !amount ||
      amount <= 0 ||
      !expenseCategory.trim() ||
      saving
    ) {
      return;
    }

    setSaving(true);

    try {
      await onAddExpense({
        amount,
        date: expenseDate,
        category: expenseCategory.trim(),
        description:
          expenseDescription.trim() ||
          undefined,
      });

      onClose();
    } catch (error) {
      console.error(
        "Błąd zapisywania wydatku:",
        error
      );
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        if (!saving) {
          onClose();
        }
      }}
    >
      <div
        className="quick-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-header">
          <div>
            <span className="modal-label">
              QUICK ADD
            </span>

            <h2>
              {selected === "Task"
                ? "Add a task"
                : selected === "Expense"
                ? "Add an expense"
                : "What do you want to add?"}
            </h2>
          </div>

          <button
            className="close-button"
            onClick={onClose}
            disabled={saving}
          >
            ×
          </button>
        </div>

        {!selected && (
          <div className="quick-options">
            {options.map(([icon, name]) => (
              <button
                key={name}
                className="quick-option"
                onClick={() =>
                  setSelected(name)
                }
              >
                <span>{icon}</span>
                {name}
              </button>
            ))}
          </div>
        )}

        {selected === "Task" && (
          <div>
            <input
              autoFocus
              className="task-input"
              type="text"
              placeholder="What needs to be done?"
              value={taskTitle}
              disabled={saving}
              onChange={(e) =>
                setTaskTitle(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !saving
                ) {
                  handleSaveTask();
                }
              }}
            />

            <div className="task-type">
              <span className="section-label">
                TYPE
              </span>

              <div className="task-type-buttons">
                <button
                  className={
                    taskType === "daily"
                      ? "selected"
                      : ""
                  }
                  disabled={saving}
                  onClick={() =>
                    setTaskType("daily")
                  }
                >
                  DAILY
                </button>

                <button
                  className={
                    taskType === "general"
                      ? "selected"
                      : ""
                  }
                  disabled={saving}
                  onClick={() =>
                    setTaskType("general")
                  }
                >
                  GENERAL
                </button>
              </div>
            </div>

            <div className="task-actions">
              <button
                className="back-button"
                disabled={saving}
                onClick={() =>
                  setSelected("")
                }
              >
                ← Back
              </button>

              <button
                className="continue-button"
                disabled={saving}
                onClick={handleSaveTask}
              >
                {saving
                  ? "Saving..."
                  : "Add task"}
              </button>
            </div>
          </div>
        )}

        {selected === "Expense" && (
          <div>
            <input
              autoFocus
              className="finance-input"
              type="number"
              placeholder="Kwota, np. 45.50"
              value={expenseAmount}
              disabled={saving}
              onChange={(e) =>
                setExpenseAmount(
                  e.target.value
                )
              }
            />

            <input
              className="finance-input"
              type="text"
              placeholder="Kategoria, np. food"
              value={expenseCategory}
              disabled={saving}
              onChange={(e) =>
                setExpenseCategory(
                  e.target.value
                )
              }
            />

            <input
              className="finance-input"
              type="text"
              placeholder="Opis (opcjonalnie)"
              value={expenseDescription}
              disabled={saving}
              onChange={(e) =>
                setExpenseDescription(
                  e.target.value
                )
              }
            />

            <input
              className="finance-input"
              type="date"
              value={expenseDate}
              disabled={saving}
              onChange={(e) =>
                setExpenseDate(
                  e.target.value
                )
              }
            />

            <div className="task-actions">
              <button
                className="back-button"
                disabled={saving}
                onClick={() =>
                  setSelected("")
                }
              >
                ← Back
              </button>

              <button
                className="continue-button"
                disabled={saving}
                onClick={
                  handleSaveExpense
                }
              >
                {saving
                  ? "Saving..."
                  : "Add expense"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuickAdd;