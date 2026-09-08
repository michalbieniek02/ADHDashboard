
import type { Task, Income } from "../types";
type DashboardProps = {
  tasks: Task[];
  balance: number;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  incomes: Income[];
};

function Dashboard({
  tasks,
  balance,
  toggleTask,
  deleteTask,
  incomes,
}: DashboardProps) {
  const dailyTasks = tasks.filter(
    (task) => task.type === "daily"
  );

  const generalTasks = tasks.filter(
    (task) => task.type === "general"
  );

  const completedDaily = dailyTasks.filter(
    (task) => task.done
  ).length;

  const completedGeneral = generalTasks.filter(
    (task) => task.done
  ).length;

  const dailyProgress =
    dailyTasks.length === 0
      ? 0
      : (completedDaily / dailyTasks.length) * 100;

  const generalProgress =
    generalTasks.length === 0
      ? 0
      : (completedGeneral / generalTasks.length) * 100;

      const lastIncome = incomes[0];
  return (
    <section className="content">
      <h1>Today</h1>

      <div className="grid">

        {/* TASKS SUMMARY */}
        <div className="card tasks-progress">
          <span className="label">TASKS</span>

          <strong>
            {completedDaily + completedGeneral} /{" "}
            {tasks.length}
          </strong>

          <div className="progress">
            <div
              style={{
                width: `${
                  tasks.length === 0
                    ? 0
                    : ((completedDaily +
                        completedGeneral) /
                        tasks.length) *
                      100
                }%`,
              }}
            />
          </div>

          <p>tasks completed</p>
        </div>

        {/* NEXT */}
        <div className="card">
          <span className="label">NEXT</span>

          <div className="event">
            14:30 <span>Gym</span>
          </div>

          <div className="event">
            18:00 <span>Meeting</span>
          </div>
        </div>

        {/* TODO */}
        <div className="card todo">
          <span className="label">TODO</span>

          <div className="task-sections">

            {/* DAILY */}
            <div className="task-section">
              <div className="task-section-header">
                <div>
                  <span className="section-label">
                    DAILY
                  </span>

                  <h2>Today</h2>
                </div>

                <span className="task-count">
                  {completedDaily}/{dailyTasks.length}
                </span>
              </div>

              <div className="task-progress">
                <div
                  className="task-progress-fill"
                  style={{
                    width: `${dailyProgress}%`,
                  }}
                />
              </div>

              <div className="task-list">
                {dailyTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`todo-item ${
                      task.done ? "done" : ""
                    }`}
                    onClick={() =>
                      toggleTask(task.id)
                    }
                    onDoubleClick={() =>
                      deleteTask(task.id)
                    }
                  >
                    <div
                      className={`todo-checkbox ${
                        task.done ? "checked" : ""
                      }`}
                    />

                    <span>{task.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GENERAL */}
            <div className="task-section">
              <div className="task-section-header">
                <div>
                  <span className="section-label">
                    TASKS
                  </span>

                  <h2>General</h2>
                </div>

                <span className="task-count">
                  {completedGeneral}/
                  {generalTasks.length}
                </span>
              </div>

              <div className="task-progress">
                <div
                  className="task-progress-fill"
                  style={{
                    width: `${generalProgress}%`,
                  }}
                />
              </div>

              <div className="task-list">
                {generalTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`todo-item ${
                      task.done ? "done" : ""
                    }`}
                    onClick={() =>
                      toggleTask(task.id)
                    }
                    onDoubleClick={() =>
                      deleteTask(task.id)
                    }
                  >
                    <div
                      className={`todo-checkbox ${
                        task.done ? "checked" : ""
                      }`}
                    />

                    <span>{task.title}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* FINANCE */}
        <div className="card finance">
          <span className="label">FINANCE</span>

          <p>Balance</p>

          <strong>
            {balance.toLocaleString("pl-PL")} PLN
          </strong>

          <small>
  ↑{" "}
  {lastIncome
    ? lastIncome.amount.toLocaleString("pl-PL")
    : "0"}{" "}
  PLN / last income
</small>
        </div>

        {/* HEALTH */}
        <div className="card health">
          <span className="label">HEALTH</span>

          <p>Today</p>

          <strong>2 340 kcal</strong>

          <div className="progress">
            <div style={{ width: "78%" }} />
          </div>

          <small>
            Protein&nbsp;&nbsp; 142 / 180g
          </small>
        </div>

        {/* CAR */}
        <div className="card car">
          <span className="label">CAR</span>

          <div className="car-row">
            <strong>BMW E46 330d</strong>

            <span className="status">
              ● OK
            </span>
          </div>

          <p>
            Next service: <b>12 400 km</b>
          </p>

          <p>
            Insurance: <b>42 days</b>
          </p>
        </div>

      </div>
    </section>
  );
}

export default Dashboard;