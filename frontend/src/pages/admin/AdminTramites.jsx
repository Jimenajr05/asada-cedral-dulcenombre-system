import { useEffect, useMemo, useState } from "react";
import { FileText, Pencil, Trash2, Plus, Upload, X, Search } from "lucide-react";
import {
  getTramitesAdmin, createTramite, updateTramite, deleteTramite,
} from "../../services/tramiteService";

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
function AdminTramites() {
  const [loading, setLoading] = useState(true);
  const [tramites, setTramites] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [toasts, setToasts] = useState([]);
  const [form, setForm] = useState({ titulo: "", requisitosTexto: "", archivo: null });

  // ── Toast helpers ──
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const addToast = (type, message, extra = {}) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message, ...extra }]);
    if (type !== "confirm") setTimeout(() => removeToast(id), 3500);
    return id;
  };
  const showSuccess = (msg) => addToast("success", msg);
  const showError   = (msg) => addToast("error", msg);
  const showConfirm = (msg) =>
    new Promise((resolve) => {
      const id = addToast("confirm", msg, {
        onConfirm: () => { removeToast(id); resolve(true); },
        onCancel:  () => { removeToast(id); resolve(false); },
      });
    });

  const construirUrlArchivo = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  const cargarTramites = async () => {
    try {
      setLoading(true);
      const data = await getTramitesAdmin();
      setTramites(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(error.message || "Error al cargar trámites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarTramites(); }, []);

  const tramitesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return tramites;
    return tramites.filter((tramite) => {
      const titulo = tramite.titulo?.toLowerCase() || "";
      const requisitos = Array.isArray(tramite.requisitos)
        ? tramite.requisitos.map((r) => r.texto?.toLowerCase() || "").join(" ") : "";
      return titulo.includes(texto) || requisitos.includes(texto);
    });
  }, [tramites, busqueda]);

  const limpiarFormulario = () => {
    setForm({ titulo: "", requisitosTexto: "", archivo: null });
    setEditandoId(null);
    setMostrarFormulario(false);
    const inputArchivo = document.getElementById("archivo");
    if (inputArchivo) inputArchivo.value = "";
  };

  const abrirFormularioNuevo = () => {
    setForm({ titulo: "", requisitosTexto: "", archivo: null });
    setEditandoId(null);
    setMostrarFormulario(true);
    const inputArchivo = document.getElementById("archivo");
    if (inputArchivo) inputArchivo.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "archivo") { setForm((prev) => ({ ...prev, archivo: files[0] || null })); return; }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo.trim()) { showError("Debes completar la descripción"); return; }

    const requisitos = form.requisitosTexto.split("\n").map((item) => item.trim()).filter(Boolean);
    const formData = new FormData();
    formData.append("titulo", form.titulo.trim());
    formData.append("buttonText", "Descargar Formulario");
    formData.append("requisitos", JSON.stringify(requisitos));
    if (form.archivo) formData.append("archivo", form.archivo);

    try {
      if (editandoId) {
        await updateTramite(editandoId, formData);
        showSuccess("Trámite actualizado correctamente");
      } else {
        await createTramite(formData);
        showSuccess("Trámite creado correctamente");
      }
      limpiarFormulario();
      await cargarTramites();
    } catch (error) {
      showError(error.message || "Error al guardar trámite");
    }
  };

  const handleEditar = (tramite) => {
    setEditandoId(tramite._id);
    setForm({
      titulo: tramite.titulo || "",
      requisitosTexto: Array.isArray(tramite.requisitos)
        ? tramite.requisitos.map((item) => item.texto).join("\n") : "",
      archivo: null,
    });
    setMostrarFormulario(true);
    const inputArchivo = document.getElementById("archivo");
    if (inputArchivo) inputArchivo.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    const confirmed = await showConfirm("¿Deseas eliminar este trámite?");
    if (!confirmed) return;
    try {
      await deleteTramite(id);
      await cargarTramites();
      if (editandoId === id) limpiarFormulario();
      showSuccess("Trámite eliminado correctamente");
    } catch (error) {
      showError(error.message || "Error al eliminar trámite");
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-100 p-7">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-700 shadow-sm">Cargando trámites...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-slate-100 p-7">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Gestión de Trámites</h1>
          <p className="mt-2 text-lg text-slate-700">Administra los trámites y archivos descargables del sitio.</p>
        </div>
        {!mostrarFormulario && (
          <button type="button" onClick={abrirFormularioNuevo}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-5 w-5" /> Agregar trámite
          </button>
        )}
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Plus className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">{editandoId ? "Editar trámite" : "Nuevo trámite"}</h2>
            </div>
            <button type="button" onClick={limpiarFormulario}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
              <X className="h-4 w-4" /> Cerrar
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Descripción</label>
              <input type="text" name="titulo" value={form.titulo} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Requisitos (uno por línea)</label>
              <textarea name="requisitosTexto" rows="5" value={form.requisitosTexto} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Archivo</label>
              <input id="archivo" type="file" name="archivo" onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-100" />
              <p className="mt-2 text-sm text-slate-500">
                El botón público siempre mostrará <span className="font-semibold text-slate-700">Descargar Formulario</span>.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="submit"
                className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                {editandoId ? "Guardar cambios" : "Agregar trámite"}
              </button>
              <button type="button" onClick={limpiarFormulario}
                className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300">
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Lista */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Trámites registrados</h2>
              <p className="text-sm text-slate-500">{tramitesFiltrados.length} resultado{tramitesFiltrados.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar trámite..."
              className="w-full rounded-2xl border border-slate-300 py-3 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {tramitesFiltrados.length > 0 ? (
          <>
            {/* Tabla desktop */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 lg:block">
              <div className="max-h-[520px] overflow-y-auto">
                <table className="min-w-full border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-100">
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Descripción</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Requisitos</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Archivo</th>
                      <th className="px-4 py-4 text-right text-sm font-semibold text-slate-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {tramitesFiltrados.map((tramite) => (
                      <tr key={tramite._id} className="border-b border-slate-200 align-top hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-900">{tramite.titulo}</p>
                          <p className="mt-1 text-xs text-slate-500">Botón público: Descargar Formulario</p>
                        </td>
                        <td className="max-w-[280px] px-4 py-4 text-sm text-slate-600">
                          {Array.isArray(tramite.requisitos) && tramite.requisitos.length > 0 ? (
                            <ul className="space-y-1">
                              {tramite.requisitos.slice(0, 3).map((req, i) => (
                                <li key={i} className="line-clamp-1">• {req.texto}</li>
                              ))}
                              {tramite.requisitos.length > 3 && (
                                <li className="text-xs text-slate-500">+ {tramite.requisitos.length - 3} requisito(s) más</li>
                              )}
                            </ul>
                          ) : <span className="text-slate-400">Sin requisitos</span>}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {tramite.archivoUrl ? (
                            <a href={construirUrlArchivo(tramite.archivoUrl)} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800">
                              <Upload className="h-4 w-4" /> Ver archivo
                            </a>
                          ) : <span className="text-slate-400">No disponible</span>}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => handleEditar(tramite)}
                              className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100">
                              <Pencil className="h-4 w-4" /> Editar
                            </button>
                            <button type="button" onClick={() => handleEliminar(tramite._id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
                              <Trash2 className="h-4 w-4" /> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cards mobile */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {tramitesFiltrados.map((tramite) => (
                <div key={tramite._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{tramite.titulo}</h3>
                      <p className="mt-1 text-xs text-slate-500">Botón público: Descargar Formulario</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-slate-800">Requisitos:</p>
                    <ul className="space-y-1 text-sm text-slate-600">
                      {Array.isArray(tramite.requisitos) && tramite.requisitos.length > 0
                        ? tramite.requisitos.slice(0, 3).map((req, i) => <li key={i}>• {req.texto}</li>)
                        : <li>Sin requisitos registrados.</li>}
                    </ul>
                  </div>
                  {tramite.archivoUrl && (
                    <a href={construirUrlArchivo(tramite.archivoUrl)} target="_blank" rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                      <Upload className="h-4 w-4" /> Ver archivo
                    </a>
                  )}
                  <div className="mt-5 flex gap-3">
                    <button type="button" onClick={() => handleEditar(tramite)}
                      className="flex-1 rounded-2xl bg-blue-50 px-4 py-3 text-blue-600 transition hover:bg-blue-100">
                      <span className="inline-flex items-center gap-2"><Pencil className="h-4 w-4" /> Editar</span>
                    </button>
                    <button type="button" onClick={() => handleEliminar(tramite._id)}
                      className="flex-1 rounded-2xl bg-red-50 px-4 py-3 text-red-600 transition hover:bg-red-100">
                      <span className="inline-flex items-center gap-2"><Trash2 className="h-4 w-4" /> Eliminar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
            {busqueda.trim() ? "No se encontraron trámites con esa búsqueda." : "No hay trámites registrados."}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminTramites;