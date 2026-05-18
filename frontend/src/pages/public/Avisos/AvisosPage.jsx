/**
 * @file AvisosPage.jsx
 * @description Página pública de "Avisos Importantes". Carga los avisos del servidor, filtra por categorías (Urgentes, Información, Completados), incluye búsqueda dinámica, paginación, avisos fijados destacados, y un modal responsivo para ampliar imágenes adjuntas.
 */

import { useEffect, useMemo, useState } from "react";
import {
  FiBell,
  FiCalendar,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiZoomIn,
  FiX,
  FiSearch,
} from "react-icons/fi";

/**
 * Fondo decorativo animado con formas de gotas de agua.
 * @component
 */
const WaterDropBg = () => (
  <svg
    className="absolute inset-0 h-full w-full opacity-[0.05]"
    viewBox="0 0 800 400"
  >
    <circle cx="660" cy="70" r="200" fill="white" />
    <circle cx="100" cy="330" r="130" fill="white" />
    <circle cx="390" cy="210" r="80" fill="white" />
  </svg>
);

const filtros = [
  { key: "todos", label: "Todos" },
  { key: "urgente", label: "Urgentes" },
  { key: "info", label: "Información" },
  { key: "completado", label: "Completados" },
];

function tipoConfig(tipo) {
  switch (tipo) {
    case "urgente":
      return {
        label: "Urgente",
        icon: <FiAlertCircle className="text-base" />,
        pill: "border border-red-200 bg-red-100 text-red-700",
        activeButton: "bg-red-600 text-white hover:bg-red-700",
      };
    case "info":
      return {
        label: "Información",
        icon: <FiInfo className="text-base" />,
        pill: "border border-blue-200 bg-blue-100 text-blue-700",
        activeButton: "bg-blue-600 text-white hover:bg-blue-700",
      };
    case "completado":
      return {
        label: "Completado",
        icon: <FiCheckCircle className="text-base" />,
        pill: "border border-green-200 bg-green-100 text-green-700",
        activeButton: "bg-green-600 text-white hover:bg-green-700",
      };
    default:
      return {
        label: "Aviso",
        icon: <FiBell className="text-base" />,
        pill: "border border-slate-200 bg-slate-100 text-slate-700",
        activeButton: "bg-blue-600 text-white hover:bg-blue-700",
      };
  }
}

function FiltroButton({ filtro, activo, onClick }) {
  const config = tipoConfig(filtro.key);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3.5 py-2 sm:px-5 sm:py-3 text-sm sm:text-base font-semibold transition ${activo
        ? filtro.key === "todos"
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : config.activeButton
        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
    >
      {filtro.label}
    </button>
  );
}

