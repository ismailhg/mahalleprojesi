import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

const Header = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo">🌐 Mahallem</div>
        <nav className="nav-links">
          {userId ? (
            <>
              <Link to="/MahallemPage" className="nav-button">
                Mahallem
              </Link>
              <Link to="/profile" className="nav-button">
                Profil
              </Link>
              <button onClick={handleLogout} className="nav-button logout-btn">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button">
                Giriş Yap
              </Link>
              <Link to="/register" className="nav-button">
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
