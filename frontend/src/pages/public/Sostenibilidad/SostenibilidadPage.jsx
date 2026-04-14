import {
  hero,
  compromiso,
  pilares,
  programas,
  impacto,
  observaciones,
} from "./SostenibilidadData";

/* ─── Íconos ─────────────────────────────────────────── */
const IconShield = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
  </svg>
);

const IconDrop = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
  </svg>
);

const IconWrench = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2-2 1.4-3.4z" />
  </svg>
);

const IconLeaf = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M5 21c8 0 14-6 14-14-8 0-14 6-14 14z" />
    <path d="M9 15c2-2 4-4 8-6" />
  </svg>
);

const IconHydrant = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M9 21v-6h6v6" />
    <path d="M8 15h8" />
    <path d="M10 9V6a2 2 0 1 1 4 0v3" />
    <path d="M6 9h12v6H6z" />
    <path d="M4 12h2" />
    <path d="M18 12h2" />
  </svg>
);

/* ─── Fondo animado ───────────────────────────────────── */
const FloatingBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-white/10 animate-floatSlow" />
    <div className="absolute left-1/3 top-10 h-72 w-72 rounded-full bg-white/10 animate-floatMedium" />
    <div className="absolute right-[-80px] top-[-40px] h-[24rem] w-[24rem] rounded-full bg-white/10 animate-floatSlow" />
  </div>
);

const SectionLabel = ({ children }) => (
  <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-green-50 text-green-700">
    {children}
  </span>
);

const pillarIcons = [IconShield, IconDrop, IconWrench];
const programIcons = [IconShield, IconDrop, IconWrench];
const impactIcons = [IconHydrant, IconShield, IconLeaf];

/* ═══════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════ */
export default function SustainabilityPage() {
  return (
    <div className="bg-slate-50">
      {/* HERO */}
        <section className="relative h-[420px] overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1600&q=80"
                alt="Sostenibilidad"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/55" />
            <FloatingBg />

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

            <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
                <div className="max-w-3xl">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
                    {hero.title}
                </h1>
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                    {hero.subtitle}
                </p>
                </div>
            </div>
        </section>

      {/* COMPROMISO */}
      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel>Compromiso ambiental</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3 mb-6">
            {compromiso.title}
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-4xl mx-auto">
            {compromiso.text}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {pilares.map((item, index) => {
            const Icon = pillarIcons[index];
            const colors = [
              "bg-green-100 text-green-700",
              "bg-blue-100 text-blue-700",
              "bg-violet-100 text-violet-700",
            ];

            return (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-7 text-center"
              >
                <div
                  className={`mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center ${colors[index]}`}
                >
                  <Icon />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PROGRAMAS */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionLabel>Acciones institucionales</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3">
              Programas Ambientales
            </h2>
          </div>

          <div className="space-y-6">
            {programas.map((programa, index) => {
              const Icon = programIcons[index];
              const tones = [
                "bg-green-100 text-green-700",
                "bg-blue-100 text-blue-700",
                "bg-amber-100 text-amber-700",
              ];

              return (
                <div
                  key={programa.title}
                  className="bg-slate-50 rounded-xl border border-slate-100 shadow-sm p-7"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${tones[index]}`}
                    >
                      <Icon />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                        {programa.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed mb-5">
                        {programa.desc}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {programa.notes.map((note) => (
                          <div
                            key={note}
                            className={`rounded-lg px-4 py-3 text-sm ${
                              index === 0
                                ? "bg-green-50 text-green-800"
                                : index === 1
                                ? "bg-blue-50 text-blue-800"
                                : "bg-amber-50 text-amber-800"
                            }`}
                          >
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* IMPACTO */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel>Indicadores visibles</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3 mb-10">
            Impacto Ambiental
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {impacto.map((item, index) => {
              const Icon = impactIcons[index];
              const iconColor = [
                "text-blue-700",
                "text-green-700",
                "text-emerald-700",
              ];

              return (
                <div
                  key={item.label}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 text-center"
                >
                  <div className={`mx-auto mb-4 w-fit ${iconColor[index]}`}>
                    <Icon />
                  </div>
                  <p className="text-4xl font-extrabold text-slate-800 mb-2">
                    {item.value}
                  </p>
                  <p className="text-slate-600">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OBSERVACIONES */}
      <section className="bg-slate-100 py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
            <SectionLabel>Contenido en crecimiento</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3 mb-4">
              {observaciones.title}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {observaciones.text}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}