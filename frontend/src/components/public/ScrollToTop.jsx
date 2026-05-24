/**
 * @file ScrollToTop.jsx
 * @description Componente utilitario que restablece la posición del scroll vertical a cero al cambiar de ruta/página.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop - Utilidad de navegación para React Router.
 * @component
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}