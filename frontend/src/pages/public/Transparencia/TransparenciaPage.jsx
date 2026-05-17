import { useEffect, useState } from "react";
import { hero } from "./TransparenciaData";
import { FiZoomIn, FiX } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ── Iconos ────────────────────────────────────────────────────────────────────
const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M9 13h6" />
    <path d="M9 17h4" />
  </svg>
);

const IconChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6" aria-hidden="true">
    <path d="M18 20V10" />
    <path d="M12 20V4" />
    <path d="M6 20v-6" />
  </svg>
);

const IconTag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6" aria-hidden="true">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

const IconExternal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6" />
    <path d="m10 14 11-11" />
  </svg>
);

const WaterDropBg = () => (
  <svg
    className="absolute inset-0 h-full w-full pointer-events-none opacity-[0.05]"
    viewBox="0 0 800 400"
    preserveAspectRatio="xMidYMid slice"
  >
    <circle cx="660" cy="70" r="200" fill="white" />
    <circle cx="100" cy="330" r="130" fill="white" />
    <circle cx="390" cy="210" r="80" fill="white" />
  </svg>
);

// ── Mapeo de estilo por label ─────────────────────────────────────────────────
// Asigna icono y color según el nombre del link guardado en BD
const getLinkEstilo = (label = "") => {
  const l = label.toLowerCase();
  if (l.includes("asamblea")) return { Icon: IconFile, color: "blue" };
  if (l.includes("financiero")) return { Icon: IconChart, color: "emerald" };
  if (l.includes("tarifa")) return { Icon: IconTag, color: "violet" };
  return { Icon: IconFile, color: "blue" };
};

const colorMap = {
  blue: { icon: "bg-blue-100 text-blue-700", btn: "bg-blue-600 hover:bg-blue-700", border: "border-blue-100" },
  emerald: { icon: "bg-emerald-100 text-emerald-700", btn: "bg-emerald-600 hover:bg-emerald-700", border: "border-emerald-100" },
  violet: { icon: "bg-violet-100 text-violet-700", btn: "bg-violet-600 hover:bg-violet-700", border: "border-violet-100" },
};

const SectionLabel = ({ children }) => (
  <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-600">
    {children}
  </span>
);

// ── Sub-componentes ───────────────────────────────────────────────────────────
function EnlaceCard({ link }) {
  const { Icon, color } = getLinkEstilo(link.label);
  const colors = colorMap[color];
  return (
    <div className={`bg-white rounded-xl border ${colors.border} shadow-sm p-7 flex flex-col gap-5`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.icon}`}>
        <Icon />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-slate-800 mb-1">{link.label}</h3>
      </div>
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition ${colors.btn}`}
      >
        Acceder
        <IconExternal />
      </a>
    </div>
  );
}

