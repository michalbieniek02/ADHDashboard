import Clock from "./Clock";

type TopbarProps = {
  onQuickAdd: () => void;
  onLogout: () => void;
};

function Topbar({
  onQuickAdd,
  onLogout,
}: TopbarProps) {
  const hour = new Date().getHours();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const name =
  user.name?.split(" ")[0] || "User";

  const greeting =
    hour < 12
      ? `GOOD MORNING ${name.toUpperCase()}`
      : hour < 18
      ? `GOOD AFTERNOON ${name.toUpperCase()}`
      : `GOOD EVENING ${name.toUpperCase()}`;

  return (
    <header className="topbar">
      <div>
        <p className="greeting">
          {greeting}
        </p>

        <div className="clocks">
          <Clock
            label="WARSAW "
            timeZone="Europe/Warsaw"
          />

          <Clock
            label="NEW YORK "
            timeZone="America/New_York"
          />
        </div>
      </div>

      <div className="top-actions">
        <div className="search">
          ⌕ Szukaj...
        </div>

        <button
          className="quick-add"
          onClick={onQuickAdd}
        >
          + Quick add
        </button>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Wyloguj
        </button>
      </div>
    </header>
  );
}

export default Topbar;