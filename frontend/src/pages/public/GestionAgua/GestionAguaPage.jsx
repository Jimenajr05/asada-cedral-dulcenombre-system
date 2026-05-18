/**
 * @file GestionAguaPage.jsx
 * @description Página pública de "Gestión del Agua". Carga y despliega los parámetros de calidad del agua física-química (cloro residual, turbidez, etc.) con sus porcentajes y rangos oficiales, bitácoras de aforos de nacientes por gravedad, bloques de infraestructura de distribución, la galería interactiva de análisis químicos oficiales acreditados por el AyA, y consejos interactivos para la preservación hídrica.
 */

import { useEffect, useState } from "react";
import {
  obtenerGestionAgua,
  BASE_URL,
} from "../../../services/gestionAguaService";
import { FiZoomIn, FiX } from "react-icons/fi";

/**
 * Icono de gota de agua.
 * @component
 */
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

const IconChevronLeft = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    className="w-6 h-6"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const IconChevronRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    className="w-6 h-6"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const WaterDropBg = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-[0.05]"
    viewBox="0 0 800 400"
  >
    <circle cx="660" cy="70" r="200" fill="white" />
    <circle cx="100" cy="330" r="130" fill="white" />
    <circle cx="390" cy="210" r="80" fill="white" />
  </svg>
);

const IconHome = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconLeaf = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 1 9.8a7 7 0 0 1-9 8.2z" />
  </svg>
);

const IconCheckSimple = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-3.5 h-3.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SectionLabel = ({ children }) => (
  <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700">
    {children}
  </span>
);

const obtenerHeaderColor = (index) => {
  const colores = [
    { bg: "bg-blue-50/80 border-blue-100/50", text: "text-blue-900", dot: "bg-blue-500" },
    { bg: "bg-sky-50/80 border-sky-100/50", text: "text-sky-900", dot: "bg-sky-500" },
    { bg: "bg-teal-50/80 border-teal-100/50", text: "text-teal-900", dot: "bg-teal-500" },
    { bg: "bg-indigo-50/80 border-indigo-100/50", text: "text-indigo-900", dot: "bg-indigo-500" },
    { bg: "bg-emerald-50/80 border-emerald-100/50", text: "text-emerald-900", dot: "bg-emerald-500" },
    { bg: "bg-cyan-50/80 border-cyan-100/50", text: "text-cyan-900", dot: "bg-cyan-500" }
  ];
  return colores[index % colores.length];
};

function ParameterBar({ name, value, range, width }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
        <p className="text-xs sm:text-sm font-semibold text-slate-900">{name}</p>
        <div className="text-xs sm:text-sm text-slate-600">
          <span className="font-medium text-slate-900">{value}</span>
          {range ? <span className="ml-2">({range})</span> : null}
        </div>
      </div>

      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full" style={{ width }} />
      </div>
    </div>
  );
}

function QualityIcon({ icono }) {
  if (icono === "wave") return <IconWave />;
  if (icono === "lab") return <IconLab />;
  return <IconShield />;
}

