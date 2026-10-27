
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
// import About from "./pages/About";
// import Catalog from "./pages/Catalog";
// import Contacts from "./pages/Contacts";


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/contacts" element={<Contacts />} /> */}
      </Route>
    </Routes>
  );
}