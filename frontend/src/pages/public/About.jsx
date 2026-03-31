import { useEffect, useMemo, useState } from "react";
import { Target, Eye, Heart, Users } from "lucide-react";
import { getPublicContenidos } from "../../services/publicContentService";
import { getFotos } from "../../services/fotoService";

function About() {
  const [contenidos, setContenidos] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const cargarInformacion = async () => {
      try {
        setLoading(true);

        const [dataContenidos, dataFotos] = await Promise.all([
          getPublicContenidos("about"),
          getFotos(),
        ]);

        setContenidos(Array.isArray(dataContenidos) ? dataContenidos : []);
        setFotos(Array.isArray(dataFotos) ? dataFotos : []);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarInformacion();
  }, []);

  const getContenido = (slug) => {
    return contenidos.find((item) => item.slug === slug);
  };

  const construirUrlImagen = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  const getFotoMiembro = (claveFoto) => {
    if (!claveFoto) return null;
    return fotos.find((foto) => foto.seccion === claveFoto) || null;
  };

  const junta = getContenido("junta-directiva");

  const miembrosJunta = useMemo(() => {
    if (!junta?.contenido) return [];

    return junta.contenido
      .split("\n")
      .map((linea) => linea.trim())
      .filter((linea) => linea && linea.includes("|"))
      .map((linea) => {
        const [nombre, cargo, claveFoto] = linea.split("|");

        return {
          nombre: nombre?.trim() || "",
          cargo: cargo?.trim() || "",
          claveFoto: claveFoto?.trim() || "",
        };
      });
  }, [junta]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-16">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-10 shadow-sm">
          <p className="text-slate-500">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100">
      <section className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-5xl font-bold md:text-6xl">Sobre Nosotros</h1>
          <p className="mt-5 text-2xl text-blue-50">
            Conoce nuestra historia, misión, visión, valores y junta directiva
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold text-slate-900">
            Reseña Histórica
          </h2>

          <div className="rounded-2xl bg-white p-10 shadow-sm">
            <div className="space-y-6 text-xl leading-10 text-slate-700">
              <p>
                La ASADA Cedral y Dulce Nombre nació ante la necesidad de
                garantizar el acceso al agua potable en ambas comunidades. Inició
                operaciones el 8 de diciembre de 1990 con la conformación del
                primer comité de agua, integrado por vecinos comprometidos con
                el desarrollo local. En ese momento se contaba con 217 abonados,
                se realizó el primer cobro del servicio y se contrató al primer
                fontanero. Ese mismo año se adquirió el terreno para la futura
                oficina administrativa.
              </p>

              <p>
                La consolidación oficial del acueducto se logró el 8 de julio de
                1998, con la participación de 60 socios constitutivos y el
                acompañamiento técnico del Instituto Costarricense de Acueductos
                y Alcantarillados (AyA). Posteriormente, el 5 de agosto de 2005,
                el MINAE otorgó la concesión de la naciente que abastece el
                sistema, ubicada en las cercanías de San Gerardo de Ciudad
                Quesada.
              </p>

              <p>
                El sistema opera totalmente por gravedad, tanto en conducción
                como en distribución. Cuenta con una fuente que actualmente
                produce 46,19 l/s (según aforo de noviembre 2021), tres tanques
                de almacenamiento con capacidad aproximada de 1 027 m³, 10
                quiebra gradientes, una línea de conducción de 7 691,97 metros y
                una red de distribución de 43 938,38 metros.
              </p>

              <p>
                Actualmente, la ASADA brinda servicio a 1 912 abonados de las
                comunidades de Cedral y Dulce Nombre, en el distrito de
                Quesada, cantón de San Carlos, provincia de Alajuela. La zona
                cuenta con infraestructura básica, servicios públicos, centros
                educativos y de salud, y su economía se basa principalmente en
                la agricultura, la ganadería, el comercio y el turismo.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Target className="h-10 w-10 text-blue-600" />
            </div>

            <h3 className="mb-5 text-4xl font-bold text-slate-900">Misión</h3>

            <p className="text-xl leading-10 text-slate-700">
              Brindar un servicio de agua potable seguro, continuo y de alta
              calidad a los abonados de Cedral y Dulce Nombre, mediante una
              gestión responsable, eficiente y orientada al bienestar de la
              comunidad y la protección de los recursos hídricos.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Eye className="h-10 w-10 text-green-600" />
            </div>

            <h3 className="mb-5 text-4xl font-bold text-slate-900">Visión</h3>

            <p className="text-xl leading-10 text-slate-700">
              Ser una ASADA líder en San Carlos por su excelencia en gestión
              administrativa y operativa, destacando por la innovación, la
              calidad del servicio al usuario y la sostenibilidad en la
              administración del recurso hídrico.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
              <Heart className="h-10 w-10 text-purple-600" />
            </div>

            <h3 className="mb-5 text-4xl font-bold text-slate-900">Valores</h3>

            <ul className="space-y-3 text-xl leading-9 text-slate-700">
              <li>• Responsabilidad</li>
              <li>• Transparencia</li>
              <li>• Vocación de Servicio</li>
              <li>• Trabajo en Equipo</li>
              <li>• Eficiencia</li>
              <li>• Sostenibilidad Ambiental</li>
            </ul>

            <p className="mt-5 text-xl leading-10 text-slate-700">
              Como principios fundamentales que guían la gestión de la ASADA y
              el actuar de todos sus colaboradores, asegurando un servicio
              comprometido, ético y orientado al bienestar de la comunidad y la
              protección del recurso hídrico.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="mb-3 text-center text-4xl font-bold text-slate-900">
          Junta Directiva
        </h2>

        <p className="mb-10 text-center text-xl text-slate-600">
          Nombrada por el período 2025-2029
        </p>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {miembrosJunta.length > 0 ? (
            miembrosJunta.map((miembro, index) => {
              const fotoMiembro = getFotoMiembro(miembro.claveFoto);

              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-8 text-center shadow-sm"
                >
                  <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                    {fotoMiembro?.url ? (
                      <img
                        src={construirUrlImagen(fotoMiembro.url)}
                        alt={miembro.nombre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Users className="h-14 w-14 text-slate-400" />
                    )}
                  </div>

                  <h3 className="text-3xl font-semibold text-slate-900">
                    {miembro.nombre}
                  </h3>
                  <p className="mt-2 text-xl text-slate-600">{miembro.cargo}</p>
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
              No hay información de junta directiva disponible.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default About;