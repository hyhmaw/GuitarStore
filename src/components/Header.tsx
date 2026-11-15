import logo from "../img/logo.png";
import whiteLogo from "../img/logo-white.png";

import { Menu, Moon, Sun, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/Header.css";
import SideMenu from "./MobileNav";

type HeaderProps = {
  transparent?: boolean;
  darkMode: boolean;
  onToggleTheme: () => void;
};

export default function Header({
  transparent = false,
  darkMode,
  onToggleTheme,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`header ${
        transparent ? "header-transparent" : "header-white"
      }`}
    >
      <button
        className="header-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      <Link to="/" className="header-logo" aria-label="YŌJU Guitars home">
        <img
          src={transparent || darkMode ? whiteLogo : logo}
          alt="YŌJU Guitars Logo"
          className="header-logo-image"
        />
      </Link>

      <div className="header-actions">
        <button
          className="header-theme-button"
          onClick={onToggleTheme}
          aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>

        <Link to="/PersonalCabinet" aria-label="Personal cabinet">
          <UserRound />
        </Link>
      </div>

      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
}