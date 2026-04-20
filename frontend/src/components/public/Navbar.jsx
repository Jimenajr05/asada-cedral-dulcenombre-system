import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/sobre-nosotros", label: "Sobre Nosotros" },
  { to: "/gestion-agua", label: "Gestión del Agua" },
  { to: "/sostenibilidad", label: "Sostenibilidad" },
  { to: "/tramites", label: "Trámites" },
  { to: "/transparencia", label: "Transparencia" },
  { to: "/avisos", label: "Avisos" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-primary font-semibold"
      : "text-slate-600 hover:text-primary transition";

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-64 rounded-box border border-slate-200 bg-white p-2 shadow-lg"
            >
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={linkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <NavLink to="/" className="ml-2 sm:ml-3 lg:ml-0">
            <h1 className="text-lg font-bold leading-none text-slate-900 sm:text-xl lg:text-2xl">
              ASADA
            </h1>
            <p className="-mt-0.5 text-[11px] text-slate-500 sm:text-xs lg:text-sm">
              Comunidad
            </p>
          </NavLink>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1 text-sm font-medium xl:text-base">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end">
          <NavLink to="/contacto" className="btn btn-primary btn-sm sm:btn-md">
            Contáctanos
          </NavLink>
        </div>
      </div>
    </div>
  );
}