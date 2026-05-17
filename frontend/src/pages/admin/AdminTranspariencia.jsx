import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Upload, CalendarDays, Image as ImageIcon, Link as LinkIcon, Search, AlertTriangle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getTransparencia, createReunion, updateReunion, deleteReunion,
  createCertificado, updateCertificado, deleteCertificado,
} from "../../services/transparenciaService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const getToken = () => localStorage.getItem("token");

const fetchLinks = async () => {
  const res = await fetch(`${API_BASE_URL}/api/links`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener links");
  return res.json();
};
const saveLink = async (id, label, url) => {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}/api/links/${id}`, {
    method: "PUT",
    headers,
    credentials: "include",
    body: JSON.stringify({ label, url }),
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
  const navigate = useNavigate();
  const [confirmacionNavegacion, setConfirmacionNavegacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [toasts, setToasts] = useState([]);

  const [links, setLinks] = useState([]);
  const [linkEditando, setLinkEditando] = useState(null);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [mostrandoFormNuevoLink, setMostrandoFormNuevoLink] = useState(false);
  const [nuevoLinkLabel, setNuevoLinkLabel] = useState("");
  const [nuevoLinkUrl, setNuevoLinkUrl] = useState("");

  const [reuniones, setReuniones] = useState([]);
  const [reunionForm, setReunionForm] = useState({ descripcion: "", fecha: new Date(), tipo: "ordinaria" });
  const [editandoReunion, setEditandoReunion] = useState(null);

  const [reunionSearch, setReunionSearch] = useState("");
  const [paginaReunionesActual, setPaginaReunionesActual] = useState(1);
  const reunionesPorPagina = 5;

  const reunionesFiltradas = reuniones.filter((r) => {
    const term = reunionSearch.toLowerCase().trim();
    if (!term) return true;
    const desc = (r.descripcion || "").toLowerCase();
    const tipo = (r.tipo || "").toLowerCase();
    const tipoTraducido = r.tipo === "extraordinaria" ? "extraordinaria" : "ordinaria";
    return desc.includes(term) || tipo.includes(term) || tipoTraducido.includes(term);
  });

  const indexInicioReuniones = (paginaReunionesActual - 1) * reunionesPorPagina;
  const indexFinReuniones = indexInicioReuniones + reunionesPorPagina;
  const totalPaginasReuniones = Math.ceil(reunionesFiltradas.length / reunionesPorPagina);
  const reunionesPaginadas = reunionesFiltradas.slice(indexInicioReuniones, indexFinReuniones);

  useEffect(() => {
    if (totalPaginasReuniones > 0 && paginaReunionesActual > totalPaginasReuniones) {
      setPaginaReunionesActual(totalPaginasReuniones);
    }
  }, [totalPaginasReuniones, paginaReunionesActual]);

  const certFileRef = useRef(null);
  const reunionFormRef = useRef(null);
  const certFormRef = useRef(null);
  const [certificados, setCertificados] = useState([]);
  const [certForm, setCertForm] = useState({ titulo: "", file: null, preview: null });
  const [editandoCert, setEditandoCert] = useState(null);

  const [certSearch, setCertSearch] = useState("");
  const [paginaCertActual, setPaginaCertActual] = useState(1);
  const certsPorPagina = 8;

  const certificadosFiltrados = certificados.filter((cert) => {
    const term = certSearch.toLowerCase().trim();
    if (!term) return true;
    return (cert.titulo || "").toLowerCase().includes(term);
  });

  const indexInicioCerts = (paginaCertActual - 1) * certsPorPagina;
  const indexFinCerts = indexInicioCerts + certsPorPagina;
  const totalPaginasCerts = Math.ceil(certificadosFiltrados.length / certsPorPagina);
  const certificadosPaginados = certificadosFiltrados.slice(indexInicioCerts, indexFinCerts);

  useEffect(() => {
    if (totalPaginasCerts > 0 && paginaCertActual > totalPaginasCerts) {
      setPaginaCertActual(totalPaginasCerts);
    }
  }, [totalPaginasCerts, paginaCertActual]);

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

  useEffect(() => {
    const isDirty =
      linkUrl.trim() !== "" ||
      linkLabel.trim() !== "" ||
      nuevoLinkUrl.trim() !== "" ||
      nuevoLinkLabel.trim() !== "" ||
      linkEditando !== null ||
      reunionForm.descripcion.trim() !== "" ||
      editandoReunion !== null ||
      certForm.titulo.trim() !== "" ||
      certForm.file !== null ||
      editandoCert !== null;

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
              setLinkEditando(null);
              setLinkUrl("");
              setLinkLabel("");
              setMostrandoFormNuevoLink(false);
              setNuevoLinkUrl("");
              setNuevoLinkLabel("");
              setReunionForm({ descripcion: "", fecha: new Date(), tipo: "ordinaria" });
              setEditandoReunion(null);
              setCertForm({ titulo: "", file: null, preview: null });
              setEditandoCert(null);
              if (certFileRef.current) certFileRef.current.value = "";

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
  }, [linkUrl, linkLabel, nuevoLinkUrl, nuevoLinkLabel, linkEditando, reunionForm, editandoReunion, certForm, editandoCert]);

  // ── Links ──
  const handleEditarLink = (link) => {
    setLinkEditando(link._id);
    setLinkLabel(link.label || "");
    setLinkUrl(link.url);
  };

  const handleGuardarLink = async () => {
    if (!linkLabel.trim()) {
      showError("El nombre es obligatorio");
      return;
    }
    if (!linkUrl.trim()) {
      showError("La URL es obligatoria");
      return;
    }
    setGuardando(true);
    try {
      const actualizado = await saveLink(linkEditando, linkLabel.trim(), linkUrl.trim());
      setLinks((prev) => prev.map((l) => (l._id === linkEditando ? { ...actualizado } : l)));
      setLinkEditando(null);
      setLinkUrl("");
      setLinkLabel("");
      showSuccess("Enlace guardado correctamente");
    } catch (err) {
      showError("Error al guardar el enlace: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleCrearLink = async () => {
    if (!nuevoLinkLabel.trim()) {
      showError("El nombre del enlace es obligatorio");
      return;
    }
    if (!nuevoLinkUrl.trim()) {
      showError("La URL del enlace es obligatoria");
      return;
    }
    setGuardando(true);
    try {
      const token = getToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE_URL}/api/links`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ label: nuevoLinkLabel.trim(), url: nuevoLinkUrl.trim() }),
      });
      if (!res.ok) throw new Error("Error al crear link");
      const nuevo = await res.json();
      setLinks((prev) => [...prev, nuevo]);
      setMostrandoFormNuevoLink(false);
      setNuevoLinkLabel("");
      setNuevoLinkUrl("");
      showSuccess("Enlace creado correctamente");
    } catch (err) {
      showError("Error al crear el enlace: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarLink = async (id) => {
    const confirmed = await showConfirm("¿Deseas eliminar este enlace?");
    if (!confirmed) return;
    setGuardando(true);
    try {
      const token = getToken();
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${API_BASE_URL}/api/links/${id}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al eliminar link");
      }
      setLinks((prev) => prev.filter((l) => l._id !== id));
      if (linkEditando === id) {
        setLinkEditando(null);
        setLinkUrl("");
        setLinkLabel("");
      }
      showSuccess("Enlace eliminado correctamente");
    } catch (err) {
      showError("Error al eliminar el enlace: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  // ── Reuniones ──
  const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const limpiarReunionForm = () => {
    setReunionForm({ descripcion: "", fecha: new Date(), tipo: "ordinaria" });
    setEditandoReunion(null);
  };

  const handleGuardarReunion = async (e) => {
    e.preventDefault();
    if (!reunionForm.descripcion.trim()) { showError("La descripción es obligatoria"); return; }
    if (!reunionForm.fecha) { showError("La fecha es obligatoria"); return; }
    setGuardando(true);
    try {
      const payload = {
        descripcion: reunionForm.descripcion.trim(),
        tipo: reunionForm.tipo,
        fecha: formatDateToYYYYMMDD(reunionForm.fecha),
      };
      if (editandoReunion) {
        const { transparencia } = await updateReunion(editandoReunion, payload);
        setReuniones(transparencia.reuniones);
        showSuccess("Reunión actualizada correctamente");
      } else {
        const { transparencia } = await createReunion(payload);
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
    setReunionForm({
      descripcion: reunion.descripcion,
      fecha: reunion.fecha ? new Date(reunion.fecha + "T00:00:00") : new Date(),
      tipo: reunion.tipo || "ordinaria"
    });
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
  const limpiarCertForm = () => {
    setCertForm({ titulo: "", file: null, preview: null });
    setEditandoCert(null);
    if (certFileRef.current) certFileRef.current.value = "";
  };

  const handleCertFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCertForm((prev) => ({ ...prev, file, preview: URL.createObjectURL(file) }));
  };

  const handleGuardarCert = async (e) => {
    e.preventDefault();
    if (!certForm.titulo.trim()) { showError("El título es obligatorio"); return; }
    if (!editandoCert && !certForm.file) { showError("Debes seleccionar una imagen"); return; }
    setGuardando(true);
    try {
      const formData = new FormData();
      formData.append("titulo", certForm.titulo.trim());
      if (certForm.file) {
        formData.append("imagen", certForm.file);
      }

      if (editandoCert) {
        const { transparencia } = await updateCertificado(editandoCert, formData);
        setCertificados(transparencia.certificados);
        showSuccess("Certificado actualizado correctamente");
      } else {
        const { transparencia } = await createCertificado(formData);
        setCertificados(transparencia.certificados);
        showSuccess("Certificado agregado correctamente");
      }
      limpiarCertForm();
    } catch (err) {
      showError("Error al guardar el certificado: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleEditarCert = (cert) => {
    setEditandoCert(cert._id);
    setCertForm({
      titulo: cert.titulo || "",
      file: null,
      preview: cert.imagenUrl ? (cert.imagenUrl.startsWith("http") ? cert.imagenUrl : `${API_BASE_URL}${cert.imagenUrl}`) : null,
    });
    setTimeout(() => { certFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
  };

  const handleEliminarCert = async (id) => {
    const confirmed = await showConfirm("¿Deseas eliminar este certificado?");
    if (!confirmed) return;
    setGuardando(true);
    try {
      const { transparencia } = await deleteCertificado(id);
      setCertificados(transparencia.certificados);
      if (editandoCert === id) limpiarCertForm();
      showSuccess("Certificado eliminado correctamente");
    } catch (err) {
      showError("Error al eliminar el certificado: " + err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="flex min-h-[60vh] items-center justify-center"><p className="text-slate-500 text-lg">Cargando transparencia...</p></div>;
  if (error) return <div className="flex min-h-[60vh] items-center justify-center"><p className="text-red-500 text-lg">{error}</p></div>;

  return (
    <div className="space-y-8">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div>
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">Gestión de Transparencia</h1>
        <p className="mt-2 text-lg text-slate-700">Administra los enlaces institucionales, reuniones y certificados.</p>
      </div>

      {/* LINKS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <LinkIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-900">Enlaces institucionales</h2>
          </div>
          {!mostrandoFormNuevoLink && (
            <button onClick={() => setMostrandoFormNuevoLink(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-sm hover:shadow active:scale-95">
              + Crear nuevo enlace
            </button>
          )}
        </div>
        <p className="mb-5 text-sm text-slate-500">Actualiza las URLs de los documentos públicos.</p>

        {mostrandoFormNuevoLink && (
          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/20 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Crear Nuevo Enlace</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Nombre del enlace:</label>
                <input type="text" value={nuevoLinkLabel} onChange={(e) => setNuevoLinkLabel(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">URL del enlace:</label>
                <input type="url" value={nuevoLinkUrl} onChange={(e) => setNuevoLinkUrl(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={handleCrearLink} disabled={guardando}
                className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                {guardando ? "Creando..." : "Crear enlace"}
              </button>
              <button onClick={() => { setMostrandoFormNuevoLink(false); setNuevoLinkUrl(""); setNuevoLinkLabel(""); }}
                className="rounded-2xl bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300">
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4 scrollbar-thin">
          {links.map((link) => (
            <div key={link._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mr-1">
              {linkEditando === link._id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">Nombre del enlace:</label>
                      <input type="text" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="Ej. Estados Financieros" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">URL del enlace:</label>
                      <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        placeholder="https://..." />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={handleGuardarLink} disabled={guardando}
                      className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
                      {guardando ? "Guardando..." : "Guardar"}
                    </button>
                    <button onClick={() => { setLinkEditando(null); setLinkUrl(""); setLinkLabel(""); }}
                      className="rounded-2xl bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-800 break-words">{link.label}</p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <a href={link.url} target="_blank" rel="noreferrer" className="break-all text-sm text-blue-600 hover:underline">{link.url}</a>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleEditarLink(link)} title="Editar"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:scale-105 active:scale-95">
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleEliminarLink(link._id)} disabled={guardando} title="Eliminar"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 hover:scale-105 active:scale-95 disabled:opacity-60">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* REUNIONES */}
      <section ref={reunionFormRef} className="rounded-2xl border border-slate-200 bg-white p-6 scroll-mt-6">
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
              <label className="mb-2 block text-sm font-semibold text-slate-900">Descripción:</label>
              <input type="text" value={reunionForm.descripcion}
                onChange={(e) => setReunionForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Tipo:</label>
              <select value={reunionForm.tipo} onChange={(e) => setReunionForm((prev) => ({ ...prev, tipo: e.target.value }))}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <option value="ordinaria">Ordinaria</option>
                <option value="extraordinaria">Extraordinaria</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Fecha:</label>
            <div className="relative md:w-64">
              <DatePicker
                selected={reunionForm.fecha}
                onChange={(date) => setReunionForm((prev) => ({ ...prev, fecha: date }))}
                dateFormat="MM/dd/yyyy"
                minDate={new Date()}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            </div>
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
        {/* BUSCADOR DE REUNIONES */}
        <div className="mt-8 mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Resultados</p>
            <p className="mt-0.5 text-xl font-bold text-slate-900">
              {reunionesFiltradas.length} {reunionesFiltradas.length === 1 ? "reunión" : "reuniones"}
            </p>
          </div>

          <div className="relative w-full md:max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={reunionSearch}
              onChange={(e) => {
                setReunionSearch(e.target.value);
                setPaginaReunionesActual(1);
              }}
              placeholder="Buscar reunión por descripción o tipo..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-14 pr-4 text-slate-900 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="space-y-3">
          {reunionesPaginadas.length > 0 ? reunionesPaginadas.map((r) => (
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
                <button onClick={() => handleEditarReunion(r)} title="Editar"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100 hover:scale-105 active:scale-95">
                  <Pencil className="h-5 w-5" />
                </button>
                <button onClick={() => handleEliminarReunion(r._id)} disabled={guardando} title="Eliminar"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 hover:scale-105 active:scale-95 disabled:opacity-60">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          )) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
              {reuniones.length === 0 ? "No hay reuniones registradas aún." : "No se encontraron reuniones que coincidan con la búsqueda."}
            </div>
          )}
        </div>

        {/* PAGINACIÓN DE REUNIONES */}
        {totalPaginasReuniones > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-1 rounded-2xl bg-white/80 backdrop-blur px-2 py-2 shadow-sm border border-slate-200">
              <button
                type="button"
                onClick={() => setPaginaReunionesActual((p) => Math.max(p - 1, 1))}
                disabled={paginaReunionesActual === 1}
                className="px-3 py-2 rounded-xl text-sm font-medium transition bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ←
              </button>

              {[...Array(totalPaginasReuniones)].map((_, i) => {
                const page = i + 1;
                const active = paginaReunionesActual === page;

                return (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setPaginaReunionesActual(page)}
                    className={`min-w-[36px] h-9 rounded-xl text-sm font-semibold transition-all duration-200
                      ${active
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "bg-transparent text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setPaginaReunionesActual((p) => Math.min(p + 1, totalPaginasReuniones))}
                disabled={paginaReunionesActual === totalPaginasReuniones}
                className="px-3 py-2 rounded-xl text-sm font-medium transition bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* CERTIFICADOS */}
      <section ref={certFormRef} className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <ImageIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Certificados</h2>
        </div>
        <form onSubmit={handleGuardarCert} className="space-y-5">
          {editandoCert !== null && (
            <div className="flex items-center justify-between gap-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span>Estás en <strong>Modo Edición</strong> para el certificado <strong>{certForm.titulo}</strong>. Edita los campos abajo y presiona "Guardar cambios".</span>
              </div>
              <button type="button" onClick={limpiarCertForm} className="text-xs font-bold text-amber-700 hover:underline shrink-0">
                Cancelar edición
              </button>
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Título del certificado:</label>
            <input type="text" value={certForm.titulo}
              onChange={(e) => setCertForm((prev) => ({ ...prev, titulo: e.target.value }))}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Imagen:</label>
            <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50/20">
              {certForm.preview ? (
                <div className="relative group flex flex-col items-center">
                  <div
                    onClick={() => certFileRef.current?.click()}
                    className="relative cursor-pointer h-32 w-32 overflow-hidden rounded-2xl border-4 border-white shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-100 group-hover:border-blue-50"
                  >
                    <img src={certForm.preview} alt="Vista previa" className="h-full w-full object-cover" />
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
                      setCertForm((prev) => ({ ...prev, file: null, preview: null }));
                      if (certFileRef.current) certFileRef.current.value = "";
                    }}
                    className="mt-2 text-xs font-bold text-red-500 hover:text-red-700 transition"
                  >
                    Quitar imagen
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => certFileRef.current?.click()}
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
              <input ref={certFileRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleCertFileChange} className="hidden" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={guardando}
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60">
              {guardando ? "Guardando..." : editandoCert ? "Guardar cambios" : "Agregar certificado"}
            </button>
            {(certForm.preview || editandoCert) && (
              <button type="button" onClick={limpiarCertForm}
                className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300">
                Cancelar
              </button>
            )}
          </div>
        </form>
        {/* BUSCADOR DE CERTIFICADOS */}
        <div className="mt-8 mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Resultados</p>
            <p className="mt-0.5 text-xl font-bold text-slate-900">
              {certificadosFiltrados.length} {certificadosFiltrados.length === 1 ? "certificado" : "certificados"}
            </p>
          </div>

          <div className="relative w-full md:max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={certSearch}
              onChange={(e) => {
                setCertSearch(e.target.value);
                setPaginaCertActual(1);
              }}
              placeholder="Buscar certificado por título..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-14 pr-4 text-slate-900 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {certificadosPaginados.length > 0 ? certificadosPaginados.map((cert) => (
            <div key={cert._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                <img src={cert.imagenUrl.startsWith("http") ? cert.imagenUrl : `${API_BASE_URL}${cert.imagenUrl}`}
                  alt={cert.titulo || "Certificado"} className="h-full w-full object-cover" />
              </div>
              {cert.titulo && <p className="px-4 py-3 text-sm font-semibold text-slate-700">{cert.titulo}</p>}
              <div className="flex gap-2 px-4 pb-4">
                <button onClick={() => handleEditarCert(cert)} disabled={guardando}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-blue-50 px-3 py-2 text-sm text-blue-600 transition hover:bg-blue-100 disabled:opacity-60">
                  <Pencil className="h-4 w-4" /> Editar
                </button>
                <button onClick={() => handleEliminarCert(cert._id)} disabled={guardando}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100 disabled:opacity-60">
                  <Trash2 className="h-4 w-4" /> Eliminar
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
              {certificados.length === 0 ? "No hay certificados registrados aún." : "No se encontraron certificados que coincidan con la búsqueda."}
            </div>
          )}
        </div>

        {/* PAGINACIÓN DE CERTIFICADOS */}
        {totalPaginasCerts > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-1 rounded-2xl bg-white/80 backdrop-blur px-2 py-2 shadow-sm border border-slate-200">
              <button
                type="button"
                onClick={() => setPaginaCertActual((p) => Math.max(p - 1, 1))}
                disabled={paginaCertActual === 1}
                className="px-3 py-2 rounded-xl text-sm font-medium transition bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ←
              </button>

              {[...Array(totalPaginasCerts)].map((_, i) => {
                const page = i + 1;
                const active = paginaCertActual === page;

                return (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setPaginaCertActual(page)}
                    className={`min-w-[36px] h-9 rounded-xl text-sm font-semibold transition-all duration-200
                      ${active
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "bg-transparent text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setPaginaCertActual((p) => Math.min(p + 1, totalPaginasCerts))}
                disabled={paginaCertActual === totalPaginasCerts}
                className="px-3 py-2 rounded-xl text-sm font-medium transition bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        )}
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
                Tienes modificaciones pendientes en esta sección. Si sales ahora, perderás todos tus cambios en la gestión de transparencia de forma permanente.
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

export default AdminTransparencia;