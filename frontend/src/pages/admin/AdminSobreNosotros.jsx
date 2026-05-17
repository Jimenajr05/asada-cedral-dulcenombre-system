import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Upload, Users, BarChart3, AlertTriangle } from "lucide-react";
import {
  getSobreNosotros, updateSobreNosotros, addMiembro, updateMiembro,
  deleteMiembro, addCobertura, updateCobertura, deleteCobertura,
} from "../../services/sobreNosotrosService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-6 right-4 sm:right-6 z-50 flex flex-col gap-3 w-[calc(100vw-2rem)] sm:w-80 md:w-96">
      {toasts.map((t) => {
        const isSuccess = t.type === "success";
        const isConfirm = t.type === "confirm";
        return (
          <div key={t.id}
            className={`flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-md
              ${isSuccess ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : isConfirm ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-red-50 border-red-200 text-red-800"}`}
            style={{ animation: "slideIn 0.3s ease" }}>
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

function AdminSobreNosotros() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [confirmacionNavegacion, setConfirmacionNavegacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [data, setData] = useState({ periodo: "", miembros: [], cobertura: [] });
  const [periodo, setPeriodo] = useState("");
  const [editandoPeriodo, setEditandoPeriodo] = useState(false);
  const [miembroForm, setMiembroForm] = useState({ nombre: "", cargo: "", foto: null });
  const [previewMiembro, setPreviewMiembro] = useState(null);
  const [editandoMiembro, setEditandoMiembro] = useState(null);
  const [coberturaForm, setCoberturaForm] = useState({ valor: "", descripcion: "" });
  const [editandoCobertura, setEditandoCobertura] = useState(null);

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
      const response = await getSobreNosotros();
      setData(response);
      setPeriodo(response.periodo || "");
    } catch (error) {
      showError(error.message || "Error al cargar Sobre Nosotros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  useEffect(() => {
    const isDirty =
      editandoMiembro !== null ||
      editandoCobertura !== null ||
      editandoPeriodo ||
      miembroForm.nombre !== "" ||
      miembroForm.cargo !== "" ||
      coberturaForm.valor !== "" ||
      coberturaForm.descripcion !== "";

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
              setEditandoMiembro(null);
              setEditandoCobertura(null);
              setEditandoPeriodo(false);
              setMiembroForm({ nombre: "", cargo: "", foto: null });
              setCoberturaForm({ valor: "", descripcion: "" });

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
  }, [editandoMiembro, editandoCobertura, editandoPeriodo, miembroForm, coberturaForm]);

  const guardarPeriodo = async () => {
    try {
      await updateSobreNosotros({ periodo });
      await cargarDatos();
      showSuccess("Período actualizado correctamente");
    } catch (error) {
      showError(error.message || "Error al actualizar período");
    }
  };

  const limpiarMiembroForm = () => {
    setMiembroForm({ nombre: "", cargo: "", foto: null });
    setPreviewMiembro(null);
    setEditandoMiembro(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleMiembroFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMiembroForm((prev) => ({ ...prev, foto: file }));
    setPreviewMiembro(URL.createObjectURL(file));
  };

  const handleGuardarMiembro = async (e) => {
    e.preventDefault();
    if (!miembroForm.nombre || !miembroForm.cargo) {
      showError("Debes completar nombre y cargo");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("nombre", miembroForm.nombre);
      formData.append("cargo", miembroForm.cargo);
      if (miembroForm.foto) formData.append("foto", miembroForm.foto);
      if (editandoMiembro !== null) {
        await updateMiembro(editandoMiembro, formData);
        showSuccess("Miembro actualizado correctamente");
      } else {
        await addMiembro(formData);
        showSuccess("Miembro agregado correctamente");
      }
      limpiarMiembroForm();
      await cargarDatos();
    } catch (error) {
      showError(error.message || "Error al guardar miembro");
    }
  };

  const handleEditarMiembro = (miembro, index) => {
    setEditandoMiembro(index);
    setMiembroForm({ nombre: miembro.nombre || "", cargo: miembro.cargo || "", foto: null });
    setPreviewMiembro(miembro.foto ? construirUrlImagen(miembro.foto) : null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    const seccion = document.getElementById("seccion-miembros");
    if (seccion) seccion.scrollIntoView({ behavior: "smooth" });
  };

  const handleEliminarMiembro = async (index) => {
    const confirmed = await showConfirm("¿Deseas eliminar este miembro?");
    if (!confirmed) return;
    try {
      await deleteMiembro(index);
      await cargarDatos();
      if (editandoMiembro === index) limpiarMiembroForm();
      showSuccess("Miembro eliminado correctamente");
    } catch (error) {
      showError(error.message || "Error al eliminar miembro");
    }
  };

  const limpiarCoberturaForm = () => {
    setCoberturaForm({ valor: "", descripcion: "" });
    setEditandoCobertura(null);
  };

  const handleGuardarCobertura = async (e) => {
    e.preventDefault();
    if (!coberturaForm.valor || !coberturaForm.descripcion) {
      showError("Debes completar valor y descripción");
      return;
    }
    try {
      if (editandoCobertura !== null) {
        await updateCobertura(editandoCobertura, coberturaForm);
        showSuccess("Cobertura actualizada correctamente");
      } else {
        await addCobertura(coberturaForm);
        showSuccess("Cobertura agregada correctamente");
      }
      limpiarCoberturaForm();
      await cargarDatos();
    } catch (error) {
      showError(error.message || "Error al guardar cobertura");
    }
  };

  const handleEditarCobertura = (item, index) => {
    setEditandoCobertura(index);
    setCoberturaForm({ valor: item.valor || "", descripcion: item.descripcion || "" });
    const seccion = document.getElementById("seccion-cobertura");
    if (seccion) seccion.scrollIntoView({ behavior: "smooth" });
  };

  const handleEliminarCobertura = async (index) => {
    const confirmed = await showConfirm("¿Deseas eliminar este dato de cobertura?");
    if (!confirmed) return;
    try {
      await deleteCobertura(index);
      await cargarDatos();
      if (editandoCobertura === index) limpiarCoberturaForm();
      showSuccess("Cobertura eliminada correctamente");
    } catch (error) {
      showError(error.message || "Error al eliminar cobertura");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-slate-700">
          Cargando información...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 md:text-5xl leading-tight">Gestión de Sobre Nosotros</h1>
        <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-700">Administra la junta directiva y la sección de cobertura y alcance.</p>
      </div>

      {/* PERÍODO */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Período de Junta Directiva</h2>
        {editandoPeriodo ? (
          <div className="flex flex-col gap-4 md:flex-row">
            <input type="text" value={periodo} onChange={(e) => setPeriodo(e.target.value)}
              placeholder="Ejemplo: 2025 – 2029"
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={async () => { await guardarPeriodo(); setEditandoPeriodo(false); }}
                className="flex-1 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 text-center w-full sm:w-auto">
                Guardar
              </button>
              <button onClick={() => { setPeriodo(data.periodo || ""); setEditandoPeriodo(false); }}
                className="flex-1 rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300 text-center w-full sm:w-auto">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-slate-800 font-medium break-all">
              {data.periodo || <span className="text-slate-400 italic">Sin período definido</span>}
            </p>
            <button onClick={() => setEditandoPeriodo(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 w-full sm:w-auto">
              <Pencil className="h-4 w-4" /> Editar
            </button>
          </div>
        )}
      </section>

      <section id="seccion-miembros" className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Junta Directiva</h2>
        </div>
        <form onSubmit={handleGuardarMiembro} className="space-y-5">
          {editandoMiembro !== null && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span>Estás en <strong>Modo Edición</strong> para el miembro <strong>{miembroForm.nombre}</strong>. Edita los campos abajo y presiona "Guardar cambios".</span>
              </div>
              <button type="button" onClick={limpiarMiembroForm} className="text-xs font-bold text-amber-700 hover:underline shrink-0 text-left">
                Cancelar edición
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Nombre:</label>
              <input type="text" value={miembroForm.nombre}
                onChange={(e) => setMiembroForm((prev) => ({ ...prev, nombre: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Cargo:</label>
              <input type="text" value={miembroForm.cargo}
                onChange={(e) => setMiembroForm((prev) => ({ ...prev, cargo: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Foto del Miembro:</label>
            <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50/20">
              {previewMiembro ? (
                <div className="relative group flex flex-col items-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative cursor-pointer h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-100 group-hover:border-blue-50"
                  >
                    <img src={previewMiembro} alt="Vista previa" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Upload className="h-6 w-6 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Cambiar</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-500">Vista previa de la foto</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMiembroForm((prev) => ({ ...prev, foto: null }));
                      setPreviewMiembro(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="mt-2 text-xs font-bold text-red-500 hover:text-red-700 transition"
                  >
                    Quitar foto
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full cursor-pointer flex flex-col items-center py-4"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3 transition group-hover:bg-blue-100">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 font-medium">Seleccionar una fotografía</p>
                  <p className="mt-1 text-xs text-slate-400">Arrastra una imagen o haz clic para buscar en tus archivos</p>
                  <p className="mt-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-md">PNG, JPG o WEBP</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleMiembroFileChange} className="hidden" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit"
              className="w-full sm:w-auto rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 text-center">
              {editandoMiembro !== null ? "Guardar cambios" : "Agregar miembro"}
            </button>
            <button type="button" onClick={limpiarMiembroForm}
              className="w-full sm:w-auto rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300 text-center">
              Cancelar
            </button>
          </div>
        </form>

        <div className="mt-8 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data.miembros.length > 0 ? data.miembros.map((miembro, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex flex-col items-center text-center">
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-200">
                    {miembro.foto
                      ? <img src={construirUrlImagen(miembro.foto)} alt={miembro.nombre} className="h-full w-full object-cover" />
                      : <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">Sin foto</div>}
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-900 w-full break-all">{miembro.nombre}</h3>
                  <p className="text-xs text-slate-500 w-full break-all mt-0.5">{miembro.cargo}</p>
                </div>
                <div className="mt-4 flex justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleEditarMiembro(miembro, index)}
                    title="Editar miembro"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:scale-105 active:scale-95"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEliminarMiembro(index)}
                    title="Eliminar miembro"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 hover:scale-105 active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-slate-500">No hay miembros registrados.</div>
            )}
          </div>
        </div>
      </section>

      <section id="seccion-cobertura" className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Cobertura y Alcance</h2>
        </div>
        <form onSubmit={handleGuardarCobertura} className="space-y-5">
          {editandoCobertura !== null && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span>Estás en <strong>Modo Edición</strong> para la cobertura <strong>"{coberturaForm.valor}"</strong>. Edita los campos abajo y presiona "Guardar cambios".</span>
              </div>
              <button type="button" onClick={limpiarCoberturaForm} className="text-xs font-bold text-amber-700 hover:underline shrink-0 text-left">
                Cancelar edición
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Valor:</label>
              <input type="text" value={coberturaForm.valor}
                onChange={(e) => setCoberturaForm((prev) => ({ ...prev, valor: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Descripción:</label>
              <input type="text" value={coberturaForm.descripcion}
                onChange={(e) => setCoberturaForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit"
              className="w-full sm:w-auto rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 text-center">
              {editandoCobertura !== null ? "Guardar cambios" : "Agregar dato"}
            </button>
            <button type="button" onClick={limpiarCoberturaForm}
              className="w-full sm:w-auto rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300 text-center">
              Cancelar
            </button>
          </div>
        </form>

        <div className="mt-8 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data.cobertura.length > 0 ? data.cobertura.map((item, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center flex flex-col justify-between">
                <div>
                  <p className="text-2xl font-extrabold text-blue-700 w-full break-all">{item.valor}</p>
                  <p className="mt-1 text-xs text-slate-500 w-full break-all">{item.descripcion}</p>
                </div>
                <div className="mt-4 flex justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleEditarCobertura(item, index)}
                    title="Editar cobertura"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:scale-105 active:scale-95"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEliminarCobertura(index)}
                    title="Eliminar cobertura"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 hover:scale-105 active:scale-95"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-slate-500">No hay datos de cobertura registrados.</div>
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
                Tienes modificaciones pendientes en esta sección. Si sales ahora, perderás todos tus cambios en Sobre Nosotros de forma permanente.
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

export default AdminSobreNosotros;