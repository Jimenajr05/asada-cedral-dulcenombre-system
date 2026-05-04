import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, Upload, CalendarDays, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import {
  getTransparencia, createReunion, updateReunion, deleteReunion,
  createCertificado, deleteCertificado,
} from "../../services/transparenciaService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const getToken = () => localStorage.getItem("token");

const fetchLinks = async () => {
  const res = await fetch(`${API_BASE_URL}/api/links`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!res.ok) throw new Error("Error al obtener links");
  return res.json();
};
const saveLink = async (id, url) => {
  const res = await fetch(`${API_BASE_URL}/api/links/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error("Error al guardar link");
  return res.json();
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
function AdminTransparencia() {
  const [cargando,  setCargando]  = useState(true);
  const [error,     setError]     = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [toasts,    setToasts]    = useState([]);

  const [links,        setLinks]        = useState([]);
  const [linkEditando, setLinkEditando] = useState(null);
  const [linkUrl,      setLinkUrl]      = useState("");

  const [reuniones,       setReuniones]      = useState([]);
  const [reunionForm,     setReunionForm]     = useState({ descripcion: "", fecha: "", tipo: "ordinaria" });
  const [editandoReunion, setEditandoReunion] = useState(null);

  const certFileRef    = useRef(null);
  const reunionFormRef = useRef(null);
  const [certificados, setCertificados] = useState([]);
  const [certForm,     setCertForm]     = useState({ titulo: "", file: null, preview: null });

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

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        setError(null);
        const [transparenciaData, linksData] = await Promise.all([getTransparencia(), fetchLinks()]);
        setReuniones(transparenciaData.reuniones || []);
        setCertificados(transparenciaData.certificados || []);
        setLinks(linksData);
      } catch (err) {
        setError("No se pudo cargar la información. Recargá la página.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // ── Links ──
  const handleEditarLink = (link) => { setLinkEditando(link._id); setLinkUrl(link.url); };
  const handleGuardarLink = async () => {
    if (!linkUrl.trim()) return;
    setGuardando(true);
    try {
      const actualizado = await saveLink(linkEditando, linkUrl.trim());
      setLinks((prev) => prev.map((l) => (l._id === linkEditando ? { ...actualizado } : l)));
      setLinkEditando(null);
      setLinkUrl("");
      showSuccess("Link guardado correctamente");
    } catch (err) {
      showError("Error al guardar el link: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  // ── Reuniones ──
  const limpiarReunionForm = () => { setReunionForm({ descripcion: "", fecha: "", tipo: "ordinaria" }); setEditandoReunion(null); };

  const handleGuardarReunion = async (e) => {
    e.preventDefault();
    if (!reunionForm.descripcion.trim()) { showError("La descripción es obligatoria"); return; }
    if (!reunionForm.fecha.trim()) { showError("La fecha es obligatoria"); return; }
    setGuardando(true);
    try {
      if (editandoReunion) {
        const { transparencia } = await updateReunion(editandoReunion, reunionForm);
        setReuniones(transparencia.reuniones);
        showSuccess("Reunión actualizada correctamente");
      } else {
        const { transparencia } = await createReunion(reunionForm);
        setReuniones(transparencia.reuniones);
        showSuccess("Reunión agregada correctamente");
      }
      limpiarReunionForm();
    } catch (err) {
      showError("Error al guardar la reunión: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEditarReunion = (reunion) => {
    setEditandoReunion(reunion._id);
    setReunionForm({ descripcion: reunion.descripcion, fecha: reunion.fecha, tipo: reunion.tipo || "ordinaria" });
    setTimeout(() => { reunionFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
  };

  const handleEliminarReunion = async (id) => {
    const confirmed = await showConfirm("¿Deseas eliminar esta reunión?");
    if (!confirmed) return;
    setGuardando(true);
    try {
      const { transparencia } = await deleteReunion(id);
      setReuniones(transparencia.reuniones);
      if (editandoReunion === id) limpiarReunionForm();
      showSuccess("Reunión eliminada correctamente");
    } catch (err) {
      showError("Error al eliminar la reunión: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  // ── Certificados ──
  const limpiarCertForm = () => { setCertForm({ titulo: "", file: null, preview: null }); if (certFileRef.current) certFileRef.current.value = ""; };

  const handleCertFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCertForm((prev) => ({ ...prev, file, preview: URL.createObjectURL(file) }));
  };

  const handleGuardarCert = async (e) => {
    e.preventDefault();
    if (!certForm.titulo.trim()) { showError("El título es obligatorio"); return; }
    if (!certForm.file) { showError("Debes seleccionar una imagen"); return; }
    setGuardando(true);
    try {
      const formData = new FormData();
      formData.append("titulo", certForm.titulo.trim());
      formData.append("imagen", certForm.file);
      const { transparencia } = await createCertificado(formData);
      setCertificados(transparencia.certificados);
      limpiarCertForm();
      showSuccess("Certificado agregado correctamente");
    } catch (err) {
      showError("Error al guardar el certificado: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarCert = async (id) => {
    const confirmed = await showConfirm("¿Deseas eliminar este certificado?");
    if (!confirmed) return;
    setGuardando(true);
    try {
      const { transparencia } = await deleteCertificado(id);
      setCertificados(transparencia.certificados);
      showSuccess("Certificado eliminado correctamente");
    } catch (err) {
      showError("Error al eliminar el certificado: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="flex min-h-[60vh] items-center justify-center"><p className="text-slate-500 text-lg">Cargando transparencia...</p></div>;
  if (error)    return <div className="flex min-h-[60vh] items-center justify-center"><p className="text-red-500 text-lg">{error}</p></div>;

  return (
    <div className="space-y-8 bg-slate-100 p-7">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div>
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Gestión de Transparencia</h1>
        <p className="mt-2 text-lg text-slate-700">Administra los enlaces institucionales, reuniones y certificados.</p>
      </div>

      {/* LINKS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <LinkIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Enlaces institucionales</h2>
        </div>
        <p className="mb-5 text-sm text-slate-500">Actualiza las URLs de los documentos públicos. El link de Tarifas apunta directamente a ARESEP.</p>
        <div className="space-y-4">
          {links.map((link) => (
            <div key={link._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-800">{link.label}</p>
              {linkEditando === link._id ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                    className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="https://..." />
                  <div className="flex gap-2">
                    <button onClick={handleGuardarLink} disabled={guardando}
                      className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                      {guardando ? "Guardando..." : "Guardar"}
                    </button>
                    <button onClick={() => { setLinkEditando(null); setLinkUrl(""); }}
                      className="rounded-2xl bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <a href={link.url} target="_blank" rel="noreferrer" className="truncate text-sm text-blue-600 hover:underline">{link.url}</a>
                  <button onClick={() => handleEditarLink(link)}
                    className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-blue-50 px-4 py-2 text-sm text-blue-600 transition hover:bg-blue-100">
                    <Pencil className="h-4 w-4" /> Editar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* REUNIONES */}
      <section ref={reunionFormRef} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm scroll-mt-6">
        <div className="mb-6 flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Fechas de Reuniones de Junta Directiva</h2>
        </div>
        {editandoReunion && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-5 py-3">
            <Pencil className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-sm font-semibold text-amber-700">
              Estás editando una reunión. Modificá los campos y presioná <span className="font-bold">Guardar cambios</span>.
            </p>
          </div>
        )}
        <form onSubmit={handleGuardarReunion} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-900">Descripción *</label>
              <input type="text" value={reunionForm.descripcion}
                onChange={(e) => setReunionForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Ej: Sesión ordinaria de Junta Directiva" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Tipo</label>
              <select value={reunionForm.tipo} onChange={(e) => setReunionForm((prev) => ({ ...prev, tipo: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <option value="ordinaria">Ordinaria</option>
                <option value="extraordinaria">Extraordinaria</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Fecha *</label>
            <input type="date" value={reunionForm.fecha}
              onChange={(e) => setReunionForm((prev) => ({ ...prev, fecha: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:w-64" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={guardando}
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
              {guardando ? "Guardando..." : editandoReunion ? "Guardar cambios" : "Agregar reunión"}
            </button>
            {editandoReunion && (
              <button type="button" onClick={limpiarReunionForm}
                className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300">
                Cancelar
              </button>
            )}
          </div>
        </form>
        <div className="mt-8 space-y-3">
          {reuniones.length > 0 ? reuniones.map((r) => (
            <div key={r._id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-800">{r.descripcion}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.tipo === "extraordinaria" ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-blue-600"}`}>
                    {r.tipo === "extraordinaria" ? "Extraordinaria" : "Ordinaria"}
                  </span>
                </div>
                {r.fecha && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(r.fecha + "T00:00:00").toLocaleDateString("es-CR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => handleEditarReunion(r)}
                  className="flex items-center gap-1.5 rounded-2xl bg-blue-50 px-4 py-2 text-sm text-blue-600 transition hover:bg-blue-100">
                  <Pencil className="h-4 w-4" /> Editar
                </button>
                <button onClick={() => handleEliminarReunion(r._id)} disabled={guardando}
                  className="flex items-center gap-1.5 rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-600 transition hover:bg-red-100 disabled:opacity-60">
                  <Trash2 className="h-4 w-4" /> Eliminar
                </button>
              </div>
            </div>
          )) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">No hay reuniones registradas aún.</div>
          )}
        </div>
      </section>

      {/* CERTIFICADOS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <ImageIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Certificados</h2>
        </div>
        <form onSubmit={handleGuardarCert} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Título del certificado *</label>
            <input type="text" value={certForm.titulo}
              onChange={(e) => setCertForm((prev) => ({ ...prev, titulo: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Ej: Certificado de calidad sanitaria 2024" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Imagen *</label>
            <div onClick={() => certFileRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
              <Upload className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <p className="text-slate-700">Click para seleccionar una imagen</p>
              <p className="mt-1 text-sm text-slate-500">PNG, JPG, JPEG o WEBP · máx. 5MB</p>
              {certForm.preview && (
                <div className="mx-auto mt-4 h-40 w-40 overflow-hidden rounded-xl border border-slate-200">
                  <img src={certForm.preview} alt="Vista previa" className="h-full w-full object-cover" />
                </div>
              )}
              <input ref={certFileRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleCertFileChange} className="hidden" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={guardando}
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
              {guardando ? "Guardando..." : "Agregar certificado"}
            </button>
            {certForm.preview && (
              <button type="button" onClick={limpiarCertForm}
                className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300">
                Cancelar
              </button>
            )}
          </div>
        </form>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {certificados.length > 0 ? certificados.map((cert) => (
            <div key={cert._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                <img src={cert.imagenUrl.startsWith("http") ? cert.imagenUrl : `${API_BASE_URL}${cert.imagenUrl}`}
                  alt={cert.titulo || "Certificado"} className="h-full w-full object-cover" />
              </div>
              {cert.titulo && <p className="px-4 py-3 text-sm font-semibold text-slate-700">{cert.titulo}</p>}
              <div className="px-4 pb-4">
                <button onClick={() => handleEliminarCert(cert._id)} disabled={guardando}
                  className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100 disabled:opacity-60">
                  <Trash2 className="h-4 w-4" /> Eliminar
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">No hay certificados registrados aún.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminTransparencia;