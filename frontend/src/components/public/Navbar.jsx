/**
 * @file Navbar.jsx
 * @description Barra de navegación superior (Header) para el portal público de la ASADA, con soporte responsivo y efecto glassmorphism al hacer scroll.
 */

import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";

/**
 * Enlaces de navegación rápida en el portal público.
 */
const links = [
  { to: "/", label: "Inicio" },
  { to: "/sobre-nosotros", label: "Sobre Nosotros" },
  { to: "/gestion-agua", label: "Gestión del Agua" },
  { to: "/sostenibilidad", label: "Sostenibilidad" },
  { to: "/tramites", label: "Trámites" },
  { to: "/transparencia", label: "Transparencia" },
  { to: "/proyectos", label: "Proyectos" },
  { to: "/avisos", label: "Avisos" },
  { to: "/contacto", label: "Contacto" },
];

/**
 * Navbar - Cabecera principal pública con soporte móvil interactivo.
 * @component
 */
export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "glass shadow-md shadow-slate-900/5"
        : "bg-white border-b border-slate-100"
        }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <NavLink to="/" className="shrink-0 flex items-center gap-3">
          <img
            src={logo}
            alt="ASADA Cedral y Dulce Nombre"
            className="h-12 w-auto object-contain"
          />
        </NavLink>

        {/* Links desktop */}
        <nav className="hidden lg:flex items-center gap-0.5 text-sm font-medium">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl transition-all duration-200 whitespace-nowrap ${isActive
                  ? "text-sky-600 font-semibold bg-sky-50"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Derecha */}
        <div className="flex items-center gap-3">
          <NavLink
            to="/contacto"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition-all hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Contáctanos
          </NavLink>

          {/* Hamburguesa mobile */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Menú"
            className="lg:hidden flex items-center justify-center rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  menuAbierto
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {menuAbierto && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-3 shadow-xl">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMenuAbierto(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive
                      ? "bg-sky-50 text-sky-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            <li className="mt-2 pt-2 border-t border-slate-100">
              <NavLink
                to="/contacto"
                onClick={() => setMenuAbierto(false)}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-md"
              >
                Contáctanos
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}