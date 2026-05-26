/**
 * @file AdminRegister.jsx
 * @description Página de administración para gestionar usuarios (administradores). Permite listar, crear, editar y eliminar usuarios con la misma interfaz que los avisos.
 */

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, KeyRound, AlertTriangle, Search, X } from "lucide-react";
import { getUsers, createUser, updateUser, updatePassword, deleteUser } from "../../services/userService";
import { getProfile } from "../../services/authService";

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

function PasswordStrength({ password }) {
  const checks = useMemo(() => [
    { label: "Mínimo 8 caracteres", ok: password.length >= 8 },
    { label: "Una mayúscula", ok: /[A-Z]/.test(password) },
    { label: "Una minúscula", ok: /[a-z]/.test(password) },
    { label: "Un número", ok: /\d/.test(password) },
    { label: "Un carácter especial", ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ], [password]);

  const passed = checks.filter((c) => c.ok).length;
  const total = checks.length;
  const pct = (passed / total) * 100;

  const color =
    pct <= 20 ? "bg-red-500" :
      pct <= 40 ? "bg-orange-500" :
        pct <= 60 ? "bg-amber-500" :
          pct <= 80 ? "bg-lime-500" :
            "bg-emerald-500";

  const label =
    pct <= 20 ? "Muy débil" :
      pct <= 40 ? "Débil" :
        pct <= 60 ? "Regular" :
          pct <= 80 ? "Fuerte" :
            "Muy fuerte";

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-semibold min-w-[70px] text-right ${pct <= 40 ? "text-red-600" : pct <= 60 ? "text-amber-600" : "text-emerald-600"
          }`}>
          {label}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <span className={`text-xs ${c.ok ? "text-emerald-500" : "text-slate-300"}`}>
              {c.ok ? "✓" : "○"}
            </span>
            <span className={`text-xs ${c.ok ? "text-slate-600" : "text-slate-400"}`}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminRegister() {
  const navigate = useNavigate();
  const [confirmacionNavegacion, setConfirmacionNavegacion] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const usuariosPorPagina = 10;

  const usersFiltrados = users.filter((u) => {
    const term = userSearch.toLowerCase().trim();
    if (!term) return true;
    return (
      (u.nombre || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term)
    );
  });

  const indexInicio = (paginaActual - 1) * usuariosPorPagina;
  const indexFin = indexInicio + usuariosPorPagina;
  const totalPaginas = Math.ceil(usersFiltrados.length / usuariosPorPagina);
  const usersPaginados = usersFiltrados.slice(indexInicio, indexFin);

  useEffect(() => {
    if (totalPaginas > 0 && paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [totalPaginas, paginaActual]);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const isPasswordValid = useMemo(() => {
    const p = form.password;
    if (!p && modoEdicion && !cambiandoPassword) return true; // No es requerida al editar datos básicos
    return p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p);
  }, [form.password, modoEdicion, cambiandoPassword]);

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

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const [usersData, profileData] = await Promise.all([
        getUsers(),
        getProfile().catch(() => null)
      ]);
      setUsers(usersData);
      
      if (profileData) {
        // Dependiendo de cómo el backend envíe el perfil (ej. { user: {...} } o {...})
        setCurrentUser(profileData.user || profileData);
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  useEffect(() => {
    const isDirty = showForm && (
      modoEdicion ||
      form.nombre.trim() !== "" ||
      form.email.trim() !== "" ||
      form.password.trim() !== ""
    );

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
              resetForm();
              setShowForm(false);

              if (isLogout) {
                if (target.click) {
                  setTimeout(() => { target.click(); }, 50);
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
  }, [showForm, modoEdicion, form, navigate]);

  const resetForm = () => {
    setForm({ nombre: "", email: "", password: "" });
    setModoEdicion(false);
    setCambiandoPassword(false);
    setUsuarioEditandoId(null);
  };

  const abrirNuevoFormulario = () => { resetForm(); setShowForm(true); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      showError("La contraseña no cumple con los requisitos de seguridad");
      return;
    }

    try {
      if (modoEdicion && usuarioEditandoId) {
        if (cambiandoPassword) {
          await updatePassword(usuarioEditandoId, form.password);
          showSuccess("Contraseña actualizada correctamente");
        } else {
          await updateUser(usuarioEditandoId, { nombre: form.nombre, email: form.email });
          showSuccess("Usuario actualizado correctamente");
        }
      } else {
        await createUser({ nombre: form.nombre, email: form.email, password: form.password });
        showSuccess("Usuario creado correctamente");
      }
      resetForm();
      setShowForm(false);
      cargarUsuarios();
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDelete = async (id) => {
    const usuario = users.find((u) => u._id === id);
    if (usuario?.role === "superadmin") {
      showError("No puedes eliminar al Administrador Principal.");
      return;
    }
    if (currentUser && (id === currentUser._id || id === currentUser.id)) {
      showError("No puedes eliminar tu propia cuenta mientras estás logueado.");
      return;
    }
    
    const confirmed = await showConfirm("¿Deseas eliminar este usuario?");
    if (!confirmed) return;
    try {
      await deleteUser(id);
      showSuccess("Usuario eliminado correctamente");
      if (usuarioEditandoId === id) { resetForm(); setShowForm(false); }
      cargarUsuarios();
    } catch (error) {
      showError(error.message);
    }
  };

  const handleCancel = () => { resetForm(); setShowForm(false); };

  const handleEdit = (usuario) => {
    if (usuario.role === "superadmin") {
      showError("No puedes editar los datos del Administrador Principal.");
      return;
    }
    
    resetForm();
    setModoEdicion(true);
    setUsuarioEditandoId(usuario._id);
    setShowForm(true);
    setForm({
      nombre: usuario.nombre || "", 
      email: usuario.email || "",
      password: ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditPassword = (usuario) => {
    resetForm();
    setModoEdicion(true);
    setCambiandoPassword(true);
    setUsuarioEditandoId(usuario._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <Toast toasts={toasts} />

      {/* Encabezado */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">Gestión de Usuarios</h1>
          <p className="mt-2 text-sm text-slate-700 sm:text-base md:text-lg">Administrar los accesos y roles del sistema.</p>
        </div>
        <button type="button" onClick={abrirNuevoFormulario}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-teal-700 w-full sm:w-auto">
          <Plus className="h-5 w-5" /> Nuevo Usuario
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-6 text-3xl font-bold text-black">
            {modoEdicion ? (cambiandoPassword ? "Cambiar Contraseña" : "Editar Usuario") : "Nuevo Usuario"}
          </h2>
          <form onSubmit={handleSubmit}>
            {!cambiandoPassword && (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-black">Nombre completo:</label>
                  <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-black">Correo electrónico:</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200" />
                </div>
              </div>
            )}
            
            {(!modoEdicion || cambiandoPassword) && (
              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-black">Contraseña:</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    required
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-base text-black placeholder:text-slate-400 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.11 6.11m3.768 3.768L6.11 6.11m0 0L3 3m3.11 3.11l4.242 4.243m0 0l4.243 4.243m0 0L21 21m-3.11-3.11a9.953 9.953 0 01-5.89 1.11c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 014.132-5.411" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </div>
            )}

            <div className="mt-8 flex items-center gap-3">
              <button type="submit" disabled={!isPasswordValid}
                className="rounded-2xl bg-teal-600 px-6 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {modoEdicion ? (cambiandoPassword ? "Actualizar Contraseña" : "Actualizar Datos") : "Crear Usuario"}
              </button>
              <button type="button" onClick={handleCancel}
                className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Buscador */}
      {!showForm && (
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Resultados</p>
            <p className="mt-0.5 text-xl font-bold text-slate-900">
              {usersFiltrados.length} {usersFiltrados.length === 1 ? "usuario" : "usuarios"}
            </p>
          </div>

          <div className="relative w-full md:max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setPaginaActual(1);
              }}
              placeholder="Buscar usuario por nombre o correo..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-14 pr-4 text-slate-900 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="hidden md:grid md:grid-cols-[1fr_1.5fr_1fr_auto] border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 gap-4">
          <div>Nombre</div>
          <div>Correo Electrónico</div>
          <div>Fecha de Registro</div>
          <div className="w-32 text-center">Acciones</div>
        </div>
        {loading ? (
          <div className="p-6 text-slate-500">Cargando usuarios...</div>
        ) : usersFiltrados.length === 0 ? (
          <div className="p-6 text-slate-500">
            {users.length === 0 ? "No hay usuarios registrados." : "No se encontraron usuarios que coincidan con la búsqueda."}
          </div>
        ) : (
          usersPaginados.map((usuario) => (
            <div key={usuario._id}
              className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 md:grid md:grid-cols-[1fr_1.5fr_1fr_auto] md:items-center md:gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold leading-tight text-slate-900 break-words">{usuario.nombre}</h3>
                  <p className="mt-0.5 text-xs text-slate-500 font-medium uppercase tracking-wider">{usuario.role === "superadmin" ? "SUPER ADMIN" : usuario.role}</p>
                </div>
              </div>
              <div className="shrink-0 text-sm text-slate-600 truncate">{usuario.email}</div>
              <div className="shrink-0 flex items-center gap-1.5 text-sm text-slate-500">
                <span className="whitespace-nowrap">{new Date(usuario.createdAt).toLocaleDateString("es-CR")}</span>
              </div>
              <div className="w-32 shrink-0 flex items-center justify-center gap-3">
                {usuario.role !== "superadmin" && (
                  <button onClick={() => handleEdit(usuario)} title="Editar Datos"
                    className="text-teal-600 transition hover:text-teal-800">
                    <Pencil className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => handleEditPassword(usuario)} title="Cambiar Contraseña"
                  className="text-amber-500 transition hover:text-amber-700">
                  <KeyRound className="h-4 w-4" />
                </button>
                {usuario.role !== "superadmin" && (!currentUser || (usuario._id !== currentUser._id && usuario._id !== currentUser.id)) && (
                  <button onClick={() => handleDelete(usuario._id)} title="Eliminar"
                    className="text-red-500 transition hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPaginas > 1 && (
        <div className="flex justify-center items-center mt-10">
          <div className="flex items-center gap-1 rounded-2xl bg-white/80 backdrop-blur px-2 py-2 shadow-sm border border-slate-200">
            <button
              onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
              disabled={paginaActual === 1}
              className="px-3 py-2 rounded-xl text-sm font-medium transition bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ←
            </button>
            {[...Array(totalPaginas)].map((_, i) => {
              const page = i + 1;
              const active = paginaActual === page;
              return (
                <button
                  key={page}
                  onClick={() => setPaginaActual(page)}
                  className={`min-w-[36px] h-9 rounded-xl text-sm font-semibold transition-all duration-200
                    ${active
                      ? "bg-teal-600 text-white shadow-md scale-105"
                      : "bg-transparent text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-2 rounded-xl text-sm font-medium transition bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Confirmación de Navegación */}
      {confirmacionNavegacion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md scale-95 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all animate-scale-up">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-4">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">¿Salir sin guardar los cambios?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Tienes modificaciones pendientes en esta sección. Si sales ahora, perderás todos tus cambios en la gestión de usuarios de forma permanente.
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

export default AdminRegister;