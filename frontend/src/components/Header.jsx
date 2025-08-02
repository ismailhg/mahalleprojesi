import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";
import logoImage from "./mahallelogo.png";

const Header = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container">
        <div className="logo">
          <Link to="/home" className="logo-link">
            <img src={logoImage} alt="Mahallem Logo" className="logo-image" />
          </Link>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          ☰
        </div>

        <nav ref={navRef} className={`nav-links ${menuOpen ? "open" : ""}`}>
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
