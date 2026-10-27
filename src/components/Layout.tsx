
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();

  const transparentHeader =
    pathname === "/" || pathname === "/about";

  return (
    <div className="app">
      <Header transparent={transparentHeader} />
      <Outlet />
      <Footer />
    </div>
  );
}