function AnalisisAguaCard({ data }) {
  const [fotoActiva, setFotoActiva] = useState(0);

  const fotos = data?.fotos || [];
  const totalFotos = fotos.length;

  const [modalOpen, setModalOpen] = useState(false);

  if (!totalFotos) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="h-[420px] bg-slate-100 flex items-center justify-center text-slate-600 font-medium">
            No hay fotos de análisis disponibles.
          </div>

          <div className="p-6">
            <h3 className="font-bold text-slate-900 text-2xl">
              {data?.titulo || "Análisis de calidad del agua"}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  const fotoSeleccionada = fotos[fotoActiva];

  const irAnterior = () => {
    setFotoActiva((prev) => (prev === 0 ? totalFotos - 1 : prev - 1));
  };

  const irSiguiente = () => {
    setFotoActiva((prev) => (prev === totalFotos - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="relative h-[240px] sm:h-[360px] md:h-[420px] bg-slate-100 overflow-hidden">
            <img
              src={`${BASE_URL}${fotoSeleccionada.imagen}`}
              alt={data?.titulo || "Análisis de calidad del agua"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent pointer-events-none" />

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition flex items-center justify-center"
            >
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <div className="bg-white/90 text-slate-900 p-3 rounded-full shadow-md">
                  <FiZoomIn className="text-xl" />
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={irAnterior}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow flex items-center justify-center z-10 transition hover:scale-105"
              aria-label="Foto anterior"
            >
              <IconChevronLeft />
            </button>

            <button
              type="button"
              onClick={irSiguiente}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow flex items-center justify-center z-10 transition hover:scale-105"
              aria-label="Siguiente foto"
            >
              <IconChevronRight />
            </button>

            <div className="absolute top-4 right-4 bg-white/95 text-slate-900 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow z-10">
              {fotoSeleccionada.fecha || "Sin fecha"}
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-bold text-slate-900 text-2xl">
              {data?.titulo || "Análisis de calidad del agua"}
            </h3>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <button
              className="absolute -top-12 right-0 text-white hover:text-blue-300 flex items-center gap-2 transition"
              onClick={() => setModalOpen(false)}
            >
              <span className="text-sm font-semibold">CERRAR</span>
              <FiX className="text-2xl" />
            </button>

            <img
              src={`${BASE_URL}${fotoSeleccionada.imagen}`}
              alt="Zoom análisis"
              className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Componente de página pública de "Gestión del Agua".
 * Administra la obtención de reportes de calidad, aforos e infraestructura.
 * @component
 */
export default function GestionAguaPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const respuesta = await obtenerGestionAgua();
        setData(respuesta);
      } catch (error) {
        console.error("Error al cargar gestión del agua:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <p className="text-slate-700 text-lg">Cargando...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">
          Error al cargar la información de Gestión del Agua.
        </p>
      </div>
    );
  }

  const listaInfraestructura = data.infraestructura || [];

  return (
    <div className="bg-slate-50">
      {/* Hero */}
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
            Recurso hídrico
          </span>
          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold text-white mb-5" style={{ fontFamily: "var(--font-display)" }}>
            {data.hero?.title}
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {data.hero?.subtitle}
          </p>
        </div>
      </section>

      {/* Proceso */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <SectionLabel>Proceso</SectionLabel>
          <h2 className="text-3xl font-bold mt-3 text-slate-900">
            Proceso del Agua
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-2 xl:grid-cols-4">
          {(data.proceso || []).map((p, index) => (
            <div
              key={p._id || index}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-sm text-center border border-slate-200"
            >
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <IconDrop />
              </div>

              <h3 className="font-bold text-sm sm:text-lg text-slate-900 mb-1.5 sm:mb-2">
                {p.titulo}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 sm:text-slate-700 leading-relaxed">
                {p.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Calidad */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-4">
          <div>
            <SectionLabel>Calidad</SectionLabel>
            <h2 className="text-3xl font-bold text-slate-900 mt-3 mb-6">
              Control de Calidad
            </h2>

            <div className="space-y-6">
              {(data.calidad || []).map((c, index) => (
                <div key={c._id || index} className="flex gap-3 sm:gap-4">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0">
                    <QualityIcon icono={c.icono} />
                  </div>

                  <div>
                    <h3 className="font-bold text-base sm:text-xl text-slate-900">
                      {c.titulo}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {c.descripcion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                <IconGauge />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Parámetros de Calidad
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Valores de referencia del monitoreo del agua
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {(data.parametros || []).map((parametro, index) => (
                <ParameterBar
                  key={parametro._id || index}
                  name={parametro.nombre}
                  value={parametro.valor}
                  range={parametro.rango}
                  width={parametro.porcentaje || "0%"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Análisis */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <SectionLabel>Análisis</SectionLabel>
          <h2 className="text-3xl font-bold mt-3 text-slate-900">
            Análisis de Calidad del Agua
          </h2>
        </div>

        <AnalisisAguaCard data={data.analisisCalidadAgua} />
      </section>

      {/* Aforos */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <SectionLabel>Aforos</SectionLabel>
            <h2 className="text-3xl font-bold mt-3 text-slate-900">
              Registro de Aforos
            </h2>
            <p className="text-slate-600 mt-3 max-w-3xl mx-auto">
              Medición mensual de la producción de agua en diferentes puntos del
              sistema.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 px-2 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-lg font-bold text-slate-900 w-[120px] sm:w-[180px]">
                      Fecha
                    </th>
                    <th className="border border-slate-300 px-2 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-lg font-bold text-slate-900">
                      Lugar
                    </th>
                    <th className="border border-slate-300 px-2 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-lg font-bold text-slate-900 w-[140px] sm:w-[200px]">
                      Producción l/s.
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {(data.aforos?.registros || []).map((item, index) => (
                    <tr key={item._id || index}>
                      {index === 0 && (
                        <td
                          rowSpan={data.aforos?.registros?.length || 1}
                          className="border border-slate-300 px-2 sm:px-4 py-2.5 sm:py-3 text-center align-top text-xs sm:text-base text-slate-900 font-medium"
                        >
                          {data.aforos?.fecha}
                        </td>
                      )}

                      <td className="border border-slate-300 px-2 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-base text-slate-800">
                        {item.lugar}
                      </td>
                      <td className="border border-slate-300 px-2 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-base text-slate-800">
                        {item.produccion}
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-slate-50">
                    <td
                      colSpan={2}
                      className="border border-slate-300 px-2 sm:px-4 py-2.5 sm:py-3 text-center text-sm sm:text-xl font-semibold text-slate-900"
                    >
                      Total de l/s
                    </td>
                    <td className="border border-slate-300 px-2 sm:px-4 py-2.5 sm:py-3 text-center text-sm sm:text-xl font-extrabold text-slate-900">
                      {data.aforos?.total}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Infraestructura */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <SectionLabel>Infraestructura</SectionLabel>
          <h2 className="text-3xl font-bold mt-3 text-slate-900">
            Infraestructura del Sistema
          </h2>
        </div>

        {listaInfraestructura.length > 3 ? (
          <div className="relative group/infra">
            {/* Flecha izquierda */}
            <button
              onClick={() =>
                document
                  .getElementById("scrollInfraestructura")
                  .scrollBy({ left: -360, behavior: "smooth" })
              }
              className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md shadow-md rounded-full p-3 opacity-0 group-hover/infra:opacity-100 transition duration-300 hover:scale-110 text-slate-700 hover:text-blue-600 border border-slate-100"
              aria-label="Desplazar a la izquierda"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Flecha derecha */}
            <button
              onClick={() =>
                document
                  .getElementById("scrollInfraestructura")
                  .scrollBy({ left: 360, behavior: "smooth" })
              }
              className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md shadow-md rounded-full p-3 opacity-0 group-hover/infra:opacity-100 transition duration-300 hover:scale-110 text-slate-700 hover:text-blue-600 border border-slate-100"
              aria-label="Desplazar a la derecha"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Contenedor */}
            <div
              id="scrollInfraestructura"
              className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide"
            >
              {listaInfraestructura.map((i, index) => {
                const headerColor = obtenerHeaderColor(index);
                return (
                  <div
                    key={i._id || index}
                    className="snap-start min-w-[290px] sm:min-w-[340px] max-w-[360px] w-full bg-white rounded-2xl shadow-sm border border-slate-200/80 flex-shrink-0 flex flex-col justify-between overflow-hidden hover:shadow-md transition-all duration-300"
                  >
                    {/* Header */}
                    <div className={`${headerColor.bg} px-6 py-4 border-b min-w-0 w-full`}>
                      <h3 className={`font-bold ${headerColor.text} text-[16px] sm:text-[17px] break-words whitespace-normal leading-snug`}>
                        {i.titulo}
                      </h3>
                    </div>

                    {/* Body */}
                    <div className="p-6 min-w-0 w-full flex-1 flex flex-col justify-center">
                      <ul className="text-sm text-slate-600 space-y-3 w-full overflow-hidden">
                        {(i.items || []).map((item, itemIndex) => (
                          <li key={`${item}-${itemIndex}`} className="flex gap-2.5 items-start min-w-0 w-full overflow-hidden">
                            <span className={`mt-[7px] h-1.5 w-1.5 rounded-full ${headerColor.dot} shrink-0`} />
                            <span className="break-words whitespace-normal text-slate-600 leading-relaxed flex-1 min-w-0">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {listaInfraestructura.map((i, index) => {
              const headerColor = obtenerHeaderColor(index);
              return (
                <div
                  key={i._id || index}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  {/* Header */}
                  <div className={`${headerColor.bg} px-4 py-3 sm:px-6 sm:py-4 border-b min-w-0 w-full`}>
                    <h3 className={`font-bold ${headerColor.text} text-[14.5px] sm:text-[17px] break-words whitespace-normal leading-snug`}>
                      {i.titulo}
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="p-4 sm:p-6 min-w-0 w-full flex-1 flex flex-col justify-center">
                    <ul className="text-xs sm:text-sm text-slate-600 space-y-2 sm:space-y-3 w-full overflow-hidden">
                      {(i.items || []).map((item, itemIndex) => (
                        <li key={`${item}-${itemIndex}`} className="flex gap-2.5 items-start min-w-0 w-full overflow-hidden">
                          <span className={`mt-[6px] h-1.5 w-1.5 rounded-full ${headerColor.dot} shrink-0`} />
                          <span className="break-words whitespace-normal text-slate-600 leading-relaxed flex-1 min-w-0">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Ahorro */}
      <section className="bg-slate-100 py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute top-10 left-10 h-72 w-72 rounded-full bg-blue-400/5 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-teal-400/5 blur-[80px]" />

        <div className="max-w-5xl mx-auto px-4 relative">
          <div className="text-center mb-14">
            <SectionLabel>Uso Responsable</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Consejos para el Ahorro de Agua
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              Pequeños hábitos diarios hacen una gran diferencia en la conservación de nuestro recurso hídrico.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {/* En el hogar */}
            <div className="group bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-8 shadow-sm hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.12)] transition-all duration-500 hover:-translate-y-1.5 border border-slate-200/80 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 to-blue-500" />

              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 text-blue-600 shadow-sm group-hover:scale-110 transition duration-500">
                  <IconHome />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">
                    En el Hogar
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wider">Dentro de casa</p>
                </div>
              </div>

              <ul className="space-y-1.5 sm:space-y-2.5 w-full">
                {(data.ahorro?.hogar || []).map((item, index) => (
                  <li key={`${item}-${index}`} className="group/item flex gap-2.5 sm:gap-3.5 items-start min-w-0 w-full overflow-hidden hover:bg-slate-50/80 p-2 sm:p-3 rounded-2xl transition duration-300 border border-transparent hover:border-slate-100 hover:shadow-[0_4px_12px_-5px_rgba(0,0,0,0.05)] cursor-default">
                    <span className="h-5 w-5 sm:h-6 sm:w-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm transition-all duration-300 group-hover/item:bg-gradient-to-br group-hover/item:from-blue-500 group-hover/item:to-indigo-600 group-hover/item:text-white group-hover/item:scale-110 group-hover/item:shadow-md group-hover/item:shadow-blue-200">
                      <IconCheckSimple />
                    </span>
                    <span className="break-words whitespace-normal text-slate-700 text-xs sm:text-[14.5px] leading-relaxed flex-1 min-w-0 transition-transform duration-300 group-hover/item:translate-x-0.5">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* En el Jardín */}
            <div className="group bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-8 shadow-sm hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.12)] transition-all duration-500 hover:-translate-y-1.5 border border-slate-200/80 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />

              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-600 shadow-sm group-hover:scale-110 transition duration-500">
                  <IconLeaf />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">
                    En el Jardín
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wider">Áreas verdes y exteriores</p>
                </div>
              </div>

              <ul className="space-y-1.5 sm:space-y-2.5 w-full">
                {(data.ahorro?.jardin || []).map((item, index) => (
                  <li key={`${item}-${index}`} className="group/item flex gap-2.5 sm:gap-3.5 items-start min-w-0 w-full overflow-hidden hover:bg-slate-50/80 p-2 sm:p-3 rounded-2xl transition duration-300 border border-transparent hover:border-slate-100 hover:shadow-[0_4px_12px_-5px_rgba(0,0,0,0.05)] cursor-default">
                    <span className="h-5 w-5 sm:h-6 sm:w-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm transition-all duration-300 group-hover/item:bg-gradient-to-br group-hover/item:from-emerald-500 group-hover/item:to-teal-600 group-hover/item:text-white group-hover/item:scale-110 group-hover/item:shadow-md group-hover/item:shadow-emerald-200">
                      <IconCheckSimple />
                    </span>
                    <span className="break-words whitespace-normal text-slate-700 text-xs sm:text-[14.5px] leading-relaxed flex-1 min-w-0 transition-transform duration-300 group-hover/item:translate-x-0.5">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}