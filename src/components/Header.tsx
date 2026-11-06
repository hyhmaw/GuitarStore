import logo from "../img/logo.png";
import { useState } from "react";
import { Menu, Moon, Sun, UserRound, X } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import SideMenu from "./MobileNav";
import whiteLogo from "../img/logo-white.png";

type HeaderProps = {
  transparent?: boolean;
};

export default function Header({ transparent = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    document.documentElement.dataset.theme = nextTheme ? "dark" : "light";
  };

  return (
    <header className={`header ${transparent ? "header-transparent" : "header-white"}`}>
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
    src={transparent ? whiteLogo : logo}
    alt="YŌJU Guitars Logo"
    className="header-logo-image"
  />
</Link>

      <div className="header-actions">
        <button
          className="header-theme-button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>

        <Link to="/PersonalCabinet" aria-label="Personal cabinet">
          <UserRound />
        </Link>
      </div>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
