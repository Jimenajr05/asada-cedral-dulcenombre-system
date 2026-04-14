import {
  hero,
  proceso,
  calidad,
  parametros,
  infraestructura,
  ahorro,
} from "./GestionAguaData";

/* ─── Íconos ─────────────────────────────────────────── */
const IconDrop = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
  </svg>
);

const IconFlask = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
  >
    <path d="M10 2v6l-5 8a3 3 0 0 0 2.54 4.5h8.92A3 3 0 0 0 19 16l-5-8V2" />
  </svg>
);

const IconGauge = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
  >
    <path d="M12 14l4-4" />
    <path d="M20 13a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
  </svg>
);

const IconShield = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
  >
    <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
  </svg>
);

const IconWave = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
  >
    <path d="M3 12c2 0 2-4 4-4s2 4 4 4 2-4 4-4 2 4 4 4 2-4 4-4" />
  </svg>
);

const IconLab = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
  >
    <path d="M10 2v6l-5 8a3 3 0 0 0 2.54 4.5h8.92A3 3 0 0 0 19 16l-5-8V2" />
  </svg>
);

/* ─── Fondo decorativo ───────────────────────────────── */
const WaterDropBg = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 800 400">
    <circle cx="660" cy="70" r="200" fill="white" />
    <circle cx="100" cy="330" r="130" fill="white" />
    <circle cx="390" cy="210" r="80" fill="white" />
  </svg>
);

const SectionLabel = ({ children }) => (
  <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700">
    {children}
  </span>
);

/* ─── Barra de parámetros ───────────────────────────── */
function ParameterBar({ name, value, width }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <p className="text-sm font-semibold text-slate-800">{name}</p>
        <p className="text-sm text-slate-500">{value}</p>
      </div>
      <div className="h-2 bg-slate-200 rounded-full">
        <div className="h-full bg-green-500 rounded-full" style={{ width }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════ */
export default function WaterPage() {
  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
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
          <div className="flex justify-center text-blue-300 text-xs mb-6 gap-2">
            <span>Inicio</span>
            <span>›</span>
            <span className="text-white font-medium">Gestión del Agua</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
            {hero.title}
          </h1>

          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* PROCESO */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <SectionLabel>Proceso</SectionLabel>
          <h2 className="text-3xl font-bold mt-3 text-slate-900">Proceso del Agua</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {proceso.map((p) => (
            <div
              key={p.titulo}
              className="bg-white p-6 rounded-xl shadow-sm text-center border border-slate-200"
            >
              <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <IconDrop />
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-2">{p.titulo}</h3>

              <p className="text-sm text-slate-600 leading-relaxed">{p.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALIDAD */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Control de Calidad</h2>
            {calidad.map((c) => (
              <div key={c.titulo} className="flex gap-4 mb-6">
                <div className="w-10 h-10 bg-blue-600 text-white rounded flex items-center justify-center shrink-0">
                  <IconShield />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{c.titulo}</h3>
                  <p className="text-sm text-slate-600">{c.descripcion}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-6">Parámetros de Calidad</h3>
            <div className="space-y-5">
              <ParameterBar name="pH" value="7.2" width="70%" />
              <ParameterBar name="Cloro" value="0.5" width="50%" />
              <ParameterBar name="Turbidez" value="0.8" width="20%" />
              <ParameterBar name="Bacteriológica" value="Apto" width="100%" />
            </div>
          </div>
        </div>
      </section>

      {/* INFRAESTRUCTURA */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900 mb-10">Infraestructura</h2>

        <div className="grid md:grid-cols-3 gap-5">
          {infraestructura.map((i) => (
            <div key={i.titulo} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">{i.titulo}</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                {i.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* AHORRO */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900 mb-10">
            Consejos para el Ahorro de Agua
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">En el Hogar</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {ahorro.hogar.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">En el Jardín</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {ahorro.jardin.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}