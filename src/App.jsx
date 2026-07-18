import React from "react";
import Storefront from "./Storefront.jsx";
import Admin from "./Admin.jsx";

export default function App() {
  const path = window.location.pathname;
  if (path.startsWith("/admin")) {
    return <Admin />;
  }
  return <Storefront />;
}
