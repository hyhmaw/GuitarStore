import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PageMeta from "./components/PageMeta";

import Home from "./pages/Home";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import LimitedCatalog from "./pages/LimitedCatalog";
import Product from "./pages/Product";

import "./App.css";

export default function App() {
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const transparentHeaderPages = ["/", "/about"];
  const transparentHeader = transparentHeaderPages.includes(
    location.pathname
  );

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <PageMeta />

      <Header
        transparent={transparentHeader}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/limited" element={<LimitedCatalog />} />
        <Route path="/product/:id" element={<Product />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}