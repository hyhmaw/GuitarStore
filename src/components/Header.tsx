import { useState } from "react";
import {
  Menu,
  ShoppingCart,
  Moon,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

type HeaderProps = {
  transparent?: boolean;
};

export default function Header({
  transparent = false,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`header ${
        transparent ? "header-transparent" : "header-white"
      } ${menuOpen ? "header-menu-open" : ""}`}
    >
      <button
        className="header-menu-button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      <nav
        className={`header-navigation ${
          menuOpen ? "header-navigation-open" : ""
        }`}
      >
        <Link to="/catalog" onClick={closeMenu}>
          CATALOG
        </Link>

        <Link to="/about" onClick={closeMenu}>
          ABOUT US
        </Link>

        <Link to="/contacts" onClick={closeMenu}>
          CONTACTS
        </Link>
      </nav>

      <div className="header-actions">
        <Link to="/cart" aria-label="Shopping cart">
          <ShoppingCart />
        </Link>

        <button
          aria-label="Toggle theme"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun /> : <Moon />}
        </button>

        <Link to="/account" aria-label="Account">
          <UserRound />
        </Link>
      </div>
    </header>
  );
}