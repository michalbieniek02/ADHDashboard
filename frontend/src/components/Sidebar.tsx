type SidebarProps = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

function Sidebar({
  currentPage,
  setCurrentPage,
}: SidebarProps) {
  const navItem = (
    page: string,
    label: string
  ) => (
    <button
      className={`nav-item ${
        currentPage === page ? "active" : ""
      }`}
      onClick={() => setCurrentPage(page)}
    >
      {currentPage === page ? "◉" : "◌"} {label}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="logo">ADHDashboard</div>

      <nav>
        <div className="nav-section">
          {navItem("dashboard", "Overview")}
        </div>

        <div className="nav-section">
          <span>LIFE</span>
          {navItem("finance", "Finanse")}
          {navItem("expenses", "Wydatki")}
          {navItem("car", "Samochód")}
        </div>

        <div className="nav-section">
          <span>HEALTH</span>
          {navItem("diet", "Dieta")}
          {navItem("training", "Ćwiczenia")}
        </div>

        <div className="nav-section">
          <span>ORGANIZE</span>
          {navItem("meetings", "Spotkania")}
          {navItem("shopping", "Zakupy")}
          {navItem("fridge", "Lodówka")}
          {navItem("files", "Pliki")}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
