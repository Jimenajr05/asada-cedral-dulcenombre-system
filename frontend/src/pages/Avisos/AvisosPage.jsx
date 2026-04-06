import { useMemo, useState } from "react";
import {
  FiBell,
  FiCalendar,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
} from "react-icons/fi";

const avisosData = [
  {
    id: 1,
    tipo: "urgente",
    fecha: "9 de febrero de 2026",
    titulo: "Corte de agua programado - Sector Norte",
    descripcion:
      "Se realizarán trabajos de mantenimiento en la red de distribución del Sector Norte el próximo domingo 15 de febrero de 8:00 AM a 2:00 PM. Agradecemos su comprensión.",
    destacado: true,
  },
  {
    id: 2,
    tipo: "informacion",
    fecha: "4 de febrero de 2026",
    titulo: "Nuevos horarios de atención al público",
    descripcion:
      "A partir del 15 de febrero, el horario de atención al público será de lunes a viernes de 8:00 AM a 4:00 PM. Sábados y domingos cerrado.",
    destacado: false,
  },
  {
    id: 3,
    tipo: "informacion",
    fecha: "31 de enero de 2026",
    titulo: "Campaña de ahorro de agua 2026",
    descripcion:
      "Los invitamos a participar en nuestra campaña comunitaria de ahorro y uso responsable del agua. Talleres gratuitos todos los martes a las 6:00 PM.",
    destacado: false,
  },
  {
    id: 4,
    tipo: "completado",
    fecha: "27 de enero de 2026",
    titulo: "Finalización obras Sector Centro",
    descripcion:
      "Se han finalizado exitosamente las obras de renovación de tuberías en el Sector Centro. El servicio ha sido normalizado completamente.",
    destacado: false,
  },
  {
    id: 5,
    tipo: "urgente",
    fecha: "24 de enero de 2026",
    titulo: "Presión baja de agua - Zona Alta",
    descripcion:
      "Estamos trabajando en solucionar el problema de presión baja en la Zona Alta. Se espera normalización en las próximas 48 horas.",
    destacado: false,
  },
];

/* ─── Fondo decorativo del hero ─────────────────────── */
const WaterDropBg = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 800 400">
    <circle cx="660" cy="70" r="200" fill="white" />
    <circle cx="100" cy="330" r="130" fill="white" />
    <circle cx="390" cy="210" r="80" fill="white" />
  </svg>
);

const filtros = [
  { key: "todos", label: "Todos" },
  { key: "urgente", label: "Urgentes" },
  { key: "informacion", label: "Información" },
  { key: "completado", label: "Completados" },
];

function tipoConfig(tipo) {
  switch (tipo) {
    case "urgente":
      return {
        label: "Urgente",
        icon: <FiAlertCircle className="text-base" />,
        pill: "bg-red-100 text-red-700 border border-red-200",
        activeButton: "bg-red-600 text-white hover:bg-red-700",
      };
    case "informacion":
      return {
        label: "Información",
        icon: <FiInfo className="text-base" />,
        pill: "bg-blue-100 text-blue-700 border border-blue-200",
        activeButton: "bg-blue-600 text-white hover:bg-blue-700",
      };
    case "completado":
      return {
        label: "Completado",
        icon: <FiCheckCircle className="text-base" />,
        pill: "bg-green-100 text-green-700 border border-green-200",
        activeButton: "bg-green-600 text-white hover:bg-green-700",
      };
    default:
      return {
        label: "Aviso",
        icon: <FiBell className="text-base" />,
        pill: "bg-slate-100 text-slate-700 border border-slate-200",
        activeButton: "bg-blue-600 text-white hover:bg-blue-700",
      };
  }
}

function FiltroButton({ filtro, activo, onClick }) {
  const config = tipoConfig(filtro.key);

  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-5 py-3 text-base font-semibold transition ${
        activo
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
  const config = tipoConfig(aviso.tipo);

  return (
    <article
      className={`rounded-2xl bg-white p-6 shadow-md ${
        destacado ? "border-2 border-blue-500" : "border border-slate-200"
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
          {aviso.fecha}
        </span>
      </div>

      <h3 className="mb-4 text-2xl font-bold leading-snug text-slate-900">
        {aviso.titulo}
      </h3>

      <p className="text-lg leading-8 text-slate-700">{aviso.descripcion}</p>
    </article>
  );
}

export default function Avisos() {
  const [filtroActivo, setFiltroActivo] = useState("todos");

  const avisosFiltrados = useMemo(() => {
    if (filtroActivo === "todos") {
      return avisosData;
    }

    return avisosData.filter((aviso) => aviso.tipo === filtroActivo);
  }, [filtroActivo]);

  const avisoDestacado = avisosFiltrados.find((aviso) => aviso.destacado);
  const avisosNormales = avisosFiltrados.filter((aviso) => !aviso.destacado);

  return (
    <main className="bg-slate-50 text-slate-900">
      {/* HERO ESTILO RESTO DE PÁGINAS */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <WaterDropBg />

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
            <span className="text-white font-medium">Avisos</span>
          </div>

          <div className="flex justify-center mb-5 text-white">
            <FiBell className="text-5xl sm:text-6xl" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
            Avisos Importantes
          </h1>

          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            Mantente informado sobre nuestros servicios y actividades
          </p>
        </div>
      </section>

      {/* FILTROS */}
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

      {/* LISTA DE AVISOS */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="space-y-8">
          {avisoDestacado && <AvisoCard aviso={avisoDestacado} destacado />}

          {avisosNormales.map((aviso) => (
            <AvisoCard key={aviso.id} aviso={aviso} />
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

      {/* SUSCRIPCIÓN */}
      <section className="pb-16 pt-4 sm:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-12 text-center text-white shadow-lg sm:px-10">
            <div className="mb-4 flex justify-center">
              <FiBell className="text-5xl" />
            </div>

            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Recibe avisos en tu correo
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Suscríbete para recibir notificaciones sobre cortes de agua,
              mantenimientos y más
            </p>

            <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <input
                type="email"
                placeholder="tu@email.com"
                className="h-14 w-full rounded-2xl border-0 bg-white px-5 text-base text-slate-700 outline-none placeholder:text-slate-400"
              />

              <button className="h-14 rounded-2xl bg-white px-8 text-base font-semibold text-blue-600 transition hover:bg-slate-100">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}