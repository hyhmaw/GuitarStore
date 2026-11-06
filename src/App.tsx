
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
// import Product from "./pages/Product";
// import Account from "./pages/Account";
// import Registration from "./pages/Registration";
// import Reviews from "./pages/Reviews";
// import Order from "./pages/Order";

import "./App.css";

export default function App() {
  const location = useLocation();

  const transparentHeaderPages = ["/", "/about"];
  const transparentHeader = transparentHeaderPages.includes(
    location.pathname
  );

  return (
    <div className="app">
      <PageMeta />

      <Header transparent={transparentHeader} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/limited" element={<LimitedCatalog />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}
