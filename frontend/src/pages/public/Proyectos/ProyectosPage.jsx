/**
 * @file ProyectosPage.jsx
 * @description Página pública de "Proyectos". Carga los proyectos comunitarios y de infraestructura desde la API, ofrece un buscador dinámico por título/descripción, e implementa acordeones desplegables por proyecto que contienen galerías de fotos con zoom, listas de planos/documentos descargables y bitácoras detalladas sobre el avance cronológico del proyecto.
 */

import { useEffect, useState } from "react";
import { FileText, ChevronDown, ChevronUp, FolderOpen, Image as ImageIcon, Clock, Activity, Search } from "lucide-react";
import { getProyectosPublico, BASE_URL } from "../../../services/proyectoService";
import { FiZoomIn, FiX } from "react-icons/fi";

/**
 * Mapeo de estados del proyecto hacia estilos CSS e indicadores visuales.
 */
const estadoConfig = {
  "En progreso": { color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  "Completado": { color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  "Pausado": { color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  "Planificado": { color: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" },
};

const WaterDropBg = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 800 400">
    <circle cx="660" cy="70" r="200" fill="white" />
    <circle cx="100" cy="330" r="130" fill="white" />
    <circle cx="390" cy="210" r="80" fill="white" />
  </svg>
);

function StatChip({ icon: Icon, count, label }) {
  if (!count) return null;
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
      <Icon className="h-3.5 w-3.5" />
      {count} {label}
    </div>
  );
}

/**
 * Componente de página pública de "Proyectos".
 * Carga la lista de obras y mejoras del acueducto con búsqueda y paginación.
 * @component
 */
export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [proyectoSearch, setProyectoSearch] = useState("");
  const proyectosPorPagina = 5;

  useEffect(() => {
    getProyectosPublico()
      .then(setProyectos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [proyectoSearch]);

  const proyectosFiltrados = proyectos.filter((p) => {
    const term = proyectoSearch.toLowerCase().trim();
    if (!term) return true;
    return (
      (p.titulo || "").toLowerCase().includes(term) ||
      (p.descripcion || "").toLowerCase().includes(term) ||
      (p.estado || "").toLowerCase().includes(term)
    );
  });

  const indexInicio = (paginaActual - 1) * proyectosPorPagina;
  const indexFin = indexInicio + proyectosPorPagina;

  const proyectosPaginados = proyectosFiltrados.slice(indexInicio, indexFin);

  const totalPaginas = Math.ceil(proyectosFiltrados.length / proyectosPorPagina);

  return (
    <main className="bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900">
        <WaterDropBg />
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-sky-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block w-full h-20">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L0,80Z" fill="#f8fafc" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-28 pt-16 text-center sm:px-6 lg:px-8">
          <span className="section-badge bg-sky-500/20 border border-sky-400/30 text-sky-300 mb-5">
            Desarrollo comunitario
          </span>
          <h1 className="mt-4 mb-5 text-4xl font-extrabold text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Proyectos
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-blue-100">
            Conocé los proyectos que la ASADA Cedral y Dulce Nombre está desarrollando para mejorar el servicio de agua potable en la comunidad.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {!loading && (
          <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Resultados</p>
              <p className="mt-0.5 text-xl font-bold text-slate-900">
                {proyectosFiltrados.length} {proyectosFiltrados.length === 1 ? "proyecto" : "proyectos"}
              </p>
            </div>

            <div className="relative w-full md:max-w-md">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={proyectoSearch}
                onChange={(e) => setProyectoSearch(e.target.value)}
                placeholder="Buscar proyecto..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-14 pr-4 text-slate-900 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mb-4" />
            <p>Cargando proyectos...</p>
          </div>
        ) : proyectosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <FolderOpen className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">
              {proyectoSearch.trim() ? "Sin resultados" : "No hay proyectos aún"}
            </h3>
            <p className="mt-2 text-slate-400">
              {proyectoSearch.trim() ? "No se encontraron proyectos que coincidan con la búsqueda." : "Próximamente se publicarán los proyectos en curso."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {proyectosPaginados.map((proyecto, i) => {
              const abierto = expandido === proyecto._id;
              const cfg = estadoConfig[proyecto.estado] || estadoConfig["Planificado"];
              const nFotos = proyecto.fotos?.length || 0;
              const nDocs = proyecto.documentos?.length || 0;
              const nActs = proyecto.actualizaciones?.length || 0;
              const ultimaAct = proyecto.actualizaciones?.length
                ? [...proyecto.actualizaciones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0]
                : null;

              return (
                <div key={proyecto._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                  style={{ animationDelay: `${i * 60}ms` }}>

                  {/* Cabecera */}
                  <button onClick={() => setExpandido(abierto ? null : proyecto._id)}
                    className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Ícono */}
                        <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                          <FolderOpen className="h-5 w-5 text-blue-600" />
                        </div>

                        <div className="flex-1 w-full min-w-0">
                          {/* Título + estado */}
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold text-slate-900 leading-tight break-words whitespace-normal w-full">
                              {proyecto.titulo}
                            </h2>
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                              {proyecto.estado}
                            </span>
                          </div>

                          {/* Descripción preview */}
                          {proyecto.descripcion && (
                            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                              {proyecto.descripcion.length > 50
                                ? proyecto.descripcion.substring(0, 50) + "..."
                                : proyecto.descripcion}
                            </p>
                          )}

                          {/* Chips de stats */}
                          <div className="flex flex-wrap gap-2">
                            <StatChip icon={ImageIcon} count={nFotos} label={nFotos === 1 ? "foto" : "fotos"} />
                            <StatChip icon={FileText} count={nDocs} label={nDocs === 1 ? "documento" : "documentos"} />
                            <StatChip icon={Activity} count={nActs} label={nActs === 1 ? "actualización" : "actualizaciones"} />
                            {ultimaAct && (
                              <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                <Clock className="h-3.5 w-3.5" />
                                Última actualización: {new Date(ultimaAct.fecha).toLocaleDateString("es-CR", { day: "numeric", month: "short", year: "numeric" })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Chevron */}
                      <div className={`shrink-0 mt-1 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${abierto ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"}`}>
                        {abierto ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Detalle expandido */}
                  {abierto && (
                    <div className="border-t border-slate-100 bg-slate-50 px-4 sm:px-6 pb-6 sm:pb-8 pt-5 sm:pt-6 space-y-8">

                      {/* Descripción completa */}
                      {proyecto.descripcion && (
                        <p className="text-sm text-slate-500 mb-3 break-words whitespace-normal">{proyecto.descripcion}</p>
                      )}

                      {/* Fotos */}
                      {nFotos > 0 && (
                        <div>
                          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                            <ImageIcon className="h-4 w-4 text-blue-500" /> Fotos del proyecto
                          </h3>

                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {proyecto.fotos.map((foto) => {
                              const src = foto.src?.startsWith("http")
                                ? foto.src
                                : `${BASE_URL}${foto.src}`;

                              return (
                                <div
                                  key={foto._id}
                                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                >
                                  {/* Imagen con lupa */}
                                  <button
                                    type="button"
                                    onClick={() => setImagenActiva(src)}
                                    className="relative w-full aspect-[4/3] group overflow-hidden"
                                  >
                                    <img
                                      src={src}
                                      alt={foto.alt || "Foto del proyecto"}
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition flex items-center justify-center">
                                      <div className="opacity-0 group-hover:opacity-100 transition duration-300 ease-out transform scale-90 group-hover:scale-100">
                                        <div className="bg-white/90 p-2 rounded-full shadow-md">
                                          <FiZoomIn className="text-lg text-slate-800" />
                                        </div>
                                      </div>
                                    </div>
                                  </button>

                                  {/* Texto */}
                                  {foto.alt && (
                                    <p className="px-3 py-2 text-xs text-slate-500 break-words whitespace-normal">
                                      {foto.alt}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Documentos */}
                      {nDocs > 0 && (
                        <div>
                          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                            <FileText className="h-4 w-4 text-blue-500" /> Documentos
                          </h3>
                          <div className="space-y-2">
                            {proyecto.documentos.map((doc) => (
                              <a key={doc._id}
                                href={doc.url?.startsWith("http") ? doc.url : `${BASE_URL}${doc.url}`}
                                target="_blank" rel="noreferrer"
                                className="group flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:px-5 sm:py-3.5 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 shadow-sm">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 group-hover:bg-blue-200 transition">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="break-words whitespace-normal leading-snug">
                                      {doc.nombre}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs text-sky-600 font-bold sm:text-slate-400 group-hover:text-blue-500 sm:ml-auto self-end sm:self-center shrink-0">Descargar →</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actualizaciones */}
                      {nActs > 0 && (
                        <div>
                          <h3 className="mb-5 flex items-center gap-2 text-base font-bold text-slate-900">
                            <Activity className="h-4 w-4 text-blue-500" /> Bitácora de actualizaciones
                          </h3>
                          <div className="relative">
                            {/* Línea vertical */}
                            <div className="absolute left-4 top-0 bottom-0 w-px bg-blue-100" />
                            <div className="space-y-4 pl-10">
                              {[...proyecto.actualizaciones].reverse().map((act, idx) => (
                                <div key={act._id} className="relative">
                                  {/* Dot */}
                                  <div className={`absolute -left-[2.15rem] top-1.5 h-3 w-3 rounded-full border-2 border-white shadow-sm ${idx === 0 ? "bg-blue-500" : "bg-slate-300"}`} />
                                  <div className={`rounded-2xl border px-5 py-4 ${idx === 0 ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}>
                                    <p className={`text-xs font-semibold mb-1.5 ${idx === 0 ? "text-blue-500" : "text-slate-400"}`}>
                                      {new Date(act.fecha).toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric" })}
                                      {idx === 0 && <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-blue-600">Más reciente</span>}
                                    </p>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed">{act.texto}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sin contenido */}
                      {nFotos === 0 && nDocs === 0 && nActs === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center text-slate-400 text-sm">
                          Este proyecto aún no tiene fotos, documentos ni actualizaciones.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {totalPaginas > 1 && (
              <div className="flex justify-center items-center mt-10">
                <div className="flex items-center gap-1 rounded-2xl bg-white/80 backdrop-blur px-2 py-2 shadow-sm border border-slate-200">

                  {/* Botón anterior */}
                  <button
                    onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                    disabled={paginaActual === 1}
                    className="px-3 py-2 rounded-xl text-sm font-medium transition bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>

                  {/* Números de página */}
                  {[...Array(totalPaginas)].map((_, i) => {
                    const page = i + 1;
                    const active = paginaActual === page;

                    return (
                      <button
                        key={page}
                        onClick={() => setPaginaActual(page)}
                        className={`min-w-[36px] h-9 rounded-xl text-sm font-semibold transition-all duration-200
                          ${active
                            ? "bg-blue-600 text-white shadow-md scale-105"
                            : "bg-transparent text-slate-600 hover:bg-slate-100"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Botón siguiente */}
                  <button
                    onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                    disabled={paginaActual === totalPaginas}
                    className="px-3 py-2 rounded-xl text-sm font-medium transition bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    →
                  </button>

                </div>
              </div>
            )}

            {/* Modal de Imagen */}
            {imagenActiva && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm"
                onClick={() => setImagenActiva(null)}
              >
                <div className="relative max-w-5xl w-full flex flex-col items-center">
                  <button
                    className="absolute -top-12 right-0 text-white hover:text-blue-300 flex items-center gap-2"
                    onClick={() => setImagenActiva(null)}
                  >
                    <span className="text-sm font-semibold">CERRAR</span>
                    <FiX className="text-2xl" />
                  </button>

                  <img
                    src={imagenActiva}
                    alt="Vista ampliada"
                    className="max-h-[85vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}