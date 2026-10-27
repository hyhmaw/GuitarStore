import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";

import Home from "../pages/Home";
// import Catalog from "../pages/Catalog";
// import Limited from "../pages/Limited";
// import Product from "../pages/Product";
// import About from "../pages/About";
// import Contacts from "../pages/Contacts";
// import PersonalCabinet from "../pages/PersonalCabinet";
// import RegistrationPage from "../pages/RegistrationPage";
// import Reviews from "../pages/Reviews";
// import CheckOut from "../pages/CheckOut";
// import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/limited"element={<Limited />}/>
          <Route path="/product/:id" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/account" element={<PersonalCabinet />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/checkout" element={<CheckOut />} /> */}
        </Route>

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}