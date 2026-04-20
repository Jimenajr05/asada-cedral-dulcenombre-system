import { useEffect, useState } from "react";
import {
  obtenerGestionAgua,
  BASE_URL,
} from "../../../services/gestionAguaService";

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

const SectionLabel = ({ children }) => (
  <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-700">
    {children}
  </span>
);

function ParameterBar({ name, value, range, width }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        <div className="text-sm text-slate-600">
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
    <div className="max-w-5xl mx-auto">
      <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="relative h-[420px] bg-slate-100">
          <img
            src={`${BASE_URL}${fotoSeleccionada.imagen}`}
            alt={data?.titulo || "Análisis de calidad del agua"}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent" />

          <button
            type="button"
            onClick={irAnterior}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow flex items-center justify-center"
            aria-label="Foto anterior"
          >
            <IconChevronLeft />
          </button>

          <button
            type="button"
            onClick={irSiguiente}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow flex items-center justify-center"
            aria-label="Siguiente foto"
          >
            <IconChevronRight />
          </button>

          <div className="absolute top-4 right-4 bg-white/95 text-slate-900 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow">
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
  );
}

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

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <WaterDropBg />

        <div
          className="absolute bottom-0 left-0 right-0 leading-none"
          aria-hidden="true"
        >
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
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
            {data.hero?.title}
          </h1>

          <p className="text-blue-100 text-lg max-w-2xl mx-auto leading-relaxed">
            {data.hero?.subtitle}
          </p>
        </div>
      </section>

      {/* PROCESO */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <SectionLabel>Proceso</SectionLabel>
          <h2 className="text-3xl font-bold mt-3 text-slate-900">
            Proceso del Agua
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {(data.proceso || []).map((p, index) => (
            <div
              key={p._id || index}
              className="bg-white p-6 rounded-xl shadow-sm text-center border border-slate-200"
            >
              <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <IconDrop />
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-2">
                {p.titulo}
              </h3>

              <p className="text-sm text-slate-700 leading-relaxed">
                {p.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CALIDAD */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 px-4">
          <div>
            <SectionLabel>Calidad</SectionLabel>
            <h2 className="text-3xl font-bold text-slate-900 mt-3 mb-6">
              Control de Calidad
            </h2>

            <div className="space-y-6">
              {(data.calidad || []).map((c, index) => (
                <div key={c._id || index} className="flex gap-4">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center shrink-0">
                    <QualityIcon icono={c.icono} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-xl text-slate-900">
                      {c.titulo}
                    </h3>
                    <p className="text-base text-slate-700 leading-relaxed">
                      {c.descripcion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                <IconGauge />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Parámetros de Calidad
                </h3>
                <p className="text-sm text-slate-600">
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

      {/* ANALISIS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <SectionLabel>Análisis</SectionLabel>
          <h2 className="text-3xl font-bold mt-3 text-slate-900">
            Análisis de Calidad del Agua
          </h2>
        </div>

        <AnalisisAguaCard data={data.analisisCalidadAgua} />
      </section>

      {/* AFOROS */}
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
                    <th className="border border-slate-300 px-4 py-3 text-center text-lg font-bold text-slate-900 w-[180px]">
                      Fecha
                    </th>
                    <th className="border border-slate-300 px-4 py-3 text-center text-lg font-bold text-slate-900">
                      Lugar
                    </th>
                    <th className="border border-slate-300 px-4 py-3 text-center text-lg font-bold text-slate-900 w-[200px]">
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
                          className="border border-slate-300 px-4 py-3 text-center align-top text-slate-900 font-medium"
                        >
                          {data.aforos?.fecha}
                        </td>
                      )}

                      <td className="border border-slate-300 px-4 py-3 text-center text-slate-800">
                        {item.lugar}
                      </td>
                      <td className="border border-slate-300 px-4 py-3 text-center text-slate-800">
                        {item.produccion}
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-slate-50">
                    <td
                      colSpan={2}
                      className="border border-slate-300 px-4 py-3 text-center text-xl font-semibold text-slate-900"
                    >
                      Total de l/s
                    </td>
                    <td className="border border-slate-300 px-4 py-3 text-center text-xl font-extrabold text-slate-900">
                      {data.aforos?.total}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* INFRAESTRUCTURA */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <SectionLabel>Infraestructura</SectionLabel>
          <h2 className="text-3xl font-bold mt-3 text-slate-900">
            Infraestructura del Sistema
          </h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {(data.infraestructura || []).map((i, index) => (
            <div
              key={i._id || index}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            >
              <h3 className="font-bold text-slate-900 mb-4 text-lg">
                {i.titulo}
              </h3>

              <ul className="text-sm text-slate-700 space-y-3">
                {(i.items || []).map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`} className="flex gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* AHORRO */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <SectionLabel>Ahorro</SectionLabel>
            <h2 className="text-3xl font-bold mt-3 text-slate-900">
              Consejos para el Ahorro de Agua
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">En el Hogar</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {(data.ahorro?.hogar || []).map((item, index) => (
                  <li key={`${item}-${index}`}>✓ {item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">En el Jardín</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {(data.ahorro?.jardin || []).map((item, index) => (
                  <li key={`${item}-${index}`}>✓ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}