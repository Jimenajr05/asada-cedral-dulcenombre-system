import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Save,
  RotateCcw,
  Plus,
  CheckSquare,
  Trash2,
} from "lucide-react";
import {
  getContenidos,
  createContenido,
  updateContenido,
  toggleContenidoActivo,
  deleteContenido,
} from "../../services/contenidoService";

const paginas = [
  { value: "home", label: "Inicio" },
  { value: "about", label: "Sobre Nosotros" },
  { value: "gestion-agua", label: "Gestión del Agua" },
  { value: "sostenibilidad", label: "Sostenibilidad" },
  { value: "tramites", label: "Trámites" },
  { value: "avisos", label: "Avisos" },
  { value: "contacto", label: "Contacto" },
];

const seccionesPorPagina = {
  about: [{ slug: "junta-directiva", titulo: "Junta Directiva" }],
  home: [
    { slug: "home-hero", titulo: "Hero Inicio" },
    { slug: "home-bienvenida", titulo: "Bienvenida" },
  ],
  "gestion-agua": [
    { slug: "gestion-agua-hero", titulo: "Hero Gestión del Agua" },
    { slug: "gestion-agua-info", titulo: "Información General" },
  ],
  sostenibilidad: [
    { slug: "sostenibilidad-hero", titulo: "Hero Sostenibilidad" },
    { slug: "sostenibilidad-info", titulo: "Información General" },
  ],
  tramites: [
    { slug: "tramites-hero", titulo: "Hero Trámites" },
    { slug: "tramites-info", titulo: "Información General" },
  ],
  avisos: [
    { slug: "avisos-hero", titulo: "Hero Avisos" },
    { slug: "avisos-info", titulo: "Información General" },
  ],
  contacto: [
    { slug: "contacto-hero", titulo: "Hero Contacto" },
    { slug: "contact-info", titulo: "Información de Contacto" },
  ],
};

const contenidoInicialJunta =
  "Francisco Esquivel Arrieta|Presidente|junta-presidente\n" +
  "Yamilet Picado Ramírez|Vicepresidenta|junta-vicepresidenta\n" +
  "Marvin Peraza Montoya|Tesorero|junta-tesorero\n" +
  "Randall Vásquez García|Secretario|junta-secretario\n" +
  "Luz Marín Aguilar|Vocal 1|junta-vocal-1\n" +
  "Ademar Cerdas Rojas|Vocal 2|junta-vocal-2\n" +
  "Miriam Carranza Alfaro|Vocal 3|junta-vocal-3\n" +
  "José Luis Vega Alfaro|Fiscal|junta-fiscal";

