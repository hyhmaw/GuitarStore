
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
// import Catalog from "./pages/Catalog";
// import LimitedCatalog from "./pages/LimitedCatalog";
// import Product from "./pages/Product";
// import Account from "./pages/Account";
// import Registration from "./pages/Registration";
// import Reviews from "./pages/Reviews";
// import Order from "./pages/Order";
 import NotFound from "./pages/NotFound";

import "./App.css";

export default function App() {
  const location = useLocation();

  const transparentHeaderPages = ["/", "/about"];
  const transparentHeader = transparentHeaderPages.includes(
    location.pathname
  );

  return (
    <div className="app">
      <Header transparent={transparentHeader} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        {/* <Route path="/catalog" element={<Catalog />} />
        <Route path="/limited" element={<LimitedCatalog />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/PersonalCabinet" element={<Account />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/order" element={<Order />} /> */
        <Route path="*" element={<NotFound />} />}
      </Routes>

      <Footer />
    </div>
  );
}
