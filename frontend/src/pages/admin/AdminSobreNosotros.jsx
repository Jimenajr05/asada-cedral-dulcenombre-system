import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, Upload, Users, BarChart3 } from "lucide-react";
import {
  getSobreNosotros, updateSobreNosotros, addMiembro, updateMiembro,
  deleteMiembro, addCobertura, updateCobertura, deleteCobertura,
} from "../../services/sobreNosotrosService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

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
  const fileInputRef = useRef(null);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "smooth" });
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
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Gestión de Sobre Nosotros</h1>
        <p className="mt-2 text-lg text-slate-700">Administra la junta directiva y la sección de cobertura y alcance.</p>
      </div>

      {/* PERÍODO */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Período de Junta Directiva</h2>
        {editandoPeriodo ? (
          <div className="flex flex-col gap-4 md:flex-row">
            <input type="text" value={periodo} onChange={(e) => setPeriodo(e.target.value)}
              placeholder="Ejemplo: 2025 – 2029"
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            <div className="flex gap-2">
              <button onClick={async () => { await guardarPeriodo(); setEditandoPeriodo(false); }}
                className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                Guardar
              </button>
              <button onClick={() => { setPeriodo(data.periodo || ""); setEditandoPeriodo(false); }}
                className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-slate-800 font-medium">
              {data.periodo || <span className="text-slate-400 italic">Sin período definido</span>}
            </p>
            <button onClick={() => setEditandoPeriodo(true)}
              className="flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100">
              <Pencil className="h-4 w-4" /> Editar
            </button>
          </div>
        )}
      </section>

      {/* JUNTA DIRECTIVA */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Junta Directiva</h2>
        </div>
        <form onSubmit={handleGuardarMiembro} className="space-y-5">
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
            <label className="mb-2 block text-sm font-semibold text-slate-900">Foto:</label>
            <div onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
              <Upload className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <p className="text-slate-700">Click para seleccionar una foto</p>
              <p className="mt-1 text-sm text-slate-500">PNG, JPG, JPEG o WEBP</p>
              {previewMiembro && (
                <div className="mx-auto mt-4 h-28 w-28 overflow-hidden rounded-full border border-slate-200">
                  <img src={previewMiembro} alt="Vista previa" className="h-full w-full object-cover" />
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleMiembroFileChange} className="hidden" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit"
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              {editandoMiembro !== null ? "Guardar cambios" : "Agregar miembro"}
            </button>
            <button type="button" onClick={limpiarMiembroForm}
              className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300">
              Cancelar
            </button>
          </div>
        </form>

        <div className="mt-8 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.miembros.length > 0 ? data.miembros.map((miembro, index) => (
              <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 overflow-hidden rounded-full bg-slate-200">
                    {miembro.foto
                      ? <img src={construirUrlImagen(miembro.foto)} alt={miembro.nombre} className="h-full w-full object-cover" />
                      : <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">Sin foto</div>}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{miembro.nombre}</h3>
                  <p className="text-sm text-slate-600">{miembro.cargo}</p>
                </div>
                <div className="mt-5 flex gap-3">
                  <button type="button" onClick={() => handleEditarMiembro(miembro, index)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-blue-600 transition hover:bg-blue-100">
                    <Pencil className="h-4 w-4" /> Editar
                  </button>
                  <button type="button" onClick={() => handleEliminarMiembro(index)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-red-600 transition hover:bg-red-100">
                    <Trash2 className="h-4 w-4" /> Eliminar
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-slate-500">No hay miembros registrados.</div>
            )}
          </div>
        </div>
      </section>

      {/* COBERTURA */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Cobertura y Alcance</h2>
        </div>
        <form onSubmit={handleGuardarCobertura} className="space-y-5">
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
          <div className="flex gap-3">
            <button type="submit"
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              {editandoCobertura !== null ? "Guardar cambios" : "Agregar dato"}
            </button>
            <button type="button" onClick={limpiarCoberturaForm}
              className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300">
              Cancelar
            </button>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {data.cobertura.length > 0 ? data.cobertura.map((item, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-3xl font-extrabold text-blue-700">{item.valor}</p>
              <p className="mt-2 text-sm text-slate-600">{item.descripcion}</p>
              <div className="mt-5 flex gap-3">
                <button type="button" onClick={() => handleEditarCobertura(item, index)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-blue-600 transition hover:bg-blue-100">
                  <Pencil className="h-4 w-4" /> Editar
                </button>
                <button type="button" onClick={() => handleEliminarCobertura(index)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-red-600 transition hover:bg-red-100">
                  <Trash2 className="h-4 w-4" /> Eliminar
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center text-slate-500">No hay datos de cobertura registrados.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminSobreNosotros;