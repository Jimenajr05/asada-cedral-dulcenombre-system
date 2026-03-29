import { useEffect, useMemo, useState } from "react";
import { Target, Eye, Heart, Users } from "lucide-react";
import { getPublicContenidos } from "../../services/publicContentService";

function About() {
  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarContenidos = async () => {
      try {
        setLoading(true);
        const data = await getPublicContenidos("about");
        setContenidos(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    cargarContenidos();
  }, []);

  const getContenido = (slug) => {
    return contenidos.find((item) => item.slug === slug);
  };

  const hero = getContenido("about-hero");
  const historia = getContenido("historia");
  const mision = getContenido("mision");
  const vision = getContenido("vision");
  const valores = getContenido("valores");
  const junta = getContenido("junta-directiva");

  const listaValores = useMemo(() => {
    if (!valores?.contenido) return [];
    return valores.contenido
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [valores]);

  const miembrosJunta = useMemo(() => {
    if (!junta?.contenido) return [];

    return junta.contenido
      .split("\n")
      .map((linea) => linea.trim())
      .filter(
        (linea) =>
          linea &&
          !linea.toUpperCase().includes("JUNTA DIRECTIVA") &&
          linea.includes("|")
      )
      .map((linea) => {
        const [nombre, cargo] = linea.split("|");
        return {
          nombre: nombre?.trim() || "",
          cargo: cargo?.trim() || "",
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
          <h1 className="text-5xl font-bold md:text-6xl">
            {hero?.titulo || "Sobre Nosotros"}
          </h1>
          <p className="mt-5 text-2xl text-blue-50">
            {hero?.contenido || "Conoce nuestra historia, misión y valores"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-16">
          <h2 className="mb-8 text-center text-4xl font-bold text-slate-900">
            {historia?.titulo || "Nuestra Historia"}
          </h2>

          <div className="rounded-2xl bg-white p-10 shadow-sm">
            <div className="whitespace-pre-line text-xl leading-10 text-slate-700">
              {historia?.contenido || "No hay información histórica disponible."}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
              <Target className="h-10 w-10 text-blue-600" />
            </div>

            <h3 className="mb-5 text-4xl font-bold text-slate-900">
              {mision?.titulo || "Misión"}
            </h3>

            <p className="text-xl leading-10 text-slate-700">
              {mision?.contenido || "Sin contenido disponible."}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <Eye className="h-10 w-10 text-green-600" />
            </div>

            <h3 className="mb-5 text-4xl font-bold text-slate-900">
              {vision?.titulo || "Visión"}
            </h3>

            <p className="text-xl leading-10 text-slate-700">
              {vision?.contenido || "Sin contenido disponible."}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
              <Heart className="h-10 w-10 text-purple-600" />
            </div>

            <h3 className="mb-5 text-4xl font-bold text-slate-900">
              {valores?.titulo || "Valores"}
            </h3>

            {listaValores.length > 0 ? (
              <ul className="space-y-3 text-xl leading-9 text-slate-700">
                {listaValores.map((valor, index) => (
                  <li key={index}>• {valor}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xl leading-10 text-slate-700">
                Sin contenido disponible.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="mb-10 text-center text-4xl font-bold text-slate-900">
          {junta?.titulo || "Junta Directiva"}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {miembrosJunta.length > 0 ? (
            miembrosJunta.map((miembro, index) => (
              <div
                key={index}
                className="rounded-2xl bg-white p-8 text-center shadow-sm"
              >
                <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-slate-100">
                  <Users className="h-14 w-14 text-slate-400" />
                </div>

                <h3 className="text-3xl font-semibold text-slate-900">
                  {miembro.nombre}
                </h3>
                <p className="mt-2 text-xl text-slate-600">{miembro.cargo}</p>
              </div>
            ))
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