function AvisoCard({ aviso, destacado = false }) {
  const config = tipoConfig(aviso?.tipo);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <article
        className={`rounded-3xl bg-white shadow-sm border transition-shadow hover:shadow-md overflow-hidden ${destacado ? "border-blue-400 ring-4 ring-blue-50" : "border-slate-200"
          }`}
      >
        <div className="flex flex-col md:flex-row h-full">

          {/* Imagen */}
          {aviso?.imagen && (
            <div className="w-full md:w-1/3 lg:w-[28%] xl:w-1/4 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full h-full relative group focus:outline-none transition-all block"
                aria-label="Ampliar imagen"
              >
                <img
                  src={aviso.imagen}
                  alt="Adjunto del aviso"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 min-h-[250px] md:min-h-full absolute inset-0"
                  style={{ position: 'relative' }}
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="bg-white/90 text-slate-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md transform scale-90 group-hover:scale-100">
                    <FiZoomIn className="text-2xl" />
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Texto y Etiquetas */}
          <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              {destacado && (
                <div className="flex items-center gap-2 text-sm font-bold tracking-wide text-blue-600 uppercase">
                  <FiBell className="text-base" />
                  <span>Aviso Destacado</span>
                </div>
              )}

              <div className={`flex flex-wrap items-center gap-3 text-sm ${!destacado ? 'w-full justify-between' : ''}`}>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold shadow-sm ${config.pill}`}
                >
                  {config.icon}
                  {config.label}
                </span>

                <span className="inline-flex items-center gap-1.5 font-medium text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
                  <FiCalendar className="text-base" />
                  {aviso?.fechaFormateada || "Sin fecha"}
                </span>
              </div>
            </div>

            <h3 className="mb-4 text-2xl font-bold leading-tight text-slate-900 md:text-3xl break-words">
              {aviso?.titulo || "Sin título"}
            </h3>

            <div className="max-h-25 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-base sm:text-lg leading-relaxed text-slate-700 whitespace-pre-line break-words">
                {aviso?.descripcion || "Sin descripción"}
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Modal de Imagen */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-5xl w-full flex flex-col items-center">
            <button
              type="button"
              className="absolute -top-12 right-0 text-white hover:text-blue-300 p-2 flex items-center gap-2 transition-colors focus:outline-none"
              onClick={() => setIsModalOpen(false)}
            >
              <span className="font-semibold tracking-wide text-sm">CERRAR</span>
              <FiX className="text-2xl" />
            </button>
            <img
              src={aviso.imagen}
              alt="Vista ampliada"
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl shadow-2xl ring-1 ring-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Componente de página pública de "Avisos".
 * Carga comunicados comunitarios, permitiendo su filtrado y paginación.
 * @component
 */
export default function AvisosPage() {
  const [avisosData, setAvisosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const avisosPorPagina = 5;

  useEffect(() => {
    const obtenerAvisos = async () => {
      try {
        setLoading(true);
        setError("");

        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const response = await fetch(`${API_BASE}/api/avisos`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al obtener los avisos");
        }

        const avisosFormateados = Array.isArray(data)
          ? data
            .filter((aviso) => aviso.estado === "publicado")
            .map((aviso) => ({
              ...aviso,
              fechaFormateada: aviso.createdAt
                ? new Date(aviso.createdAt).toLocaleDateString("es-CR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
                : "Sin fecha",
            }))
          : [];

        setAvisosData(avisosFormateados);
      } catch (err) {
        console.error("Error cargando avisos:", err);
        setError(err.message || "Ocurrió un error al cargar los avisos");
      } finally {
        setLoading(false);
      }
    };

    obtenerAvisos();
  }, []);

  const [avisoSearch, setAvisoSearch] = useState("");

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroActivo, avisoSearch]);

  const avisosFiltrados = useMemo(() => {
    const base = filtroActivo === "todos"
      ? avisosData
      : avisosData.filter((aviso) => aviso?.tipo === filtroActivo);

    const term = avisoSearch.toLowerCase().trim();
    if (!term) return base;

    return base.filter((aviso) =>
      (aviso?.titulo || "").toLowerCase().includes(term) ||
      (aviso?.descripcion || "").toLowerCase().includes(term)
    );
  }, [avisosData, filtroActivo, avisoSearch]);

  const avisoDestacado = avisosFiltrados.find((aviso) => aviso?.fijado);

  const avisosSinDestacado = useMemo(() => {
    if (!avisoDestacado) return avisosFiltrados;
    return avisosFiltrados.filter((aviso) => aviso?._id !== avisoDestacado._id);
  }, [avisosFiltrados, avisoDestacado]);

  const indexInicio = (paginaActual - 1) * avisosPorPagina;
  const indexFin = indexInicio + avisosPorPagina;

  const avisosPaginados = avisosSinDestacado.slice(indexInicio, indexFin);

  const totalPaginas = Math.ceil(avisosSinDestacado.length / avisosPorPagina);

  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900">
        <WaterDropBg />
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-sky-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />

        <div className="absolute bottom-0 left-0 right-0 leading-none" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-20 w-full">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L0,80Z" fill="#f8fafc" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-28 pt-16 text-center sm:px-6 lg:px-8">
          <span className="section-badge bg-sky-500/20 border border-sky-400/30 text-sky-300 mb-5">
            Comunicados oficiales
          </span>
          <h1 className="mt-4 mb-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white" style={{ fontFamily: "var(--font-display)" }}>
            Avisos Importantes
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-blue-100">
            Mantente informado sobre nuestros servicios y actividades.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {filtros.map((filtro) => (
              <FiltroButton
                key={filtro.key}
                filtro={filtro}
                activo={filtroActivo === filtro.key}
                onClick={() => setFiltroActivo(filtro.key)}
              />
            ))}
          </div>
        </div>
      </section>

      {loading && (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg text-slate-600">Cargando avisos...</p>
          </div>
        </section>
      )}

      {!loading && error && (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center shadow-sm">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </section>
      )}

      {!loading && !error && (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="space-y-8">
            {/* Buscador de avisos */}
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Resultados</p>
                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {avisosSinDestacado.length + (avisoDestacado ? 1 : 0)} {avisosSinDestacado.length + (avisoDestacado ? 1 : 0) === 1 ? "aviso" : "avisos"}
                </p>
              </div>

              <div className="relative w-full md:max-w-md">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FiSearch className="text-base" />
                </span>
                <input
                  type="text"
                  value={avisoSearch}
                  onChange={(e) => setAvisoSearch(e.target.value)}
                  placeholder="Buscar comunicado..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-14 pr-4 text-slate-900 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {avisoDestacado && <AvisoCard aviso={avisoDestacado} destacado />}

            {avisosPaginados.map((aviso) => (
              <AvisoCard key={aviso._id} aviso={aviso} />
            ))}

            {totalPaginas > 1 && (
              <div className="flex justify-center items-center mt-10">
                <div className="flex items-center gap-1 rounded-2xl bg-white/80 backdrop-blur px-2 py-2 shadow-sm border border-slate-200">

                  {/* Anterior */}
                  <button
                    onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                    disabled={paginaActual === 1}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                  >
                    ←
                  </button>

                  {/* Páginas */}
                  {[...Array(totalPaginas)].map((_, i) => {
                    const page = i + 1;
                    const active = paginaActual === page;

                    return (
                      <button
                        key={page}
                        onClick={() => setPaginaActual(page)}
                        className={`min-w-[36px] h-9 rounded-xl text-sm font-semibold transition
              ${active
                            ? "bg-blue-600 text-white shadow-md scale-105"
                            : "bg-transparent text-slate-600 hover:bg-slate-100"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Siguiente */}
                  <button
                    onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                    disabled={paginaActual === totalPaginas}
                    className="px-3 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40"
                  >
                    →
                  </button>

                </div>
              </div>
            )}

            {!avisoDestacado && avisosSinDestacado.length === 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-lg text-slate-600">
                  {avisoSearch.trim() ? "No se encontraron avisos que coincidan con la búsqueda." : "No hay avisos disponibles para esta categoría."}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}