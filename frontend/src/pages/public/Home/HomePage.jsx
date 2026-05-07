import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaBell,
  FaPhoneAlt,
  FaWrench,
  FaTint,
  FaLeaf,
} from "react-icons/fa";
import { FiAlertCircle, FiInfo, FiCheckCircle, FiCalendar } from "react-icons/fi";
import { quickAccess, missionCards } from "./HomeData";

function getIcon(icon) {
  switch (icon) {
    case "file":
      return <FaFileAlt />;
    case "bell":
      return <FaBell />;
    case "phone":
      return <FaPhoneAlt />;
    case "wrench":
      return <FaWrench />;
    case "tint":
      return <FaTint />;
    case "leaf":
      return <FaLeaf />;
    default:
      return null;
  }
}

function tipoConfig(tipo) {
  switch (tipo) {
    case "urgente":
      return {
        label: "Urgente",
        icon: <FiAlertCircle className="text-base" />,
        className: "border border-red-200 bg-red-100 text-red-700",
      };
    case "info":
      return {
        label: "Información",
        icon: <FiInfo className="text-base" />,
        className: "border border-blue-200 bg-blue-100 text-blue-700",
      };
    case "completado":
      return {
        label: "Completado",
        icon: <FiCheckCircle className="text-base" />,
        className: "border border-green-200 bg-green-100 text-green-700",
      };
    default:
      return {
        label: "Aviso",
        icon: <FaBell className="text-base" />,
        className: "border border-slate-200 bg-slate-100 text-slate-700",
      };
  }
}

export default function HomePage() {
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [errorNotices, setErrorNotices] = useState("");

  useEffect(() => {
    const obtenerAvisos = async () => {
      try {
        setLoadingNotices(true);
        setErrorNotices("");

        const response = await fetch("http://localhost:4000/api/avisos");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Error al obtener los avisos");
        }

        const avisosFormateados = Array.isArray(data)
          ? data.map((aviso) => ({
            ...aviso,
            date: aviso.createdAt
              ? new Date(aviso.createdAt).toLocaleDateString("es-CR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
              : "Sin fecha",
            desc: aviso.descripcion,
            tipo: aviso.tipo,
          }))
          : [];

        setNotices(avisosFormateados);
      } catch (error) {
        console.error("Error cargando avisos en Home:", error);
        setErrorNotices(error.message || "No se pudieron cargar los avisos");
      } finally {
        setLoadingNotices(false);
      }
    };

    obtenerAvisos();
  }, []);

  const noticesPreview = useMemo(() => {
    return notices.slice(0, 3);
  }, [notices]);

  return (
    <main className="overflow-x-hidden bg-white text-slate-900" style={{ fontFamily: "var(--font-body)" }}>
      {/* HERO */}
      <section
        className="relative min-h-[520px] bg-cover bg-center lg:min-h-[680px] overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        {/* Overlay con gradiente direccional */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-6 lg:min-h-[680px] lg:px-8">
          <div className="max-w-2xl py-20 text-white animate-fade-up">
            <span className="section-badge mb-6 bg-sky-500/20 border border-sky-400/30 text-sky-300">
              ASADA Cedral y Dulce Nombre
            </span>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
              Agua Potable para{" "}
              <span className="text-gradient-water">Nuestra Comunidad</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Gestión responsable y sostenible del recurso hídrico al servicio de todos, con transparencia y compromiso comunitario.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/sobre-nosotros")}
                className="btn-glow inline-flex items-center gap-2 rounded-xl bg-sky-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg"
              >
                Conocer más
              </button>
              <button
                onClick={() => navigate("/contacto")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Contacto
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="relative z-10 -mt-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickAccess.map((item) => (
              <div
                key={item.title}
                onClick={() => navigate(item.path)}
                className="card-hover cursor-pointer rounded-2xl border border-white/60 bg-white/90 shadow-xl shadow-slate-200/60 backdrop-blur-sm group"
              >
                <div className="p-6">
                  <div
                    className={`flex h-13 w-13 items-center justify-center rounded-xl text-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2 ${item.bg}`}
                    style={{ height: 52, width: 52 }}
                  >
                    {getIcon(item.icon)}
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    {item.subtitle}
                  </p>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVISOS */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-badge bg-sky-50 text-sky-600">Noticias</span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                Avisos Destacados
              </h2>
            </div>

            <button
              onClick={() => navigate("/avisos")}
              className="w-fit text-left text-sm font-semibold text-primary transition hover:opacity-80 sm:text-base"
            >
              Ver todos →
            </button>
          </div>

          {loadingNotices && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-slate-600">Cargando avisos...</p>
            </div>
          )}

          {!loadingNotices && errorNotices && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
              <p className="text-red-600">{errorNotices}</p>
            </div>
          )}

          {!loadingNotices && !errorNotices && noticesPreview.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {noticesPreview.map((notice, index) => {
                const badge = tipoConfig(notice.tipo);

                return (
                  <div
                    key={notice._id || index}
                    className="card-hover rounded-2xl border border-slate-100 bg-white shadow-md group overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="mb-5 flex flex-wrap items-center gap-3">
                        <div
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badge.className}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <FiCalendar />
                          <span>{notice.date || "Sin fecha"}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-sky-700 transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                        {notice.titulo || "Sin título"}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-slate-500 line-clamp-3">
                        {notice.desc || "Sin descripción"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loadingNotices && !errorNotices && noticesPreview.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-slate-600">No hay avisos disponibles.</p>
            </div>
          )}
        </div>
      </section>

      {/* MISIÓN */}
      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-2 items-center">
          <div>
            <span className="section-badge bg-sky-50 text-sky-600">Identidad</span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
              Nuestra Misión
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-600 max-w-lg">
              Brindar un servicio de agua potable seguro, continuo y de alta
              calidad a los abonados de Cedral y Dulce Nombre, mediante una
              gestión responsable, eficiente y orientada al bienestar de la
              comunidad y la protección de los recursos hídricos.
            </p>

            <button
              onClick={() => navigate("/sobre-nosotros")}
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-sky-600 transition-all hover:gap-3"
            >
              Conocer más sobre nosotros <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {missionCards.map((card) => (
              <div
                key={card.title}
                className="card-hover rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl text-sky-600">
                  {getIcon(card.icon)}
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                  {card.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center text-white shadow-2xl lg:px-20">
            {/* Glow blobs */}
            <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-sky-500/20 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-teal-500/20 blur-[80px]" />
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                ¿Necesitas ayuda?
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300">
                Nuestro equipo está disponible para atenderte y orientarte con
                cualquier consulta relacionada con nuestros servicios.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate("/contacto")}
                  className="btn-glow inline-flex items-center gap-2 rounded-xl bg-sky-500 px-8 py-3.5 text-sm font-bold text-white"
                >
                  Contactar ahora
                </button>

                <button
                  onClick={() => navigate("/tramites")}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Ver trámites
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}