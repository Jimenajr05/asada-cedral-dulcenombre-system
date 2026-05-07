import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Plus, Pin, Eye, EyeOff, Pencil, Trash2,
  CalendarDays, AlertCircle, Info, CheckCircle2, Check, X,
} from "lucide-react";
import {
  getAvisos, createAviso, updateAviso, deleteAviso,
} from "../../services/avisoService";

// ── Toast ──────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3" style={{ minWidth: 300, maxWidth: 400 }}>
      {toasts.map((t) => {
        const isSuccess = t.type === "success";
        const isConfirm = t.type === "confirm";
        return (
          <div key={t.id}
            className={`flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-md transition-all duration-300
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

function AdminAvisos() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [avisoEditandoId, setAvisoEditandoId] = useState(null);
  const [toasts, setToasts] = useState([]);

  const [form, setForm] = useState({
    titulo: "", descripcion: "", tipo: "info",
    estado: "publicado", fijado: false, fecha: new Date(),
  });

  const addToast = (type, message, extra = {}) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message, ...extra }]);
    if (type !== "confirm") setTimeout(() => removeToast(id), 3500);
    return id;
  };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const showSuccess = (msg) => addToast("success", msg);
  const showError = (msg) => addToast("error", msg);
  const showConfirm = (msg) =>
    new Promise((resolve) => {
      const id = addToast("confirm", msg, {
        onConfirm: () => { removeToast(id); resolve(true); },
        onCancel: () => { removeToast(id); resolve(false); },
      });
    });

  const cargarAvisos = async () => {
    try {
      setLoading(true);
      const data = await getAvisos();
      setAvisos(data);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarAvisos(); }, []);

  const resetForm = () => {
    setForm({ titulo: "", descripcion: "", tipo: "info", estado: "publicado", fijado: false, fecha: new Date() });
    setModoEdicion(false);
    setAvisoEditandoId(null);
  };

  const abrirNuevoFormulario = () => { resetForm(); setShowForm(true); };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        titulo: form.titulo, descripcion: form.descripcion,
        tipo: form.tipo, estado: form.estado, fijado: form.fijado,
      };
      if (modoEdicion && avisoEditandoId) {
        await updateAviso(avisoEditandoId, payload);
        showSuccess("Aviso actualizado correctamente");
      } else {
        await createAviso(payload);
        showSuccess("Aviso creado correctamente");
      }
      resetForm();
      setShowForm(false);
      cargarAvisos();
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm("¿Deseas eliminar este aviso?");
    if (!confirmed) return;
    try {
      await deleteAviso(id);
      showSuccess("Aviso eliminado correctamente");
      if (avisoEditandoId === id) { resetForm(); setShowForm(false); }
      cargarAvisos();
    } catch (error) {
      showError(error.message);
    }
  };

  const handleCancel = () => { resetForm(); setShowForm(false); };

  const handleEdit = (aviso) => {
    setModoEdicion(true);
    setAvisoEditandoId(aviso._id);
    setShowForm(true);
    setForm({
      titulo: aviso.titulo || "", descripcion: aviso.descripcion || "",
      tipo: aviso.tipo || "info", estado: aviso.estado || "publicado",
      fijado: !!aviso.fijado, fecha: aviso.createdAt ? new Date(aviso.createdAt) : new Date(),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFijado = async (aviso) => {
    try {
      await updateAviso(aviso._id, { ...aviso, fijado: !aviso.fijado });
      if (avisoEditandoId === aviso._id)
        setForm((prev) => ({ ...prev, fijado: !aviso.fijado }));
      cargarAvisos();
    } catch (error) { showError(error.message); }
  };

  const handleToggleEstado = async (aviso) => {
    try {
      const nuevoEstado = aviso.estado === "publicado" ? "borrador" : "publicado";
      await updateAviso(aviso._id, { ...aviso, estado: nuevoEstado });
      if (avisoEditandoId === aviso._id)
        setForm((prev) => ({ ...prev, estado: nuevoEstado }));
      cargarAvisos();
    } catch (error) { showError(error.message); }
  };

  const handleToggleTipo = async (aviso) => {
    try {
      const nuevoTipo = aviso.tipo === "completado" ? "info" : "completado";
      await updateAviso(aviso._id, { ...aviso, tipo: nuevoTipo });
      if (avisoEditandoId === aviso._id)
        setForm((prev) => ({ ...prev, tipo: nuevoTipo }));
      cargarAvisos();
    } catch (error) { showError(error.message); }
  };

  const getTipoBadge = (tipo) => {
    if (tipo === "urgente")
      return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600 whitespace-nowrap"><AlertCircle className="h-3.5 w-3.5 shrink-0" /> Urgente</span>;
    if (tipo === "completado")
      return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 whitespace-nowrap"><CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Completado</span>;
    return <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-600 whitespace-nowrap"><Info className="h-3.5 w-3.5 shrink-0" /> Información</span>;
  };

  const getEstadoBadge = (estado) =>
    estado === "publicado"
      ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-600 whitespace-nowrap">Publicado</span>
      : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 whitespace-nowrap">Borrador</span>;

  return (
    <div className="space-y-8">
      <Toast toasts={toasts} />

      {/* ENCABEZADO */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Gestión de Avisos</h1>
          <p className="mt-2 text-lg text-slate-700">Crear, editar y administrar avisos públicos.</p>
        </div>
        <button type="button" onClick={abrirNuevoFormulario}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <Plus className="h-5 w-5" /> Nuevo Aviso
        </button>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-6 text-3xl font-bold text-black">{modoEdicion ? "Editar Aviso" : "Nuevo Aviso"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">Título del aviso:</label>
                <input type="text" name="titulo" value={form.titulo} onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">Tipo:</label>
                <select name="tipo" value={form.tipo} onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <option value="info">Información</option>
                  <option value="urgente">Urgente</option>
                  <option value="completado">Completado</option>
                </select>
              </div>
            </div>
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-black">Contenido:</label>
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                rows="5" required
                className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1fr_1fr]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">Fecha:</label>
                <div className="relative">
                  <DatePicker selected={form.fecha}
                    onChange={(date) => setForm((prev) => ({ ...prev, fecha: date }))}
                    dateFormat="MM/dd/yyyy"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-base text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                  <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
                </div>
              </div>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3 px-2 py-3 text-base text-black">
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <input type="checkbox" checked={form.estado === "publicado"}
                      onChange={(e) => setForm((prev) => ({ ...prev, estado: e.target.checked ? "publicado" : "borrador" }))}
                      className="peer absolute h-5 w-5 cursor-pointer appearance-none rounded-[4px] border border-slate-500 bg-white" />
                    <Check className="pointer-events-none z-10 hidden h-3.5 w-3.5 text-black peer-checked:block" />
                  </span>
                  Publicado
                </label>
              </div>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3 px-2 py-3 text-base text-black">
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <input type="checkbox" checked={form.fijado}
                      onChange={(e) => setForm((prev) => ({ ...prev, fijado: e.target.checked }))}
                      className="peer absolute h-5 w-5 cursor-pointer appearance-none rounded-[4px] border border-slate-500 bg-white" />
                    <Check className="pointer-events-none z-10 hidden h-3.5 w-3.5 text-black peer-checked:block" />
                  </span>
                  Destacado
                </label>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <button type="submit"
                className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                {modoEdicion ? "Actualizar Aviso" : "Crear Aviso"}
              </button>
              <button type="button" onClick={handleCancel}
                className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLA */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="hidden md:grid md:grid-cols-[1fr_auto_auto_auto_auto] border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 gap-4">
          <div>Aviso</div>
          <div className="w-28">Tipo</div>
          <div className="w-28">Fecha</div>
          <div className="w-24">Estado</div>
          <div className="w-32 text-center">Acciones</div>
        </div>
        {loading ? (
          <div className="p-6 text-slate-500">Cargando avisos...</div>
        ) : avisos.length === 0 ? (
          <div className="p-6 text-slate-500">No hay avisos registrados.</div>
        ) : (
          avisos.map((aviso) => (
            <div key={aviso._id}
              className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:grid md:grid-cols-[1fr_auto_auto_auto_auto] md:items-center md:gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <Pin className={`mt-1 h-4 w-4 shrink-0 ${aviso.fijado ? "text-blue-600" : "text-slate-300"}`} />
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-tight text-slate-900 truncate">{aviso.titulo}</h3>
                  <p className="mt-0.5 text-sm text-slate-500 line-clamp-2">{aviso.descripcion}</p>
                </div>
              </div>
              <div className="w-28 shrink-0">{getTipoBadge(aviso.tipo)}</div>
              <div className="w-28 shrink-0 flex items-center gap-1.5 text-sm text-slate-500">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{new Date(aviso.createdAt).toLocaleDateString("es-CR")}</span>
              </div>
              <div className="w-24 shrink-0">{getEstadoBadge(aviso.estado)}</div>
              <div className="w-32 shrink-0 flex items-center justify-center gap-3">
                <button onClick={() => handleToggleFijado(aviso)}
                  title={aviso.fijado ? "Quitar destacado" : "Destacar"}
                  className={`transition ${aviso.fijado ? "text-blue-700 hover:text-blue-800" : "text-blue-400 hover:text-blue-600"}`}>
                  <Pin className="h-4 w-4" />
                </button>
                <button onClick={() => handleToggleEstado(aviso)}
                  title={aviso.estado === "publicado" ? "Pasar a borrador" : "Publicar"}
                  className={`transition ${aviso.estado === "publicado" ? "text-emerald-600 hover:text-emerald-800" : "text-slate-400 hover:text-slate-600"}`}>
                  {aviso.estado === "publicado" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => handleToggleTipo(aviso)}
                  title={aviso.tipo === "completado" ? "Marcar como info" : "Marcar como completado"}
                  className={`transition ${aviso.tipo === "completado" ? "text-emerald-600 hover:text-emerald-800" : "text-slate-300 hover:text-emerald-500"}`}>
                  <CheckCircle2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleEdit(aviso)} title="Editar"
                  className="text-blue-600 transition hover:text-blue-800">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(aviso._id)} title="Eliminar"
                  className="text-red-500 transition hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminAvisos;