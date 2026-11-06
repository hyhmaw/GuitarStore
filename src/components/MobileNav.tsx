import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "../styles/MobileNav.css";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const pages = [
  { name: "HOME", path: "/" },
  { name: "CATALOG", path: "/catalog" },
  { name: "LIMITED", path: "/catalog#limited", mobilePath: "/limited" },
  { name: "ABOUT US", path: "/about" },
  { name: "CONTACTS", path: "/contacts" },
  { name: "ACCOUNT", path: "/PersonalCabinet" },
];

export default function SideMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();
const [isMobile, setIsMobile] = useState(
  window.matchMedia("(max-width: 700px)").matches
);

useEffect(() => {
  const mediaQuery = window.matchMedia("(max-width: 700px)");

  const handleChange = (e: MediaQueryListEvent) => {
    setIsMobile(e.matches);
  };

  mediaQuery.addEventListener("change", handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
}, []);
  return (
    <>
      <div
        className={`menu-overlay ${isOpen ? "menu-overlay-open" : ""}`}
        onClick={onClose}
      />

      <aside className={`mobile-menu ${isOpen ? "mobile-menu-open" : ""}`}>
        <button
          className="mobile-menu-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={54} strokeWidth={1.5} />
        </button>

        <nav className="mobile-menu-nav">
        {pages.map((page) => {
  const path =
    isMobile && page.mobilePath
      ? page.mobilePath
      : page.path;

  return (
    <Link
      key={page.name}
      to={path}
      onClick={onClose}
      className={
        location.pathname === path.split("#")[0]
          ? "mobile-menu-link active"
          : "mobile-menu-link"
      }
    >
      {page.name}
    </Link>
  );
})}
        </nav>
      </aside>
    </>
  );
}
