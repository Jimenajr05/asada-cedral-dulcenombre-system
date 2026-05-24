/**
 * @file AdminSostenibilidad.jsx
 * @description Página de administración para iniciativas de sostenibilidad ambiental. Permite gestionar galerías de imágenes de Cultura Hídrica y mantenimiento forestal, así como actualizar el conteo total de hidrantes comunitarios.
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Upload, ImagePlus, AlertTriangle } from "lucide-react";
import {
  getSostenibilidadAdmin, addImagenGaleria, updateImagenGaleria,
  deleteImagenGaleria, updateTotalHidrantes,
} from "../../services/sostenibilidadService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 left-4 sm:top-6 sm:right-6 sm:left-auto z-50 flex flex-col gap-3 w-auto sm:w-[380px]">
      {toasts.map((t) => {
        const isSuccess = t.type === "success";
        const isConfirm = t.type === "confirm";
        return (
          <div key={t.id}
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 sm:px-5 sm:py-4 shadow-2xl backdrop-blur-md
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
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } } @media (min-width: 640px) { @keyframes slideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } } }`}</style>
    </div>
  );
}

function AdminSostenibilidad() {
  const navigate = useNavigate();
  const fileInputRefs = useRef({});
  const [confirmacionNavegacion, setConfirmacionNavegacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [data, setData] = useState(null);
  const [galeriaActiva, setGaleriaActiva] = useState("culturaHidrica");
  const [imagenForm, setImagenForm] = useState({ alt: "", image: null });
  const [previewImagen, setPreviewImagen] = useState(null);
  const [editandoImagen, setEditandoImagen] = useState(null);
  const [totalHidrantes, setTotalHidrantes] = useState("");

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

  useEffect(() => {
    const isDirty =
      editandoImagen !== null ||
      imagenForm.alt !== "" ||
      imagenForm.image !== null;

    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "Tienes cambios sin guardar. ¿Seguro que deseas salir?";
        return e.returnValue;
      }
    };

    const handleGlobalClick = (e) => {
      if (!isDirty) return;

      let target = e.target;
      while (target && target !== document.body) {
        const isLink = target.tagName === "A";
        const isButtonInHeaderOrSidebar = target.tagName === "BUTTON" && (target.closest("header") || target.closest("aside"));

        if (isLink || isButtonInHeaderOrSidebar) {
          let href = "";
          let isLogout = false;

          if (isLink) {
            href = target.getAttribute("href") || target.getAttribute("to");
            if (href && (href.startsWith("#") || href === window.location.pathname)) {
              break;
            }
          } else {
            isLogout = true;
          }

          e.preventDefault();
          e.stopPropagation();

          setConfirmacionNavegacion({
            onConfirm: () => {
              setConfirmacionNavegacion(null);
              setEditandoImagen(null);
              setImagenForm({ alt: "", image: null });
              setPreviewImagen(null);

              if (isLogout) {
                if (target.click) {
                  setTimeout(() => {
                    target.click();
                  }, 50);
                } else {
                  window.location.href = "/admin/login";
                }
              } else if (href) {
                navigate(href);
              }
            },
            onCancel: () => {
              setConfirmacionNavegacion(null);
            }
          });
          break;
        }
        target = target.parentElement;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, [editandoImagen, imagenForm]);

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
    const altText = image.alt === "Imagen de galería" ? "" : (image.alt || "");
    setImagenForm({ alt: altText, image: null });
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
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 md:text-5xl leading-tight">Gestión de Sostenibilidad</h1>
        <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-700">Administra las imágenes de las galerías de sostenibilidad.</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <ImagePlus className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Galerías de Sostenibilidad</h2>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
          {[
            { key: "culturaHidrica", label: "Actividades Cultura Hídrica" },
            { key: "mantenimiento", label: "Mantenimiento de estructuras" },
            { key: "hidrantes", label: "Hidrantes" },
          ].map(({ key, label }) => (
            <button key={key} type="button" onClick={() => cambiarGaleria(key)}
              className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold transition ${galeriaActiva === key ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700 hover:bg-slate-300"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Total hidrantes */}
        {galeriaActiva === "hidrantes" && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">Total mostrado en la galería de hidrantes</h3>
            <div className="flex flex-col gap-4 md:flex-row">
              <input type="text" value={totalHidrantes} onChange={(e) => setTotalHidrantes(e.target.value)}
                placeholder="Ejemplo: 20 hidrantes instalados"
                className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              <button type="button" onClick={handleGuardarTotalHidrantes}
                className="w-full md:w-auto rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                Guardar total
              </button>
            </div>
          </div>
        )}

        {/* Formulario imagen */}
        <form onSubmit={handleGuardarImagen} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Texto alternativo (opcional):</label>
              <input type="text" value={imagenForm.alt}
                onChange={(e) => setImagenForm((prev) => ({ ...prev, alt: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Imagen:</label>
              <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 sm:p-8 text-center transition hover:border-blue-400 hover:bg-blue-50/20">
                {previewImagen ? (
                  <div className="relative group flex flex-col items-center">
                    <div
                      onClick={() => fileInputRefs.current[galeriaActiva]?.click()}
                      className="relative cursor-pointer h-32 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-100 group-hover:border-blue-50"
                    >
                      <img src={previewImagen} alt="Vista previa" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Upload className="h-6 w-6 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Cambiar</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-slate-500">Vista previa de la imagen</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagenForm((prev) => ({ ...prev, image: null }));
                        setPreviewImagen(null);
                        if (fileInputRefs.current[galeriaActiva]) fileInputRefs.current[galeriaActiva].value = "";
                      }}
                      className="mt-2 text-xs font-bold text-red-500 hover:text-red-700 transition"
                    >
                      Quitar imagen
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRefs.current[galeriaActiva]?.click()}
                    className="w-full cursor-pointer flex flex-col items-center py-4"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 transition group-hover:bg-blue-100">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 font-medium">Seleccionar una imagen</p>
                    <p className="mt-1 text-xs text-slate-400">Arrastra una imagen o haz clic para buscar en tus archivos</p>
                    <p className="mt-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">PNG, JPG o WEBP</p>
                  </div>
                )}
                <input ref={(el) => (fileInputRefs.current[galeriaActiva] = el)} type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImagenFileChange} className="hidden" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit"
              className="w-full sm:w-auto rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 text-center">
              {editandoImagen !== null ? "Guardar cambios" : "Agregar imagen"}
            </button>
            <button type="button" onClick={limpiarImagenForm}
              className="w-full sm:w-auto rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300 text-center">
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
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {galeriaActual.images.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 flex flex-col justify-between">
                      <div>
                        <div className="h-28 w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
                          <img src={construirUrlImagen(image.src)} alt={image.alt} className="h-full w-full object-cover" />
                        </div>
                        <p className="line-clamp-2 min-h-[2rem] text-xs text-slate-600">
                          {image.alt && image.alt !== "Imagen de galería" ? (
                            image.alt
                          ) : (
                            <span className="text-slate-400 italic">Sin descripción</span>
                          )}
                        </p>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => handleEditarImagen(image, index)}
                          className="flex items-center justify-center gap-1 rounded-xl bg-blue-50 px-2 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100">
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </button>
                        <button type="button" onClick={() => handleEliminarImagen(index)}
                          className="flex items-center justify-center gap-1 rounded-xl bg-red-50 px-2 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100">
                          <Trash2 className="h-3.5 w-3.5" /> Eliminar
                        </button>
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

      {confirmacionNavegacion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md scale-95 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all animate-scale-up">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-4">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">¿Salir sin guardar los cambios?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Tienes modificaciones pendientes en esta sección. Si sales ahora, perderás todos tus cambios en Sostenibilidad de forma permanente.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={confirmacionNavegacion.onCancel}
                className="flex-1 rounded-2xl bg-slate-100 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-[0.98] cursor-pointer"
              >
                Permanecer aquí
              </button>
              <button
                type="button"
                onClick={confirmacionNavegacion.onConfirm}
                className="flex-1 rounded-2xl bg-amber-600 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700 active:scale-[0.98] shadow-lg shadow-amber-100 cursor-pointer"
              >
                Salir sin guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSostenibilidad;