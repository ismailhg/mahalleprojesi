import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

const Header = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo">🌐 Mahallem</div>
        <div className="menu-toggle" onClick={toggleMenu}>
          ☰
        </div>
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {userId ? (
            <>
              <Link to="/MahallemPage" className="nav-button" onClick={toggleMenu}>
                Mahallem
              </Link>
              <Link to="/profile" className="nav-button" onClick={toggleMenu}>
                Profil
              </Link>
              <button onClick={handleLogout} className="nav-button logout-btn">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button" onClick={toggleMenu}>
                Giriş Yap
              </Link>
              <Link to="/register" className="nav-button" onClick={toggleMenu}>
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
