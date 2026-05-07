import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, Upload, ImagePlus } from "lucide-react";
import {
  getSostenibilidadAdmin, addImagenGaleria, updateImagenGaleria,
  deleteImagenGaleria, updateTotalHidrantes,
} from "../../services/sostenibilidadService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/* ========================= TOAST ========================= */
function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3" style={{ minWidth: 300, maxWidth: 400 }}>
      {toasts.map((t) => {
        const isSuccess = t.type === "success";
        const isConfirm = t.type === "confirm";
        return (
          <div key={t.id}
            className={`flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-md
              ${isSuccess ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : isConfirm ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-red-50 border-red-200 text-red-800"}`}
            style={{ animation: "slideIn 0.3s ease" }}
          >
            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold
              ${isSuccess ? "bg-emerald-500" : isConfirm ? "bg-amber-500" : "bg-red-500"}`}>
              {isSuccess ? "✓" : isConfirm ? "?" : "✕"}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm leading-snug">
                {isSuccess ? "¡Éxito!" : isConfirm ? "Confirmar" : "Error"}
              </p>
              <p className="text-sm mt-0.5 opacity-80">{t.message}</p>
              {isConfirm && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => t.onConfirm()}
                    className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition">
                    Eliminar
                  </button>
                  <button onClick={() => t.onCancel()}
                    className="rounded-xl bg-slate-200 px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-300 transition">
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

/* ========================= COMPONENTE PRINCIPAL ========================= */
function AdminSostenibilidad() {
  const fileInputRefs = useRef({});
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [data, setData] = useState(null);
  const [galeriaActiva, setGaleriaActiva] = useState("culturaHidrica");
  const [imagenForm, setImagenForm] = useState({ alt: "", image: null });
  const [previewImagen, setPreviewImagen] = useState(null);
  const [editandoImagen, setEditandoImagen] = useState(null);
  const [totalHidrantes, setTotalHidrantes] = useState("");

  // ── Toast helpers ──
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const addToast = (type, message, extra = {}) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message, ...extra }]);
    if (type !== "confirm") setTimeout(() => removeToast(id), 3500);
    return id;
  };
  const showSuccess = (msg) => addToast("success", msg);
  const showError = (msg) => addToast("error", msg);
  const showConfirm = (msg) =>
    new Promise((resolve) => {
      const id = addToast("confirm", msg, {
        onConfirm: () => { removeToast(id); resolve(true); },
        onCancel: () => { removeToast(id); resolve(false); },
      });
    });

  const construirUrlImagen = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const response = await getSostenibilidadAdmin();
      setData(response);
      setTotalHidrantes(response?.galerias?.hidrantes?.total || "");
    } catch (error) {
      showError(error.message || "Error al cargar sostenibilidad");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const limpiarImagenForm = () => {
    setImagenForm({ alt: "", image: null });
    setPreviewImagen(null);
    setEditandoImagen(null);
    if (fileInputRefs.current[galeriaActiva]) fileInputRefs.current[galeriaActiva].value = "";
  };

  const handleImagenFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenForm((prev) => ({ ...prev, image: file }));
    setPreviewImagen(URL.createObjectURL(file));
  };

  const handleGuardarImagen = async (e) => {
    e.preventDefault();
    if (!imagenForm.alt) { showError("Debes escribir el texto alternativo"); return; }
    try {
      const formData = new FormData();
      formData.append("alt", imagenForm.alt);
      if (imagenForm.image) formData.append("image", imagenForm.image);

      if (editandoImagen !== null) {
        await updateImagenGaleria(galeriaActiva, editandoImagen, formData);
        showSuccess("Imagen actualizada correctamente");
      } else {
        if (!imagenForm.image) { showError("Debes seleccionar una imagen"); return; }
        await addImagenGaleria(galeriaActiva, formData);
        showSuccess("Imagen agregada correctamente");
      }
      limpiarImagenForm();
      await cargarDatos();
    } catch (error) {
      showError(error.message || "Error al guardar imagen");
    }
  };

  const handleEditarImagen = (image, index) => {
    setImagenForm({ alt: image.alt || "", image: null });
    setPreviewImagen(construirUrlImagen(image.src));
    setEditandoImagen(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminarImagen = async (index) => {
    const confirmed = await showConfirm("¿Deseas eliminar esta imagen?");
    if (!confirmed) return;
    try {
      await deleteImagenGaleria(galeriaActiva, index);
      if (editandoImagen === index) limpiarImagenForm();
      await cargarDatos();
      showSuccess("Imagen eliminada correctamente");
    } catch (error) {
      showError(error.message || "Error al eliminar imagen");
    }
  };

  const handleGuardarTotalHidrantes = async () => {
    try {
      await updateTotalHidrantes({ total: totalHidrantes });
      await cargarDatos();
      showSuccess("Total de hidrantes actualizado correctamente");
    } catch (error) {
      showError(error.message || "Error al actualizar total de hidrantes");
    }
  };

  const cambiarGaleria = (galeria) => {
    setGaleriaActiva(galeria);
    setImagenForm({ alt: "", image: null });
    setPreviewImagen(null);
    setEditandoImagen(null);
  };

  const galeriaActual = data?.galerias?.[galeriaActiva];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-slate-700">Cargando información...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div>
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Gestión de Sostenibilidad</h1>
        <p className="mt-2 text-lg text-slate-700">Administra las imágenes de las galerías de sostenibilidad.</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <ImagePlus className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Galerías de Sostenibilidad</h2>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            { key: "culturaHidrica", label: "Actividades Cultura Hídrica" },
            { key: "mantenimiento", label: "Mantenimiento de estructuras" },
            { key: "hidrantes", label: "Hidrantes" },
          ].map(({ key, label }) => (
            <button key={key} type="button" onClick={() => cambiarGaleria(key)}
              className={`rounded-2xl px-4 py-3 font-semibold transition ${galeriaActiva === key ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Total hidrantes */}
        {galeriaActiva === "hidrantes" && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Total mostrado en la galería de hidrantes</h3>
            <div className="flex flex-col gap-4 md:flex-row">
              <input type="text" value={totalHidrantes} onChange={(e) => setTotalHidrantes(e.target.value)}
                placeholder="Ejemplo: 20 hidrantes instalados"
                className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              <button type="button" onClick={handleGuardarTotalHidrantes}
                className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                Guardar total
              </button>
            </div>
          </div>
        )}

        {/* Formulario imagen */}
        <form onSubmit={handleGuardarImagen} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Texto alternativo:</label>
              <input type="text" value={imagenForm.alt}
                onChange={(e) => setImagenForm((prev) => ({ ...prev, alt: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Imagen</label>
              <div onClick={() => fileInputRefs.current[galeriaActiva]?.click()}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
                <Upload className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                <p className="text-slate-700">Click para seleccionar una imagen</p>
                <p className="mt-1 text-sm text-slate-500">PNG, JPG, JPEG o WEBP</p>
                <input ref={(el) => (fileInputRefs.current[galeriaActiva] = el)} type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImagenFileChange} className="hidden" />
              </div>
            </div>
          </div>

          {previewImagen && (
            <div className="mx-auto h-48 w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200">
              <img src={previewImagen} alt="Vista previa" className="h-full w-full object-cover" />
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit"
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              {editandoImagen !== null ? "Guardar cambios" : "Agregar imagen"}
            </button>
            <button type="button" onClick={limpiarImagenForm}
              className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300">
              Cancelar
            </button>
          </div>
        </form>

        {/* Galería */}
        <div className="mt-8">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-slate-900">{galeriaActual?.title || "Galería"}</h3>
            <div className="inline-flex w-fit items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {galeriaActual?.images?.length || 0} foto(s)
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {galeriaActual?.images?.length > 0 ? (
              <div className="max-h-[720px] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {galeriaActual.images.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <div className="h-40 w-full overflow-hidden bg-slate-100">
                        <img src={construirUrlImagen(image.src)} alt={image.alt} className="h-full w-full object-cover" />
                      </div>
                      <div className="p-4">
                        <p className="line-clamp-2 min-h-[3rem] text-sm text-slate-700">{image.alt || "Sin descripción"}</p>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <button type="button" onClick={() => handleEditarImagen(image, index)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100">
                            <Pencil className="h-4 w-4" /> Editar
                          </button>
                          <button type="button" onClick={() => handleEliminarImagen(index)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100">
                            <Trash2 className="h-4 w-4" /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-500">No hay imágenes registradas en esta galería.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminSostenibilidad;