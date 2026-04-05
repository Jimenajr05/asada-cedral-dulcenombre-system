import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <Link to="/" className="block">
            <h1 className="text-lg font-bold leading-none text-slate-900 sm:text-xl lg:text-2xl">
              ASADA
            </h1>
            <p className="-mt-0.5 text-[11px] text-slate-500 sm:text-xs lg:text-sm">
              Comunidad
            </p>
          </Link>
        </div>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-slate-600 xl:text-base">
            <li><Link to="/" className="hover:text-blue-600">Inicio</Link></li>
            <li><Link to="/sobre-nosotros" className="hover:text-blue-600">Sobre Nosotros</Link></li>
            <li><Link to="/gestion-agua" className="hover:text-blue-600">Gestión del Agua</Link></li>
            <li><Link to="/sostenibilidad" className="hover:text-blue-600">Sostenibilidad</Link></li>
            <li><Link to="/tramites" className="hover:text-blue-600">Trámites</Link></li>
            <li><Link to="/avisos" className="hover:text-blue-600">Avisos</Link></li>
            <li><Link to="/contacto" className="hover:text-blue-600">Contacto</Link></li>
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Link
            to="/contacto"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </header>
  );
}