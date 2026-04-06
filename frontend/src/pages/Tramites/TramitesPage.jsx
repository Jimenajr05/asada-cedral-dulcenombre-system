import {
  hero,
  tramites,
  formasPago,
  formularios,
  ayuda,
  recibos,
  notaLegal,
} from "./TramitesData";

/* ─── Fondo decorativo ───────────────────────── */
const WaterDropBg = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none"
    viewBox="0 0 800 400"
    preserveAspectRatio="xMidYMid slice"
  >
    <circle cx="660" cy="70" r="200" fill="white" />
    <circle cx="100" cy="330" r="130" fill="white" />
    <circle cx="390" cy="210" r="80" fill="white" />
  </svg>
);

/* ─── Iconos simples ─────────────────────────── */
const IconFile = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M12 18v-6" />
    <path d="M9 15l3 3 3-3" />
  </svg>
);

const IconCard = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const IconBank = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M3 10h18" />
    <path d="M5 10v7" />
    <path d="M9 10v7" />
    <path d="M15 10v7" />
    <path d="M19 10v7" />
    <path d="M2 20h20" />
    <path d="M12 3 2 7v3h20V7L12 3z" />
  </svg>
);

const IconReceipt = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3z" />
    <path d="M9 8h6" />
    <path d="M9 12h6" />
    <path d="M9 16h4" />
  </svg>
);

const IconInfo = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 10v6" />
    <path d="M12 7h.01" />
  </svg>
);

const IconPhone = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.61a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.47-1.29a2 2 0 0 1 2.11-.45c.83.3 1.71.51 2.61.63A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconMail = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const paymentIcons = [IconCard, IconCard, IconBank, IconBank, IconBank, IconCard];

/* ═══════════════════════════════════════════════
   COMPONENTE
═══════════════════════════════════════════════ */
export default function ProceduresPage() {
  return (
    <div className="bg-slate-50">
      {/* ───────── HERO ───────── */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
        <WaterDropBg />

        {/* OLA */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="w-full h-20"
          >
            <path
              d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L0,80Z"
              fill="#f8fafc"
            />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            {hero.title}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* ───────── TRÁMITES ───────── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tramites.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <IconFile />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">
                    {t.title}
                  </h3>
                  <p className="text-sm text-slate-500">{t.description}</p>
                </div>
              </div>

              <p className="text-sm font-semibold text-slate-800 mb-3">
                Requisitos:
              </p>

              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                {t.requisitos.map((r, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-[2px]">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                {t.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── NOTA LEGAL ───────── */}
      <section className="max-w-5xl mx-auto px-4 pb-10">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-slate-700">
          <span className="font-semibold text-blue-700">
            {notaLegal.title}:
          </span>{" "}
          {notaLegal.text}
        </div>
      </section>

      {/* ───────── FORMAS DE PAGO ───────── */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-10">
          Formas de Pago
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {formasPago.map((p, i) => {
            const Icon = paymentIcons[i] || IconCard;

            return (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
              >
                <div className="mx-auto mb-4 w-11 h-11 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Icon />
                </div>

                <h3 className="font-semibold text-slate-800">{p.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{p.detail}</p>
                <p className="text-xs mt-3 text-slate-500 leading-relaxed">
                  {p.extra}
                </p>
              </div>
            );
          })}
        </div>

        {/* consulta recibos mejorada */}
        <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <IconReceipt />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {recibos.title}
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-2xl">
                  {recibos.text}
                </p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <a
                href={recibos.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-medium shadow hover:bg-blue-700 transition"
              >
                {recibos.linkLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FORMULARIOS ───────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-10">
          Formularios Descargables
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {formularios.map((f, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <IconFile />
                </div>

                <div>
                  <p className="font-medium text-slate-800">{f}</p>
                  <p className="text-xs text-slate-500 mt-1">PDF disponible</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-10 text-center shadow-sm">
          <h3 className="text-2xl font-bold mb-2">{ayuda.title}</h3>
          <p className="mb-6 text-blue-100 max-w-2xl mx-auto">{ayuda.text}</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition">
              <IconPhone />
              <span>{ayuda.primaryText}</span>
            </button>

            <button className="inline-flex items-center justify-center gap-2 bg-blue-500 px-6 py-3 rounded-lg font-medium hover:bg-blue-400 transition">
              <IconMail />
              <span>{ayuda.secondaryText}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ───────── AYUDA EXTRA / RECORDATORIO ───────── */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
            <IconInfo />
          </div>
          <div>
            <p className="font-semibold text-slate-800 mb-1">Recordatorio</p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Antes de presentar un trámite, verifica que la documentación esté
              completa y actualizada para agilizar el proceso de atención.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}