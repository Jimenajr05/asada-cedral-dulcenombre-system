import {
  heroContent,
  mision,
  vision,
  valores,
  historia,
  juntaDirectiva,
  cobertura,
} from "./AboutData";

/* ─── Íconos SVG ─────────────────────────────────────────── */
const IconTarget = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconEye = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconStar = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconUsers = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-4 h-4"
    aria-hidden="true"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/* ─── Badge por cargo ───────────────────────────────────── */
const cargoBadgeClass = {
  Presidente: "bg-blue-100 text-blue-800",
  Vicepresidenta: "bg-blue-100 text-blue-800",
  Tesorero: "bg-emerald-100 text-emerald-800",
  Secretario: "bg-violet-100 text-violet-800",
  Fiscal: "bg-amber-100 text-amber-800",
};

const badgeDefault = "bg-slate-100 text-slate-700";

/* ─── Fondo decorativo animado ─────────────────────────── */
const WaterDropBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-white/6 animate-floatSlow" />
    <div className="absolute left-1/3 top-12 h-72 w-72 rounded-full bg-white/6 animate-floatMedium" />
    <div className="absolute right-[-80px] top-[-30px] h-[24rem] w-[24rem] rounded-full bg-white/6 animate-floatSlow" />
  </div>
);

/* ─── Etiqueta de sección ───────────────────────────────── */
const SectionLabel = ({ children, light = false }) => (
  <span
    className={`inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full ${
      light ? "bg-white/15 text-blue-100" : "bg-blue-50 text-blue-600"
    }`}
  >
    {children}
  </span>
);

/* ════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700"
        aria-label="Encabezado Sobre Nosotros"
      >
        <WaterDropBg />

        {/* ola */}
        <div className="absolute bottom-0 left-0 right-0 leading-none" aria-hidden="true">
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="block w-full h-20"
          >
            <path
              d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z"
              fill="#f8fafc"
            />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 text-blue-300 text-xs mb-8"
          >
            <span>Inicio</span>
            <span aria-hidden="true">›</span>
            <span className="text-white font-medium" aria-current="page">
              Sobre Nosotros
            </span>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
            {heroContent.title}
          </h1>

          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            {heroContent.subtitle}
          </p>
        </div>
      </section>

      {/* MISIÓN / VISIÓN / VALORES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <SectionLabel>Identidad institucional</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3">
            Quiénes somos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <IconTarget />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-2">
                {mision.label}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {mision.text}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <IconEye />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-2">
                {vision.label}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {vision.text}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-7 flex flex-col gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center flex-shrink-0">
              <IconStar />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 mb-3">
                Valores
              </h3>
              <ul className="flex flex-col gap-3">
                {valores.map((v) => (
                  <li key={v.nombre}>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      {v.nombre}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {v.descripcion}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionLabel>Nuestra trayectoria</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3">
              Reseña Histórica
            </h2>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-100 p-8 sm:p-10 flex flex-col gap-8">
            {historia.map((bloque, index) => (
              <div key={bloque.id}>
                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                  {bloque.titulo}
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {bloque.texto}
                </p>

                {index < historia.length - 1 && (
                  <hr className="mt-8 border-slate-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JUNTA DIRECTIVA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <SectionLabel>Gobierno institucional</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3">
            Junta Directiva
          </h2>
          <div className="inline-flex items-center gap-1.5 mt-3 bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            <IconUsers />
            <span>Período {juntaDirectiva.periodo}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {juntaDirectiva.miembros.map((m, i) => {
            const iniciales = m.nombre
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("");

            return (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center gap-3 min-h-[190px]"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-base font-bold flex-shrink-0">
                  {iniciales}
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800 leading-tight">
                    {m.nombre}
                  </p>
                  <span
                    className={`inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      cargoBadgeClass[m.cargo] ?? badgeDefault
                    }`}
                  >
                    {m.cargo}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COBERTURA Y ALCANCE */}
      <section
        className="bg-slate-100 py-16 lg:py-20"
        aria-label="Cobertura y Alcance"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel>En números</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3 mb-10">
            Cobertura y Alcance
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cobertura.map((c, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm"
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-blue-700 leading-none">
                  {c.valor}
                </p>
                <p className="text-slate-600 text-sm mt-2">{c.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}