import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, Image as ImageIcon, Star, Trash2 } from "lucide-react";
import {
  getFotos,
  createFoto,
  toggleDestacada,
  deleteFoto,
} from "../../services/fotoService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

function AdminFotos() {
  const fileInputRef = useRef(null);

  const [filtroSeccion, setFiltroSeccion] = useState("todas");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    seccion: "pagina-principal",
    titulo: "",
    archivo: null,
  });

  const [fotos, setFotos] = useState([]);

  const secciones = [
    { value: "pagina-principal", label: "Página Principal" },
    { value: "sobre-nosotros", label: "Sobre Nosotros" },
    { value: "gestion-del-agua", label: "Gestión del Agua" },
    { value: "sostenibilidad", label: "Sostenibilidad" },
    { value: "galeria", label: "Galería" },
  ];

  const cargarFotos = async () => {
    try {
      setLoading(true);
      const data = await getFotos();
      setFotos(Array.isArray(data) ? data : []);
    } catch (error) {
      alert(error.message || "Error al obtener fotos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFotos();
  }, []);

  const fotosFiltradas = useMemo(() => {
    if (filtroSeccion === "todas") return fotos;
    return fotos.filter((foto) => foto.seccion === filtroSeccion);
  }, [filtroSeccion, fotos]);

  const resetForm = () => {
    setForm({
      seccion: "pagina-principal",
      titulo: "",
      archivo: null,
    });
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelected = (file) => {
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      archivo: file,
    }));

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    handleFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFileSelected(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo || !form.seccion || !form.archivo) {
      alert("Completa todos los campos y selecciona una imagen");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("seccion", form.seccion);
      formData.append("imagen", form.archivo);

      await createFoto(formData);
      resetForm();
      await cargarFotos();
      alert("Foto subida correctamente");
    } catch (error) {
      alert(error.message || "Error al subir foto");
    }
  };

  const handleCancelar = () => {
    resetForm();
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar esta foto?");
    if (!confirmar) return;

    try {
      await deleteFoto(id);
      await cargarFotos();
    } catch (error) {
      alert(error.message || "Error al eliminar foto");
    }
  };

  const handleDestacar = async (foto) => {
    try {
      await toggleDestacada(foto._id);
      await cargarFotos();
    } catch (error) {
      alert(error.message || "Error al destacar foto");
    }
  };

  const getNombreSeccion = (seccion) => {
    const encontrada = secciones.find((item) => item.value === seccion);
    return encontrada ? encontrada.label : seccion;
  };

  const construirUrlImagen = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  return (
    <div className="bg-slate-100 p-7">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
          Gestión de Fotos
        </h1>
        <p className="mt-2 text-lg text-slate-700">
          Subir y administrar imágenes del sitio web
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-3xl font-bold text-black">Subir Nueva Foto</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-black">
                Sección
              </label>
              <select
                name="seccion"
                value={form.seccion}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                {secciones.map((seccion) => (
                  <option key={seccion.value} value={seccion.value}>
                    {seccion.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-black">
                Título
              </label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Descripción de la imagen"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-black">
              Archivo de Imagen
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
            >
              <Upload className="mb-4 h-14 w-14 text-slate-400" />

              <p className="text-lg text-slate-700">
                Click para seleccionar o arrastra una imagen aquí
              </p>
              <p className="mt-2 text-sm text-slate-500">PNG, JPG hasta 5MB</p>

              {form.archivo && (
                <p className="mt-4 text-sm font-medium text-blue-600">
                  Archivo seleccionado: {form.archivo.name}
                </p>
              )}

              {preview && (
                <div className="mt-4 h-28 w-48 overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Subir Foto
            </button>

            <button
              type="button"
              onClick={handleCancelar}
              className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="text-base font-medium text-slate-700">
            Filtrar por sección:
          </label>

          <select
            value={filtroSeccion}
            onChange={(e) => setFiltroSeccion(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:w-[260px]"
          >
            <option value="todas">Todas las secciones</option>
            {secciones.map((seccion) => (
              <option key={seccion.value} value={seccion.value}>
                {seccion.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
          Cargando fotos...
        </div>
      ) : fotosFiltradas.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
          No hay fotos registradas para esta sección.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {fotosFiltradas.map((foto) => (
            <div
              key={foto._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-56 w-full overflow-hidden bg-slate-200">
                {foto.url ? (
                  <img
                    src={construirUrlImagen(foto.url)}
                    alt={foto.titulo}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-slate-400" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-[1.6rem] font-semibold leading-tight text-slate-900">
                  {foto.titulo}
                </h3>

                <p className="mt-1 text-lg text-slate-600">
                  {getNombreSeccion(foto.seccion)}
                </p>

                <p className="mt-4 text-sm text-slate-500">
                  Subida: {new Date(foto.createdAt).toLocaleDateString("es-CR")}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleDestacar(foto)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold transition ${
                      foto.destacada
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Star className="h-4 w-4" />
                    {foto.destacada ? "Destacada" : "Destacar"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEliminar(foto._id)}
                    className="rounded-2xl bg-red-50 px-4 py-3 text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-4 text-2xl font-bold text-blue-900">
          Recomendaciones
        </h3>

        <div className="space-y-3 text-base text-blue-800">
          <p>• Use imágenes de alta calidad (mínimo 1920x1080px para banners)</p>
          <p>• Los archivos se optimizan automáticamente para web</p>
          <p>• Marque como "destacada" la foto principal de cada sección</p>
          <p>• Formatos recomendados: JPG para fotos, PNG para gráficos</p>
        </div>
      </div>
    </div>
  );
}

export default AdminFotos;