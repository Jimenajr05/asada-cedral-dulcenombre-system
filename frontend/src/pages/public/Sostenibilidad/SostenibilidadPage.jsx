import { useEffect, useRef, useState } from "react";
import { hero, compromiso, pilares } from "./SostenibilidadData";
import { getSostenibilidad } from "../../../services/sostenibilidadService";

/* ─── Íconos ─────────────────────────────────────────── */
const IconShield = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
  </svg>
);

const IconDrop = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" />
  </svg>
);

const IconWrench = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2-2 1.4-3.4z" />
  </svg>
);

const IconHydrant = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-6 h-6"
    aria-hidden="true"
  >
    <path d="M9 21v-6h6v6" />
    <path d="M8 15h8" />
    <path d="M10 9V6a2 2 0 1 1 4 0v3" />
    <path d="M6 9h12v6H6z" />
    <path d="M4 12h2" />
    <path d="M18 12h2" />
  </svg>
);

const IconChevronLeft = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    className="w-6 h-6"
    aria-hidden="true"
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
    aria-hidden="true"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/* ─── Fondo animado ───────────────────────────────────── */
const FloatingBg = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -left-20 top-32 h-72 w-72 rounded-full bg-white/10 animate-floatSlow" />
    <div className="absolute left-1/3 top-10 h-72 w-72 rounded-full bg-white/10 animate-floatMedium" />
    <div className="absolute right-[-80px] top-[-40px] h-[24rem] w-[24rem] rounded-full bg-white/10 animate-floatSlow" />
  </div>
);

const SectionLabel = ({ children }) => (
  <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-green-50 text-green-700">
    {children}
  </span>
);

const pillarIcons = [IconShield, IconDrop, IconWrench];

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const construirUrlImagen = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

const GallerySection = ({ title, description, images = [], total = null }) => {
  const scrollRef = useRef(null);

  const scrollGallery = (direction) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const amount = container.clientWidth * 0.8;

    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <SectionLabel>Galería</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3 mb-4">
            {title}
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          {total && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <IconHydrant />
              <span>{total}</span>
            </div>
          )}
        </div>

        <div className="relative group">
          <button
            type="button"
            onClick={() => scrollGallery("left")}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-3 text-slate-700 shadow-lg border border-slate-200 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-105 hover:bg-white"
            aria-label={`Ver imágenes anteriores de ${title}`}
          >
            <IconChevronLeft />
          </button>

          <button
            type="button"
            onClick={() => scrollGallery("right")}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-3 text-slate-700 shadow-lg border border-slate-200 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-105 hover:bg-white"
            aria-label={`Ver imágenes siguientes de ${title}`}
          >
            <IconChevronRight />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
          >
            {images.map((image, index) => (
              <div
                key={`${image.alt || "imagen"}-${index}`}
                className="min-w-[280px] sm:min-w-[320px] md:min-w-[340px] snap-start group/card overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm flex-shrink-0"
              >
                <div className="h-72 overflow-hidden">
                  <img
                    src={construirUrlImagen(image.src)}
                    alt={image.alt || "Imagen de galería"}
                    className="h-full w-full object-cover transition duration-500 group-hover/card:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-600">
                    {image.alt || "Imagen de galería"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function SustainabilityPage() {
  const [galeriasData, setGaleriasData] = useState({
    culturaHidrica: {
      title: "Actividades de Cultura Hídrica",
      description: "",
      images: [],
    },
    mantenimiento: {
      title: "Mantenimiento de Estructuras",
      description: "",
      images: [],
    },
    hidrantes: {
      title: "Hidrantes Instalados",
      description: "",
      total: "",
      images: [],
    },
  });

  useEffect(() => {
    const cargarSostenibilidad = async () => {
      try {
        const data = await getSostenibilidad();

        setGaleriasData(
          data.galerias || {
            culturaHidrica: {
              title: "Actividades de Cultura Hídrica",
              description: "",
              images: [],
            },
            mantenimiento: {
              title: "Mantenimiento de Estructuras",
              description: "",
              images: [],
            },
            hidrantes: {
              title: "Hidrantes Instalados",
              description: "",
              total: "",
              images: [],
            },
          }
        );
      } catch (error) {
        console.error("Error al cargar sostenibilidad:", error);
      }
    };

    cargarSostenibilidad();
  }, []);

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900">
        <FloatingBg />
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-sky-500/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />

        <div className="absolute bottom-0 left-0 right-0 leading-none" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block w-full h-20">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L0,80Z" fill="#f8fafc" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 text-center">
          <span className="section-badge bg-sky-500/20 border border-sky-400/30 text-sky-300 mb-5">
            Medio ambiente
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-white mb-5" style={{ fontFamily: "var(--font-display)" }}>
            {hero.title}
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-2xl mx-auto">
            {hero.subtitle}
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionLabel>Compromiso ambiental</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3 mb-6">
            {compromiso.title}
          </h2>
          <p className="text-slate-600 leading-relaxed max-w-4xl mx-auto">
            {compromiso.text}
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {pilares.map((item, index) => {
            const Icon = pillarIcons[index];
            const colors = [
              "bg-green-100 text-green-700",
              "bg-blue-100 text-blue-700",
              "bg-violet-100 text-violet-700",
            ];

            return (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-slate-100 shadow-sm p-7 text-center"
              >
                <div
                  className={`mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center ${colors[index]}`}
                >
                  <Icon />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <GallerySection
        title={galeriasData.culturaHidrica?.title}
        description={galeriasData.culturaHidrica?.description}
        images={galeriasData.culturaHidrica?.images || []}
      />

      <section className="bg-white">
        <GallerySection
          title={galeriasData.mantenimiento?.title}
          description={galeriasData.mantenimiento?.description}
          images={galeriasData.mantenimiento?.images || []}
        />
      </section>

      <GallerySection
        title={galeriasData.hidrantes?.title}
        description={galeriasData.hidrantes?.description}
        total={galeriasData.hidrantes?.total}
        images={galeriasData.hidrantes?.images || []}
      />
    </div>
  );
}