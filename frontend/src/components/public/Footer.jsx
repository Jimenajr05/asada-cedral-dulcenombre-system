import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      {/* Glow decorativo */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-sky-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-10 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Columna 1: Identidad */}
          <div>
            <h3 className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
              ASADA Cedral y Dulce Nombre
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-400 max-w-xs">
              Comprometidos con la gestión responsable del agua y el bienestar sostenible de nuestra comunidad.
            </p>
          </div>

          {/* Columna 2: Contacto */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">Contacto</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-base border border-slate-700">📞</span>
                <span className="leading-relaxed">2460-9775</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-base border border-slate-700">✉️</span>
                <span className="leading-relaxed">acedraldn@ice.co.cr</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-base border border-slate-700">🕐</span>
                <span className="leading-relaxed">Lunes a Viernes<br />1:00 pm – 5:00 pm</span>
              </li>
            </ul>
          </div>

          {/* Columnas 3 y 4: Navegación dividida */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">Navegación</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/", label: "Inicio" },
                { to: "/sobre-nosotros", label: "Sobre Nosotros" },
                { to: "/gestion-agua", label: "Gestión del Agua" },
                { to: "/sostenibilidad", label: "Sostenibilidad" },
                { to: "/tramites", label: "Trámites" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="flex items-center gap-2 text-slate-400 transition-colors duration-200 hover:text-sky-400 group">
                    <span className="h-1 w-1 rounded-full bg-slate-600 transition-colors group-hover:bg-sky-400" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">&nbsp;</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: "/transparencia", label: "Transparencia" },
                { to: "/proyectos", label: "Proyectos" },
                { to: "/avisos", label: "Avisos" },
                { to: "/contacto", label: "Contacto" },
                { to: "/admin/login", label: "Panel Administrativo" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="flex items-center gap-2 text-slate-400 transition-colors duration-200 hover:text-sky-400 group">
                    <span className="h-1 w-1 rounded-full bg-slate-600 transition-colors group-hover:bg-sky-400" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separador */}
        <div className="mt-14 border-t border-slate-800 pt-8 flex items-center justify-center text-xs text-slate-500">
          <p>© {year} ASADA Cedral y Dulce Nombre. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}