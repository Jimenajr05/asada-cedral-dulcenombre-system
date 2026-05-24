/**
 * @file Footer.jsx
 * @description Pie de página (Footer) para la sección pública del sitio web, incluyendo información de contacto, enlaces rápidos y copyright.
 */

import { Link } from "react-router-dom";

/**
 * Footer - Pie de página del portal público.
 * @component
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-8 sm:pt-16 sm:pb-10 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">

          {/* Columna 1: Identidad */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
              ASADA Cedral y Dulce Nombre
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400 max-w-sm">
              Comprometidos con la gestión responsable del agua y el bienestar sostenible de nuestra comunidad.
            </p>
          </div>

          {/* Columna 2: Contacto */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4 sm:mb-5">Contacto</h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm border border-slate-850">📞</span>
                <span className="leading-relaxed">2460-9775</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm border border-slate-855">✉️</span>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=acedraldn@ice.co.cr"
                  target="_blank"
                  rel="noreferrer"
                  className="leading-relaxed break-all text-slate-300 hover:text-sky-400 transition-colors duration-200"
                >
                  acedraldn@ice.co.cr
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm border border-slate-860">🕐</span>
                <span className="leading-relaxed">Lunes a Viernes<br />1:00 pm – 5:00 pm</span>
              </li>
            </ul>
          </div>

          {/* Columnas 3 y 4: Navegación */}
          <div className="col-span-2 lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4 sm:mb-5">Navegación</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              {[
                { to: "/", label: "Inicio" },
                { to: "/transparencia", label: "Transparencia" },
                { to: "/sobre-nosotros", label: "Sobre Nosotros" },
                { to: "/proyectos", label: "Proyectos" },
                { to: "/gestion-agua", label: "Gestión del Agua" },
                { to: "/avisos", label: "Avisos" },
                { to: "/sostenibilidad", label: "Sostenibilidad" },
                { to: "/contacto", label: "Contacto" },
                { to: "/tramites", label: "Trámites" },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="flex items-center gap-2 text-slate-400 transition-colors duration-200 hover:text-sky-400 group">
                  <span className="h-1 w-1 rounded-full bg-slate-600 transition-colors group-hover:bg-sky-400" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Separador */}
        <div className="mt-10 border-t border-slate-800 pt-6 flex items-center justify-center text-center text-xs text-slate-500 sm:mt-14 sm:pt-8">
          <p>© {year} ASADA Cedral y Dulce Nombre. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}