import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, Users, Droplets, Leaf, FolderOpen, ShieldCheck,
  Hammer, Plus, Trash2, Check, AlertCircle, Info, CheckCircle2,
} from "lucide-react";
import { getAvisos } from "../../services/avisoService";
import { getProyectosAdmin } from "../../services/proyectoService";
import { getTramitesAdmin } from "../../services/tramiteService";
import { getTareas, crearTarea, toggleTarea, eliminarTarea } from "../../services/tareaService";

const prioridadConfig = {
  alta:  { color: "bg-red-50 border-l-4 border-red-500",    badge: "bg-red-100 text-red-600",    label: "Alta" },
  media: { color: "bg-amber-50 border-l-4 border-amber-500", badge: "bg-amber-100 text-amber-600", label: "Media" },
  baja:  { color: "bg-blue-50 border-l-4 border-blue-500",  badge: "bg-blue-100 text-blue-600",  label: "Baja" },
};

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
            style={{ animation: "slideIn 0.3s ease" }}>
            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold
              ${isSuccess ? "bg-emerald-500" : isConfirm ? "bg-amber-500" : "bg-red-500"}`}>
              {isSuccess ? "✓" : isConfirm ? "?" : "✕"}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{isSuccess ? "¡Éxito!" : isConfirm ? "Confirmar" : "Error"}</p>
              <p className="text-sm mt-0.5 opacity-80">{t.message}</p>
              {isConfirm && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => t.onConfirm()} className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition">Eliminar</button>
                  <button onClick={() => t.onCancel()} className="rounded-xl bg-slate-200 px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-300 transition">Cancelar</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}

export default function AdminPanel() {
  const [avisos,    setAvisos]    = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [tramites,  setTramites]  = useState([]);
  const [tareas,    setTareas]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [toasts,    setToasts]    = useState([]);

  const [nuevaTarea,     setNuevaTarea]     = useState("");
  const [prioridadNueva, setPrioridadNueva] = useState("media");

  // ── Toast helpers ──
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  const addToast = (type, message, extra = {}) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, message, ...extra }]);
    if (type !== "confirm") setTimeout(() => removeToast(id), 3500);
    return id;
  };
  const showSuccess = (msg) => addToast("success", msg);
  const showError   = (msg) => addToast("error", msg);
  const showConfirm = (msg) => new Promise((resolve) => {
    const id = addToast("confirm", msg, {
      onConfirm: () => { removeToast(id); resolve(true); },
      onCancel:  () => { removeToast(id); resolve(false); },
    });
  });

  useEffect(() => {
    const cargar = async () => {
      try {
        const [a, p, tr, ta] = await Promise.all([
          getAvisos(),
          getProyectosAdmin(),
          getTramitesAdmin(),
          getTareas(),
        ]);
        setAvisos(a);
        setProyectos(p);
        setTramites(tr);
        setTareas(ta);
      } catch (e) {
        showError("Error al cargar datos del dashboard");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const handleCrearTarea = async () => {
    if (!nuevaTarea.trim()) { showError("Escribe el texto de la tarea"); return; }
    try {
      const { tarea } = await crearTarea({ texto: nuevaTarea.trim(), prioridad: prioridadNueva });
      setTareas((prev) => [tarea, ...prev]);
      setNuevaTarea("");
      showSuccess("Tarea creada");
    } catch (e) { showError(e.message); }
  };

  const handleToggle = async (id) => {
    try {
      const { tarea } = await toggleTarea(id);
      setTareas((prev) => prev.map((t) => t._id === id ? tarea : t));
    } catch (e) { showError(e.message); }
  };

  const handleEliminar = async (id) => {
    if (!await showConfirm("¿Eliminar esta tarea?")) return;
    try {
      await eliminarTarea(id);
      setTareas((prev) => prev.filter((t) => t._id !== id));
      showSuccess("Tarea eliminada");
    } catch (e) { showError(e.message); }
  };

  // Stats calculadas
  const avisosPublicados  = avisos.filter((a) => a.estado === "publicado").length;
  const avisosUrgentes    = avisos.filter((a) => a.tipo === "urgente").length;
  const proyectosActivos  = proyectos.filter((p) => p.estado === "En progreso").length;
  const tareasCompletadas = tareas.filter((t) => t.completada).length;
  const tareasPendientes  = tareas.filter((t) => !t.completada);
  const ultimoAviso       = avisos[0];
  const ultimoProyecto    = proyectos[0];

  const stats = [
    { label: "Avisos publicados",  value: avisosPublicados, icon: Bell,       color: "bg-blue-500",    sub: `${avisosUrgentes} urgente${avisosUrgentes !== 1 ? "s" : ""}` },
    { label: "Proyectos activos",  value: proyectosActivos, icon: Hammer,     color: "bg-indigo-500",  sub: `${proyectos.length} en total` },
    { label: "Trámites",           value: tramites.length,  icon: FolderOpen, color: "bg-emerald-500", sub: "disponibles" },
    { label: "Tareas completadas", value: tareasCompletadas,icon: Check,      color: "bg-amber-500",   sub: `${tareas.length} en total` },
  ];

  const accesosRapidos = [
    { label: "Nuevo aviso",    icon: Bell,       path: "/admin/avisos",         color: "bg-blue-50 text-blue-600 hover:bg-blue-100" },
    { label: "Nuevo proyecto", icon: Hammer,     path: "/admin/proyectos",      color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" },
    { label: "Gestión Agua",   icon: Droplets,   path: "/admin/gestion-agua",   color: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100" },
    { label: "Sostenibilidad", icon: Leaf,       path: "/admin/sostenibilidad", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" },
    { label: "Trámites",       icon: FolderOpen, path: "/admin/tramites",       color: "bg-orange-50 text-orange-600 hover:bg-orange-100" },
    { label: "Transparencia",  icon: ShieldCheck,path: "/admin/transparencia",  color: "bg-purple-50 text-purple-600 hover:bg-purple-100" },
  ];

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
    </div>
  );

  return (
    <div className="space-y-8">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Encabezado */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-sky-600">Sistema ASADA</p>
        <h1 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Resumen general del sistema ASADA Cedral y Dulce Nombre</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-400 to-teal-400" />
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5 text-white" strokeWidth={2.2} />
                </div>
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{stat.label}</p>
              <p className="mt-1 text-4xl font-extrabold text-slate-900 leading-none" style={{ fontFamily: "var(--font-display)" }}>{stat.value}</p>
              <p className="mt-2 text-xs text-slate-400">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Fila principal */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">

        {/* Columna izquierda */}
        <div className="space-y-6">

          {/* Accesos rápidos */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Accesos Rápidos</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {accesosRapidos.map((a) => {
                const Icon = a.icon;
                return (
                  <Link key={a.label} to={a.path}
                    className={`flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3.5 text-sm font-semibold transition hover:shadow-sm ${a.color}`}>
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span>{a.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Últimas novedades */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Últimas Novedades</h2>
            <div className="space-y-4">

              {/* Último aviso */}
              {ultimoAviso && (
                <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    {ultimoAviso.tipo === "urgente"
                      ? <AlertCircle className="h-5 w-5 text-red-500" />
                      : ultimoAviso.tipo === "completado"
                      ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      : <Info className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-400 mb-0.5">Último aviso</p>
                    <p className="font-semibold text-slate-900 truncate">{ultimoAviso.titulo}</p>
                    <p className="text-sm text-slate-500 line-clamp-1">{ultimoAviso.descripcion}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(ultimoAviso.createdAt).toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold
                    ${ultimoAviso.estado === "publicado" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {ultimoAviso.estado}
                  </span>
                </div>
              )}

              {/* Último proyecto */}
              {ultimoProyecto && (
                <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                    <Hammer className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-400 mb-0.5">Último proyecto</p>
                    <p className="font-semibold text-slate-900 truncate">{ultimoProyecto.titulo}</p>
                    {ultimoProyecto.descripcion && (
                      <p className="text-sm text-slate-500 line-clamp-1">{ultimoProyecto.descripcion}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(ultimoProyecto.createdAt).toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {ultimoProyecto.estado}
                  </span>
                </div>
              )}

              {!ultimoAviso && !ultimoProyecto && (
                <p className="text-slate-400 text-sm">No hay novedades recientes.</p>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha — Tareas */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>Tareas Pendientes</h2>

          {/* Crear tarea */}
          <div className="mb-5 space-y-3">
            <textarea
              value={nuevaTarea}
              onChange={(e) => setNuevaTarea(e.target.value)}
              placeholder="Nueva tarea..."
              rows={2}
              className="input-field resize-none"
            />
            <div className="flex gap-2">
              <select value={prioridadNueva} onChange={(e) => setPrioridadNueva(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100">
                <option value="alta">🔴 Alta</option>
                <option value="media">🟡 Media</option>
                <option value="baja">🔵 Baja</option>
              </select>
              <button onClick={handleCrearTarea}
                className="btn-glow flex items-center gap-1.5 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white">
                <Plus className="h-4 w-4" /> Agregar
              </button>
            </div>
          </div>

          {/* Lista tareas pendientes */}
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {tareasPendientes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
                No hay tareas pendientes 🎉
              </div>
            ) : (
              tareasPendientes.map((tarea) => {
                const cfg = prioridadConfig[tarea.prioridad] || prioridadConfig.media;
                return (
                  <div key={tarea._id}
                    className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 ${cfg.color}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <button onClick={() => handleToggle(tarea._id)}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-400 hover:border-emerald-500 hover:bg-emerald-50 transition">
                      </button>
                      <p className="text-sm font-medium text-slate-800 line-clamp-2">{tarea.texto}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                      <button onClick={() => handleEliminar(tarea._id)}
                        className="text-slate-400 hover:text-red-500 transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Tareas completadas */}
          {tareasCompletadas > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 mb-3">COMPLETADAS ({tareasCompletadas})</p>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {tareas.filter((t) => t.completada).map((tarea) => (
                  <div key={tarea._id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 opacity-60">
                    <div className="flex items-center gap-3 min-w-0">
                      <button onClick={() => handleToggle(tarea._id)}
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 border-2 border-emerald-500 transition">
                        <Check className="h-3 w-3 text-white" />
                      </button>
                      <p className="text-sm text-slate-500 line-through line-clamp-1">{tarea.texto}</p>
                    </div>
                    <button onClick={() => handleEliminar(tarea._id)}
                      className="text-slate-300 hover:text-red-400 transition shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}