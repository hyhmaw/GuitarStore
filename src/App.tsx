
import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PageMeta from "./components/PageMeta";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";
import Catalog from "./pages/Catalog";
import LimitedCatalog from "./pages/LimitedCatalog";
import Product from "./pages/Product";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Checkout from "./pages/CheckOut";
import Reviews from "./pages/Reviews";

import { getCurrentUser } from "./utils/auth";

import "./App.css";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function GuestRoute({ children }: { children: ReactNode }) {
  const user = getCurrentUser();

  if (user) {
    return <Navigate to="/account" replace />;
  }

  return children;
}

function AccountPlaceholder() {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main className="account-page">
      <h1>MY ACCOUNT</h1>
      <p>Welcome, {user.name}</p>
      <p>{user.email}</p>
    </main>
  );
}

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
        {/* MAIN PAGES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/limited" element={<LimitedCatalog />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* AUTHENTICATION */}
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Auth />
            </GuestRoute>
          }
        />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Auth />
            </GuestRoute>
          }
        />

        {/* ACCOUNT */}
       <Route
  path="/account"
  element={
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  }
/>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}
