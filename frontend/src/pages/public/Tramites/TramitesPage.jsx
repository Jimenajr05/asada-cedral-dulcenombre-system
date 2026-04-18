import { useEffect, useMemo, useState } from "react";
import {
  hero,
  formasPago,
  ayuda,
  recibos,
  notaLegal,
  sinpeMovilInfo,
} from "./TramitesData";
import { getTramites } from "../../../services/tramiteService";

/* ─── Fondo decorativo ───────────────────────── */
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

/* ─── Iconos ─────────────────────────────────── */
const IconFile = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5"
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
    className="h-5 w-5"
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
    className="h-5 w-5"
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
    className="h-6 w-6"
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
    className="h-5 w-5"
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
    className="h-5 w-5"
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
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const IconSearch = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const paymentIcons = [
  IconCard,
  IconBank,
  IconBank,
  IconBank,
  IconBank,
  IconCard,
];

export default function TramitesPage() {
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const construirUrlArchivo = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  useEffect(() => {
    const cargarTramites = async () => {
      try {
        setLoading(true);
        const data = await getTramites();
        setTramites(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al cargar trámites:", error);
        setTramites([]);
      } finally {
        setLoading(false);
      }
    };

    cargarTramites();
  }, []);

  const tramitesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return tramites;

    return tramites.filter((tramite) => {
      const titulo = tramite.titulo?.toLowerCase() || "";
      const requisitos = Array.isArray(tramite.requisitos)
        ? tramite.requisitos.map((r) => r.texto?.toLowerCase() || "").join(" ")
        : "";

      return titulo.includes(texto) || requisitos.includes(texto);
    });
  }, [tramites, busqueda]);

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <WaterDropBg />

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="h-20 w-full"
          >
            <path
              d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L0,80Z"
              fill="#f8fafc"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-16 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-white sm:text-5xl">
            {hero.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-blue-100">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* TRÁMITES DINÁMICOS */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800">
            Trámites disponibles
          </h2>
          <p className="mt-2 text-slate-600">
            Consulte los requisitos y descargue el formulario correspondiente.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Resultados</p>
            <p className="text-lg font-semibold text-slate-800">
              {tramitesFiltrados.length} trámite
              {tramitesFiltrados.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="relative w-full md:max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <IconSearch />
            </span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar trámite o requisito..."
              className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Cargando trámites...
          </div>
        ) : tramites.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No hay trámites disponibles en este momento.
          </div>
        ) : tramitesFiltrados.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            No se encontraron trámites con esa búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {tramitesFiltrados.map((t) => (
              <article
                key={t._id}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <IconFile />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-2xl font-bold leading-tight text-slate-800">
                      {t.titulo}
                    </h3>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                    Requisitos
                  </p>
                </div>

                <div className="mb-6 min-h-[180px] flex-1 rounded-2xl bg-slate-50 p-4">
                  {Array.isArray(t.requisitos) && t.requisitos.length > 0 ? (
                    <ul className="max-h-56 space-y-3 overflow-y-auto pr-2 text-sm text-slate-700">
                      {t.requisitos.map((r, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                          <span className="leading-relaxed">{r.texto}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Sin requisitos registrados.
                    </p>
                  )}
                </div>

                {t.archivoUrl ? (
                  <a
                    href={construirUrlArchivo(t.archivoUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto block w-full rounded-2xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                  >
                    Descargar Formulario
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-auto w-full cursor-not-allowed rounded-2xl bg-slate-300 py-3 font-semibold text-slate-600"
                  >
                    Formulario no disponible
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* NOTA LEGAL */}
      <section className="mx-auto max-w-5xl px-4 pb-8">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-relaxed text-slate-700">
          <span className="font-semibold text-blue-700">
            {notaLegal.title}:
          </span>{" "}
          {notaLegal.text}
        </div>
      </section>

      {/* FORMAS DE PAGO */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="mb-10 text-3xl font-bold text-slate-800">
          Formas de Pago
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {formasPago.map((p, i) => {
            const Icon = paymentIcons[i] || IconCard;

            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Icon />
                </div>

                <h3 className="font-semibold text-slate-800">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{p.detail}</p>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  {p.extra}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SINPE MÓVIL */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800">
              {sinpeMovilInfo.title}
            </h2>
            <p className="mt-2 text-slate-600">
              Siga estos pasos para cancelar su recibo correctamente.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {sinpeMovilInfo.pasos.map((paso, index) => (
              <div
                key={index}
                className="rounded-2xl border border-green-200 bg-green-50 p-6 text-left"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-700 text-xl font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{paso}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSULTA DE RECIBOS */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 text-left md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                <IconReceipt />
              </div>

              <div>
                <h3 className="mb-2 text-xl font-bold text-slate-800">
                  {recibos.title}
                </h3>
                <p className="max-w-2xl leading-relaxed text-slate-600">
                  {recibos.text}
                </p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <a
                href={recibos.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow transition hover:bg-blue-700"
              >
                {recibos.linkLabel}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AYUDA */}
      <section className="mx-auto max-w-4xl px-4 pb-20 pt-16">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-10 text-center text-white shadow-sm">
          <h3 className="mb-2 text-2xl font-bold">{ayuda.title}</h3>
          <p className="mx-auto mb-6 max-w-2xl text-blue-100">{ayuda.text}</p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-blue-700 transition hover:bg-blue-50">
              <IconPhone />
              <span>{ayuda.primaryText}</span>
            </button>

            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium transition hover:bg-blue-400">
              <IconMail />
              <span>{ayuda.secondaryText}</span>
            </button>
          </div>
        </div>
      </section>

      {/* RECORDATORIO */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <IconInfo />
          </div>
          <div>
            <p className="mb-1 font-semibold text-slate-800">Recordatorio</p>
            <p className="text-sm leading-relaxed text-slate-600">
              Antes de presentar un trámite, verifica que la documentación esté
              completa, actualizada y que el propietario o solicitante se
              encuentre al día con sus obligaciones ante la ASADA.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}