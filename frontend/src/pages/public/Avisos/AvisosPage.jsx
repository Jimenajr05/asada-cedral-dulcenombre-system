import { useEffect, useMemo, useState } from "react";
import {
  FiBell,
  FiCalendar,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";

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
      className={`rounded-xl px-5 py-3 text-base font-semibold transition ${activo
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

  return (
    <article
      className={`rounded-2xl bg-white p-6 shadow-md ${destacado ? "border-2 border-blue-500" : "border border-slate-200"
        }`}
    >
      {destacado && (
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-600">
          <FiBell className="text-base" />
          <span>Aviso Destacado</span>
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-medium ${config.pill}`}
        >
          {config.icon}
          {config.label}
        </span>

        <span className="inline-flex items-center gap-2 text-slate-500">
          <FiCalendar className="text-base" />
          {aviso?.fechaFormateada || "Sin fecha"}
        </span>
      </div>

      <h3 className="mb-4 text-2xl font-bold leading-snug text-slate-900">
        {aviso?.titulo || "Sin título"}
      </h3>

      <p className="text-lg leading-8 text-slate-700">
        {aviso?.descripcion || "Sin descripción"}
      </p>
    </article>
  );
}

export default function AvisosPage() {
  const [avisosData, setAvisosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("todos");

  useEffect(() => {
    const obtenerAvisos = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:4000/api/avisos");
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

  const avisosFiltrados = useMemo(() => {
    if (filtroActivo === "todos") {
      return avisosData;
    }

    return avisosData.filter((aviso) => aviso?.tipo === filtroActivo);
  }, [avisosData, filtroActivo]);

  const avisoDestacado = avisosFiltrados.find((aviso) => aviso?.fijado);

  const avisosNormales = useMemo(() => {
    if (!avisoDestacado) return avisosFiltrados;
    return avisosFiltrados.filter((aviso) => aviso?._id !== avisoDestacado._id);
  }, [avisosFiltrados, avisoDestacado]);

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
          <h1 className="mt-4 mb-5 text-4xl font-extrabold text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Avisos Importantes
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-blue-100">
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
            {avisoDestacado && <AvisoCard aviso={avisoDestacado} destacado />}

            {avisosNormales.map((aviso) => (
              <AvisoCard key={aviso._id} aviso={aviso} />
            ))}

            {!avisoDestacado && avisosNormales.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <p className="text-lg text-slate-600">
                  No hay avisos disponibles para esta categoría.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}