function AdminContenido() {
  const [paginaSeleccionada, setPaginaSeleccionada] = useState("about");
  const [contenidos, setContenidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [showNuevaSeccion, setShowNuevaSeccion] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    slug: "",
    contenido: "",
    activo: true,
    pagina: "about",
  });

  const [originalForm, setOriginalForm] = useState({
    titulo: "",
    slug: "",
    contenido: "",
    activo: true,
    pagina: "about",
  });

  const [nuevoContenido, setNuevoContenido] = useState({
    titulo: "",
    slug: "junta-directiva",
    contenido: contenidoInicialJunta,
    activo: true,
    pagina: "about",
  });

  const opcionesSeccionActual = seccionesPorPagina[paginaSeleccionada] || [];

  const cargarContenidos = async (paginaActual = paginaSeleccionada) => {
    try {
      setLoading(true);
      const data = await getContenidos(paginaActual);

      const seccionesPermitidas = seccionesPorPagina[paginaActual]?.map(
        (item) => item.slug
      );

      const contenidosFiltrados = Array.isArray(data)
        ? data.filter((item) => seccionesPermitidas?.includes(item.slug))
        : [];

      setContenidos(contenidosFiltrados);

      if (contenidosFiltrados.length > 0) {
        setSelectedId((prev) => {
          const existe = contenidosFiltrados.some((item) => item._id === prev);
          return existe ? prev : contenidosFiltrados[0]._id;
        });
      } else {
        setSelectedId("");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarContenidos(paginaSeleccionada);

    const primeraSeccion = seccionesPorPagina[paginaSeleccionada]?.[0];

    setNuevoContenido({
      titulo: primeraSeccion?.titulo || "",
      slug: primeraSeccion?.slug || "",
      contenido: paginaSeleccionada === "about" ? contenidoInicialJunta : "",
      activo: true,
      pagina: paginaSeleccionada,
    });
  }, [paginaSeleccionada]);

  const selectedContenido = useMemo(() => {
    return contenidos.find((item) => item._id === selectedId) || null;
  }, [contenidos, selectedId]);

  useEffect(() => {
    if (selectedContenido) {
      const nuevoForm = {
        titulo: selectedContenido.titulo || "",
        slug: selectedContenido.slug || "",
        contenido: selectedContenido.contenido || "",
        activo: !!selectedContenido.activo,
        pagina: selectedContenido.pagina || paginaSeleccionada,
      };

      setForm(nuevoForm);
      setOriginalForm(nuevoForm);
    } else {
      const vacio = {
        titulo: "",
        slug: "",
        contenido: "",
        activo: true,
        pagina: paginaSeleccionada,
      };
      setForm(vacio);
      setOriginalForm(vacio);
    }
  }, [selectedContenido, paginaSeleccionada]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNuevoChange = (e) => {
    const { name, value } = e.target;

    if (name === "slug") {
      const seccionEncontrada = opcionesSeccionActual.find(
        (item) => item.slug === value
      );

      setNuevoContenido((prev) => ({
        ...prev,
        slug: value,
        titulo: seccionEncontrada?.titulo || prev.titulo,
      }));
      return;
    }

    setNuevoContenido((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = async () => {
    if (!selectedId) return;

    try {
      setGuardando(true);
      await updateContenido(selectedId, form);
      await cargarContenidos();
      alert("Contenido actualizado correctamente");
    } catch (error) {
      alert(error.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleDescartar = () => {
    setForm(originalForm);
  };

  const handleToggleActivo = async () => {
    if (!selectedId) return;

    try {
      await toggleContenidoActivo(selectedId);
      await cargarContenidos();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCrearSeccion = async () => {
    if (!nuevoContenido.titulo || !nuevoContenido.slug || !nuevoContenido.pagina) {
      alert("Debes seleccionar una sección válida");
      return;
    }

    const yaExiste = contenidos.some((item) => item.slug === nuevoContenido.slug);

    if (yaExiste) {
      alert("Esa sección ya existe en esta página");
      return;
    }

    try {
      const response = await createContenido(nuevoContenido);

      const primeraSeccion = seccionesPorPagina[paginaSeleccionada]?.[0];

      setNuevoContenido({
        titulo: primeraSeccion?.titulo || "",
        slug: primeraSeccion?.slug || "",
        contenido: paginaSeleccionada === "about" ? contenidoInicialJunta : "",
        activo: true,
        pagina: paginaSeleccionada,
      });

      setShowNuevaSeccion(false);
      await cargarContenidos();

      if (response?.contenido?._id) {
        setSelectedId(response.contenido._id);
      }

      alert("Sección creada correctamente");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEliminar = async () => {
    if (!selectedId) return;

    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta sección?"
    );

    if (!confirmar) return;

    try {
      await deleteContenido(selectedId);
      setSelectedId("");
      await cargarContenidos();
      alert("Sección eliminada correctamente");
    } catch (error) {
      alert(error.message);
    }
  };

  const cantidadCaracteres = form.contenido.length;
  const esPaginaAbout = paginaSeleccionada === "about";

  return (
    <div className="bg-slate-100 p-7">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
          Gestión de Contenido
        </h1>
        <p className="mt-2 text-lg text-slate-700">
          Editar textos y secciones del sitio web
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Página pública
            </label>
            <select
              value={paginaSeleccionada}
              onChange={(e) => {
                setPaginaSeleccionada(e.target.value);
                setSelectedId("");
              }}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {paginas.map((pagina) => (
                <option key={pagina.value} value={pagina.value}>
                  {pagina.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Sección
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              disabled={contenidos.length === 0}
            >
              {contenidos.length === 0 ? (
                <option value="">No hay secciones en esta página</option>
              ) : (
                contenidos.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.titulo} ({item.slug})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowNuevaSeccion((prev) => !prev)}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nueva Sección
          </button>

          {selectedContenido && (
            <button
              type="button"
              onClick={handleToggleActivo}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 font-semibold ${
                selectedContenido.activo
                  ? "bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              <CheckSquare className="h-4 w-4" />
              {selectedContenido.activo ? "Desactivar" : "Activar"}
            </button>
          )}
        </div>

        {showNuevaSeccion && (
          <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-xl font-semibold text-slate-900">
              Nueva sección
            </h3>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sección predefinida
              </label>
              <select
                name="slug"
                value={nuevoContenido.slug}
                onChange={handleNuevoChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {opcionesSeccionActual.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.titulo} ({item.slug})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Título
              </label>
              <input
                type="text"
                name="titulo"
                value={nuevoContenido.titulo}
                onChange={handleNuevoChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Contenido inicial
              </label>
              <textarea
                name="contenido"
                value={nuevoContenido.contenido}
                onChange={handleNuevoChange}
                placeholder="Contenido inicial"
                rows="10"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCrearSeccion}
                className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
              >
                Crear
              </button>
              <button
                type="button"
                onClick={() => setShowNuevaSeccion(false)}
                className="rounded-xl bg-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {loading ? (
            <p className="text-slate-500">Cargando contenido...</p>
          ) : selectedContenido ? (
            <>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-black">
                    {form.titulo}
                  </h2>
                  <p className="mt-1 text-slate-600">Slug: {form.slug}</p>
                  <p className="mt-1 text-slate-600">Página: {form.pagina}</p>
                </div>

                <span
                  className={`rounded-full px-4 py-1 text-sm font-semibold ${
                    form.activo
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {form.activo ? "Activa" : "Inactiva"}
                </span>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {esPaginaAbout
                    ? "Miembros de Junta Directiva"
                    : "Contenido"}
                </label>

                <textarea
                  name="contenido"
                  value={form.contenido}
                  onChange={handleFormChange}
                  rows={esPaginaAbout ? 12 : 14}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <p className="mb-4 text-sm text-slate-500">
                {cantidadCaracteres} caracteres
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGuardar}
                  disabled={guardando}
                  className="flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {guardando ? "Guardando..." : "Guardar Cambios"}
                </button>

                <button
                  type="button"
                  onClick={handleDescartar}
                  className="flex items-center gap-2 rounded-2xl bg-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-300"
                >
                  <RotateCcw className="h-4 w-4" />
                  Descartar
                </button>

                <button
                  type="button"
                  onClick={handleEliminar}
                  className="flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            </>
          ) : (
            <p className="text-slate-500">
              Selecciona una sección para editar.
            </p>
          )}
        </section>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Eye className="h-5 w-5 text-slate-500" />
              <h3 className="text-2xl font-bold text-black">Vista Previa</h3>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="whitespace-pre-line text-lg text-slate-800">
                {form.contenido || "Aquí se mostrará la vista previa del contenido."}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <h3 className="mb-4 text-2xl font-bold text-blue-900">
              Consejos de Edición
            </h3>

            <div className="space-y-3 text-base text-blue-800">
              {esPaginaAbout ? (
                <>
                  <p>• En Sobre Nosotros solo se edita Junta Directiva</p>
                  <p>• Usa una línea por cada miembro</p>
                  <p>• Formato: Nombre|Cargo|clave-foto</p>
                  <p>• Ejemplo: Francisco Esquivel Arrieta|Presidente|junta-presidente</p>
                </>
              ) : (
                <>
                  <p>• Selecciona la página y luego la sección a editar</p>
                  <p>• Las secciones nuevas se crean desde el combo box predefinido</p>
                  <p>• Así evitas errores escribiendo slugs manualmente</p>
                  <p>• Los cambios se reflejan en el sitio público al guardar</p>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AdminContenido;