function ReunionCard({ reunion }) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-xl border border-slate-100 shadow-sm p-5">
      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
        <IconCalendar />
      </div>
      <div className="flex-1 min-w-0 max-h-28 overflow-y-auto pr-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-slate-800 leading-snug break-words">{reunion.descripcion}</p>
          {reunion.tipo === "extraordinaria" && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              Extraordinaria
            </span>
          )}
        </div>
        {reunion.fecha && (
          <p className="text-xs text-slate-500 mt-1">
            {new Date(reunion.fecha + "T00:00:00").toLocaleDateString("es-CR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

/* ───────── CARD ───────── */
function CertificadoCard({ cert }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const src = cert.imagenUrl?.startsWith("http")
    ? cert.imagenUrl
    : `${API_BASE_URL}${cert.imagenUrl}`;

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-md">

        {/* IMAGEN */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="relative w-full aspect-[4/3] group overflow-hidden"
        >
          <img
            src={src}
            alt={cert.titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition flex items-center justify-center">

            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
              <div className="bg-white/90 text-slate-900 p-3 rounded-full shadow-md">
                <FiZoomIn className="text-xl" />
              </div>
            </div>

          </div>
        </button>

        {/* TEXTO */}
        {cert.titulo && (
          <div className="p-4">
            <p className="text-sm font-semibold text-slate-700 leading-snug break-words whitespace-normal">
              {cert.titulo}
            </p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <button
              className="absolute -top-12 right-0 text-white hover:text-blue-300 flex items-center gap-2"
              onClick={() => setIsModalOpen(false)}
            >
              <span className="text-sm font-semibold">CERRAR</span>
              <FiX className="text-2xl" />
            </button>

            <img
              src={src}
              alt="Vista ampliada"
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function TransparenciaPage() {
  const [enlaces, setEnlaces] = useState([]);
  const [reuniones, setReuniones] = useState([]);
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resTransparencia, resLinks] = await Promise.all([
          fetch(`${API_BASE_URL}/api/transparencia`),
          fetch(`${API_BASE_URL}/api/links`),
        ]);

        if (resTransparencia.ok) {
          const data = await resTransparencia.json();
          setReuniones(Array.isArray(data.reuniones) ? data.reuniones : []);
          setCertificados(Array.isArray(data.certificados) ? data.certificados : []);
        }

        if (resLinks.ok) {
          const linksData = await resLinks.json();
          setEnlaces(Array.isArray(linksData) ? linksData : []);
        }
      } catch (err) {
        console.error("Error al cargar transparencia:", err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900">
        <WaterDropBg />
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-sky-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />

        <div className="absolute bottom-0 left-0 right-0 leading-none" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block w-full h-20">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L0,80Z" fill="#f8fafc" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 text-center">
          <span className="section-badge bg-sky-500/20 border border-sky-400/30 text-sky-300 mb-5">
            Rendición de cuentas
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5" style={{ fontFamily: "var(--font-display)" }}>
            {hero.title}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* ENLACES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <SectionLabel>Documentos institucionales</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3">
            Acceso a información
          </h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-7 h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {enlaces.map((link) => (
              <EnlaceCard key={link._id} link={link} />
            ))}
          </div>
        )}
      </section>

      {/* REUNIONES */}
      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionLabel>Gobierno institucional</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3">
              Fechas de Reuniones de Junta Directiva
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Calendario actualizado de sesiones ordinarias y extraordinarias.
            </p>
          </div>
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              Cargando reuniones...
            </div>
          ) : reuniones.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-sky-400 scrollbar-track-slate-100">
              {reuniones.map((r) => (
                <ReunionCard key={r._id} reunion={r} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              No hay reuniones registradas en este momento.
            </div>
          )}
        </div>
      </section>

      {/* CERTIFICADOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-10">
          <SectionLabel>Acreditaciones</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3">
            Certificados
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Documentos y acreditaciones oficiales de la ASADA.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Cargando certificados...
          </div>
        ) : certificados.length > 0 ? (
          <div className="relative">

            {/* Flecha izquierda */}
            <button
              onClick={() =>
                document
                  .getElementById("scrollCertificados")
                  .scrollBy({ left: -320, behavior: "smooth" })
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 hover:opacity-100 transition"
            >
              <div className="bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl rounded-full p-3 hover:scale-110 transition border border-slate-200">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </button>

            {/* Flecha derecha */}
            <button
              onClick={() =>
                document
                  .getElementById("scrollCertificados")
                  .scrollBy({ left: 320, behavior: "smooth" })
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 hover:opacity-100 transition"
            >
              <div className="bg-white/90 backdrop-blur-md shadow-lg hover:shadow-xl rounded-full p-3 hover:scale-110 transition border border-slate-200">
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* CONTENEDOR */}
            <div
              id="scrollCertificados"
              className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide"
            >
              {certificados.map((cert) => (
                <div key={cert._id} className="snap-start min-w-[260px] max-w-[260px]">
                  <CertificadoCard cert={cert} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No hay certificados registrados en este momento.
          </div>
        )}
      </section>
    </div>
  );
}