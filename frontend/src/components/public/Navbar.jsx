import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/logo.jpeg";

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

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <NavLink to="/" className="shrink-0">
          <img
            src={logo}
            alt="ASADA Cedral y Dulce Nombre"
            className="h-16 w-auto max-w-[180px] object-contain"
          />
        </NavLink>

        {/* Links desktop */}
        <nav className="hidden lg:flex items-center gap-0 text-[0.92rem] font-medium">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-2.5 py-2 rounded-lg transition whitespace-nowrap ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-slate-600 hover:text-primary"
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
            className="hidden sm:inline-flex btn btn-primary btn-sm sm:btn-md"
          >
            Contáctanos
          </NavLink>

          {/* Hamburguesa mobile */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="lg:hidden flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d={menuAbierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Menú mobile */}
      {menuAbierto && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-md">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMenuAbierto(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-primary font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
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
                className="block w-full rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
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