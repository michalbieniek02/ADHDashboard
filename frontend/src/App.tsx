import { useState } from "react";

type SidebarProps = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

function Sidebar({
  currentPage,
  setCurrentPage,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItem = (
    page: string,
    label: string
  ) => (
    <button
      className={`nav-item ${
        currentPage === page ? "active" : ""
      }`}
      onClick={() => {
        setCurrentPage(page);
        setMobileOpen(false); // zamknij po kliknięciu na mobile
      }}
    >
      {currentPage === page ? "◉" : "◌"} {label}
    </button>
  );

  return (
    <>
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
      >
        ☰
      </button>

      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
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
    </>
  );
}

export default Sidebar;
