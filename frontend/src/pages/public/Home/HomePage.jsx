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
    <main className="overflow-x-hidden bg-white text-slate-900">
      {/* HERO */}
      <section
        className="relative min-h-[420px] bg-cover bg-center sm:min-h-[500px] lg:min-h-[620px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-center px-4 sm:min-h-[500px] sm:px-6 lg:min-h-[620px] lg:px-8">
          <div className="max-w-3xl py-16 text-white sm:py-20 lg:py-24">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Agua Potable para Nuestra Comunidad
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-100 sm:mt-6 sm:text-base sm:leading-7 md:text-lg lg:text-xl">
              Gestión responsable y sostenible del recurso hídrico al servicio
              de todos.
            </p>

            <div className="mt-6 sm:mt-8">
              <button
                onClick={() => navigate("/sobre-nosotros")}
                className="btn btn-primary btn-sm px-6 sm:btn-md sm:px-8 lg:btn-lg"
              >
                Conocer más
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="relative z-10 -mt-8 px-4 sm:-mt-10 sm:px-6 lg:-mt-14 lg:px-8 xl:-mt-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {quickAccess.map((item) => (
              <div
                key={item.title}
                onClick={() => navigate(item.path)}
                className="card cursor-pointer border border-slate-100 bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="card-body p-5 sm:p-6">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg text-white sm:h-14 sm:w-14 sm:text-xl ${item.bg}`}
                  >
                    {getIcon(item.icon)}
                  </div>

                  <h3 className="mt-3 text-lg font-semibold sm:mt-4 sm:text-xl">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-500 sm:text-base">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVISOS */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Avisos Destacados
            </h2>

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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {noticesPreview.map((notice, index) => {
                const badge = tipoConfig(notice.tipo);

                return (
                  <div
                    key={notice._id || index}
                    className="card border border-slate-200 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
                  >
                    <div className="card-body p-5 sm:p-6">
                      <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
                        <div
                          className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 font-medium ${badge.className}`}
                        >
                          {badge.icon}
                          <span>{badge.label}</span>
                        </div>

                        <div className="inline-flex items-center gap-2 text-slate-500">
                          <FiCalendar className="text-base" />
                          <span>{notice.date || "Sin fecha"}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold leading-snug sm:text-2xl">
                        {notice.titulo || "Sin título"}
                      </h3>

                      <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
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
      <section className="bg-slate-100 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Nuestra Misión
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:mt-6 sm:text-base lg:text-lg">
              Brindar un servicio de agua potable seguro, continuo y de alta
              calidad a los abonados de Cedral y Dulce Nombre, mediante una
              gestión responsable, eficiente y orientada al bienestar de la
              comunidad y la protección de los recursos hídricos.
            </p>

            <button
              onClick={() => navigate("/sobre-nosotros")}
              className="mt-5 w-fit text-left text-sm font-semibold text-primary transition hover:opacity-80 sm:mt-6 sm:text-base"
            >
              Conocer más sobre nosotros →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {missionCards.map((card) => (
              <div
                key={card.title}
                className="card bg-white shadow-md transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="card-body p-5 sm:p-6">
                  <div className="text-2xl text-primary sm:text-3xl">
                    {getIcon(card.icon)}
                  </div>

                  <h3 className="card-title text-lg sm:text-xl">
                    {card.title}
                  </h3>

                  <p className="text-sm text-slate-500 sm:text-base">
                    {card.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-primary px-5 py-12 text-center text-white shadow-lg sm:rounded-3xl sm:px-8 sm:py-14 lg:px-10 lg:py-20">
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              ¿Necesitas ayuda?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base lg:text-lg">
              Nuestro equipo está disponible para atenderte y orientarte con
              cualquier consulta relacionada con nuestros servicios.
            </p>

            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
              <button
                onClick={() => navigate("/contacto")}
                className="btn border-none bg-white text-primary hover:bg-slate-100"
              >
                Contactar
              </button>

              <button
                onClick={() => navigate("/tramites")}
                className="btn btn-info border-none text-white"
              >
                Ver trámites
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}