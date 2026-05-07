import { useEffect, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, Upload, FileText, Image as ImageIcon,
  ChevronDown, ChevronUp, X, FolderOpen,
} from "lucide-react";
import {
  getProyectosAdmin, createProyecto, updateProyecto, deleteProyecto,
  addFotoProyecto, deleteFotoProyecto,
  addDocumentoProyecto, deleteDocumentoProyecto,
  addActualizacion, updateActualizacion, deleteActualizacion,
  BASE_URL,
} from "../../services/proyectoService";

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
              <p className="font-semibold text-sm leading-snug">{isSuccess ? "¡Éxito!" : isConfirm ? "Confirmar" : "Error"}</p>
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

const ESTADOS = ["En progreso", "Completado", "Pausado", "Planificado"];

const estadoBadge = (estado) => {
  const map = {
    "En progreso": "bg-blue-100 text-blue-700",
    "Completado": "bg-emerald-100 text-emerald-700",
    "Pausado": "bg-amber-100 text-amber-700",
    "Planificado": "bg-slate-100 text-slate-600",
  };
  return map[estado] || "bg-slate-100 text-slate-600";
};

/* ========================= COMPONENTE PRINCIPAL ========================= */
export default function AdminProyectos() {
  const fotoRef = useRef(null);
  const docRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [proyectos, setProyectos] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [expandido, setExpandido] = useState(null); // id del proyecto abierto

  // Formulario proyecto
  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [proyectoForm, setProyectoForm] = useState({ titulo: "", descripcion: "", estado: "En progreso" });

  // Fotos
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoAlt, setFotoAlt] = useState("");

  // Documentos
  const [docFile, setDocFile] = useState(null);
  const [docNombre, setDocNombre] = useState("");

  // Actualizaciones
  const [actTexto, setActTexto] = useState("");
  const [editandoActId, setEditandoActId] = useState(null);
  const [editandoActTexto, setEditandoActTexto] = useState("");

  // ── Toast helpers ──
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));
  const addToast = (type, message, extra = {}) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, message, ...extra }]);
    if (type !== "confirm") setTimeout(() => removeToast(id), 3500);
    return id;
  };
  const showSuccess = (msg) => addToast("success", msg);
  const showError = (msg) => addToast("error", msg);
  const showConfirm = (msg) => new Promise((resolve) => {
    const id = addToast("confirm", msg, {
      onConfirm: () => { removeToast(id); resolve(true); },
      onCancel: () => { removeToast(id); resolve(false); },
    });
  });

  const cargar = async () => {
    try { setLoading(true); setProyectos(await getProyectosAdmin()); }
    catch (e) { showError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargar(); }, []);

  const resetForm = () => {
    setProyectoForm({ titulo: "", descripcion: "", estado: "En progreso" });
    setEditandoId(null); setShowForm(false);
  };

  // ── CRUD Proyecto ──
  const handleSubmitProyecto = async (e) => {
    e.preventDefault();
    if (!proyectoForm.titulo.trim()) { showError("El título es obligatorio"); return; }
    try {
      const fd = new FormData();
      fd.append("titulo", proyectoForm.titulo.trim());
      fd.append("descripcion", proyectoForm.descripcion.trim());
      fd.append("estado", proyectoForm.estado);
      if (editandoId) { await updateProyecto(editandoId, fd); showSuccess("Proyecto actualizado"); }
      else { await createProyecto(fd); showSuccess("Proyecto creado"); }
      resetForm(); await cargar();
    } catch (e) { showError(e.message); }
  };

  const handleEditar = (p) => {
    setEditandoId(p._id);
    setProyectoForm({ titulo: p.titulo, descripcion: p.descripcion || "", estado: p.estado || "En progreso" });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (!await showConfirm("¿Deseas eliminar este proyecto?")) return;
    try { await deleteProyecto(id); showSuccess("Proyecto eliminado"); await cargar(); }
    catch (e) { showError(e.message); }
  };

  // ── Fotos ──
  const handleSubirFoto = async (proyectoId) => {
    if (!fotoFile) { showError("Selecciona una imagen"); return; }
    try {
      const fd = new FormData();
      fd.append("imagen", fotoFile);
      fd.append("alt", fotoAlt);
      await addFotoProyecto(proyectoId, fd);
      showSuccess("Foto subida correctamente");
      setFotoFile(null); setFotoAlt("");
      if (fotoRef.current) fotoRef.current.value = "";
      await cargar();
    } catch (e) { showError(e.message); }
  };

  const handleEliminarFoto = async (proyectoId, fotoId) => {
    if (!await showConfirm("¿Eliminar esta foto?")) return;
    try { await deleteFotoProyecto(proyectoId, fotoId); showSuccess("Foto eliminada"); await cargar(); }
    catch (e) { showError(e.message); }
  };

  // ── Documentos ──
  const handleSubirDoc = async (proyectoId) => {
    if (!docFile) { showError("Selecciona un documento"); return; }
    try {
      const fd = new FormData();
      fd.append("archivo", docFile);
      fd.append("nombre", docNombre || docFile.name);
      await addDocumentoProyecto(proyectoId, fd);
      showSuccess("Documento subido correctamente");
      setDocFile(null); setDocNombre("");
      if (docRef.current) docRef.current.value = "";
      await cargar();
    } catch (e) { showError(e.message); }
  };

  const handleEliminarDoc = async (proyectoId, docId) => {
    if (!await showConfirm("¿Eliminar este documento?")) return;
    try { await deleteDocumentoProyecto(proyectoId, docId); showSuccess("Documento eliminado"); await cargar(); }
    catch (e) { showError(e.message); }
  };

  // ── Actualizaciones ──
  const handleAddActualizacion = async (proyectoId) => {
    if (!actTexto.trim()) { showError("Escribe el texto de la actualización"); return; }
    try {
      await addActualizacion(proyectoId, { texto: actTexto.trim() });
      showSuccess("Actualización agregada"); setActTexto(""); await cargar();
    } catch (e) { showError(e.message); }
  };

  const handleUpdateActualizacion = async (proyectoId, actId) => {
    if (!editandoActTexto.trim()) { showError("El texto no puede estar vacío"); return; }
    try {
      await updateActualizacion(proyectoId, actId, { texto: editandoActTexto.trim() });
      showSuccess("Actualización editada"); setEditandoActId(null); setEditandoActTexto(""); await cargar();
    } catch (e) { showError(e.message); }
  };

  const handleDeleteActualizacion = async (proyectoId, actId) => {
    if (!await showConfirm("¿Eliminar esta actualización?")) return;
    try { await deleteActualizacion(proyectoId, actId); showSuccess("Actualización eliminada"); await cargar(); }
    catch (e) { showError(e.message); }
  };

  if (loading) return <div className="space-y-8"><div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-700">Cargando proyectos...</div></div>;

  return (
    <div className="space-y-8">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Encabezado */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Gestión de Proyectos</h1>
          <p className="mt-2 text-lg text-slate-700">Administra proyectos, fotos, documentos y actualizaciones.</p>
        </div>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
            <Plus className="h-5 w-5" /> Nuevo proyecto
          </button>
        )}
      </div>

      {/* Formulario proyecto */}
      {showForm && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">{editandoId ? "Editar proyecto" : "Nuevo proyecto"}</h2>
            <button onClick={resetForm} className="rounded-xl bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 transition"><X className="h-5 w-5" /></button>
          </div>
          <form onSubmit={handleSubmitProyecto} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Nombre del proyecto:</label>
                <input type="text" value={proyectoForm.titulo}
                  onChange={(e) => setProyectoForm((p) => ({ ...p, titulo: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">Estado:</label>
                <select value={proyectoForm.estado}
                  onChange={(e) => setProyectoForm((p) => ({ ...p, estado: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  {ESTADOS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">Descripción:</label>
              <textarea value={proyectoForm.descripcion} rows={4}
                onChange={(e) => setProyectoForm((p) => ({ ...p, descripcion: e.target.value }))}
                placeholder="Describe el proyecto..."
                className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 transition">
                {editandoId ? "Guardar cambios" : "Crear proyecto"}
              </button>
              <button type="button" onClick={resetForm} className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-300 transition">Cancelar</button>
            </div>
          </form>
        </section>
      )}

      {/* Lista de proyectos */}
      {proyectos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">No hay proyectos registrados.</div>
      ) : (
        <div className="space-y-5">
          {proyectos.map((proyecto) => {
            const abierto = expandido === proyecto._id;
            return (
              <div key={proyecto._id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                {/* Cabecera */}
                <div className="flex items-center justify-between gap-4 px-6 py-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <FolderOpen className="h-5 w-5 shrink-0 text-blue-600" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900 truncate">{proyecto.titulo}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${estadoBadge(proyecto.estado)}`}>{proyecto.estado}</span>
                      </div>
                      {proyecto.descripcion && <p className="text-sm text-slate-500 line-clamp-1 mt-0.5">{proyecto.descripcion}</p>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button onClick={() => handleEditar(proyecto)} className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100 transition"><Pencil className="h-4 w-4" /> Editar</button>
                    <button onClick={() => handleEliminar(proyecto._id)} className="flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100 transition"><Trash2 className="h-4 w-4" /> Eliminar</button>
                    <button onClick={() => setExpandido(abierto ? null : proyecto._id)}
                      className="flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600 hover:bg-slate-200 transition">
                      {abierto ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {abierto ? "Cerrar" : "Gestionar"}
                    </button>
                  </div>
                </div>

                {/* Panel expandido */}
                {abierto && (
                  <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-8">

                    {/* FOTOS */}
                    <div>
                      <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900"><ImageIcon className="h-5 w-5 text-blue-600" /> Fotos del proyecto</h4>
                      <div className="flex flex-col gap-3 md:flex-row mb-4">
                        <input ref={fotoRef} type="file" accept="image/*" onChange={(e) => setFotoFile(e.target.files[0])}
                          className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700" />
                        <input type="text" value={fotoAlt} onChange={(e) => setFotoAlt(e.target.value)} placeholder="Descripción (opcional)"
                          className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                        <button onClick={() => handleSubirFoto(proyecto._id)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
                          <Upload className="h-4 w-4" /> Subir
                        </button>
                      </div>
                      {proyecto.fotos?.length > 0 ? (
                      <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                          {proyecto.fotos.map((foto) => (
                            <div key={foto._id} className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-white">
                              <img src={foto.src?.startsWith("http") ? foto.src : `${BASE_URL}${foto.src}`} alt={foto.alt}
                                className="h-36 w-full object-cover" />
                              <div className="p-2">
                                <p className="text-xs text-slate-500 truncate">{foto.alt || "Sin descripción"}</p>
                                <button onClick={() => handleEliminarFoto(proyecto._id, foto._id)}
                                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl bg-red-50 px-2 py-1.5 text-xs text-red-600 hover:bg-red-100 transition">
                                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      ) : <p className="text-sm text-slate-400">No hay fotos aún.</p>}
                    </div>

                    {/* DOCUMENTOS */}
                    <div>
                      <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900"><FileText className="h-5 w-5 text-blue-600" /> Documentos</h4>
                      <div className="flex flex-col gap-3 md:flex-row mb-4">
                        <input ref={docRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" onChange={(e) => setDocFile(e.target.files[0])}
                          className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700" />
                        <input type="text" value={docNombre} onChange={(e) => setDocNombre(e.target.value)} placeholder="Nombre del documento (opcional)"
                          className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                        <button onClick={() => handleSubirDoc(proyecto._id)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition">
                          <Upload className="h-4 w-4" /> Subir
                        </button>
                      </div>
                      {proyecto.documentos?.length > 0 ? (
                        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          <div className="space-y-2">
                            {proyecto.documentos.map((doc) => (
                              <div key={doc._id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                                <a href={doc.url?.startsWith("http") ? doc.url : `${BASE_URL}${doc.url}`} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline truncate">
                                  <FileText className="h-4 w-4 shrink-0" /> {doc.nombre}
                                </a>
                                <button onClick={() => handleEliminarDoc(proyecto._id, doc._id)}
                                  className="shrink-0 flex items-center gap-1 rounded-xl bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:bg-red-100 transition">
                                  <Trash2 className="h-3.5 w-3.5" /> Eliminar
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : <p className="text-sm text-slate-400">No hay documentos aún.</p>}
                    </div>

                    {/* ACTUALIZACIONES */}
                    <div>
                      <h4 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900"><Pencil className="h-5 w-5 text-blue-600" /> Actualizaciones</h4>
                      <div className="flex gap-3 mb-4">
                        <textarea value={actTexto} onChange={(e) => setActTexto(e.target.value)} rows={2}
                          placeholder="Escribe una actualización del proyecto..."
                          className="flex-1 resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                        <button onClick={() => handleAddActualizacion(proyecto._id)}
                          className="self-end inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition">
                          <Plus className="h-4 w-4" /> Agregar
                        </button>
                      </div>
                      {proyecto.actualizaciones?.length > 0 ? (
                        <div className="space-y-3">
                          {[...proyecto.actualizaciones].reverse().map((act) => (
                            <div key={act._id} className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                              <p className="text-xs text-slate-400 mb-2">
                                {new Date(act.fecha).toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric" })}
                              </p>
                              {editandoActId === act._id ? (
                                <div className="space-y-2">
                                  <textarea value={editandoActTexto} onChange={(e) => setEditandoActTexto(e.target.value)} rows={3}
                                    className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                                  <div className="flex gap-2">
                                    <button onClick={() => handleUpdateActualizacion(proyecto._id, act._id)}
                                      className="rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition">Guardar</button>
                                    <button onClick={() => { setEditandoActId(null); setEditandoActTexto(""); }}
                                      className="rounded-xl bg-slate-200 px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-300 transition">Cancelar</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start justify-between gap-3">
                                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{act.texto}</p>
                                  <div className="flex shrink-0 gap-2">
                                    <button onClick={() => { setEditandoActId(act._id); setEditandoActTexto(act.texto); }}
                                      className="flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-100 transition">
                                      <Pencil className="h-3.5 w-3.5" /> Editar
                                    </button>
                                    <button onClick={() => handleDeleteActualizacion(proyecto._id, act._id)}
                                      className="flex items-center gap-1 rounded-xl bg-red-50 px-3 py-1.5 text-xs text-red-600 hover:bg-red-100 transition">
                                      <Trash2 className="h-3.5 w-3.5" /> Eliminar
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-sm text-slate-400">No hay actualizaciones aún.</p>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}