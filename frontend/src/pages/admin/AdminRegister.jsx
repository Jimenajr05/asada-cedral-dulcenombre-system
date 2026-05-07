import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAdmin } from "../../services/authService";

/* ── Toast ──────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-start gap-3 rounded-2xl px-5 py-4 shadow-2xl border animate-slide-right ${
        ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
      }`}
      style={{ minWidth: 280, maxWidth: 380 }}
    >
      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold ${ok ? "bg-emerald-500" : "bg-red-500"}`}>
        {ok ? "✓" : "✕"}
      </div>
      <div>
        <p className="font-semibold text-sm">{ok ? "¡Éxito!" : "Error"}</p>
        <p className="text-sm mt-0.5 opacity-80">{toast.message}</p>
      </div>
    </div>
  );
}

/* ── Componente principal ────────────────────── */
function AdminRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", password: "", registerKey: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await registerAdmin(form);
      showToast("success", "Administrador registrado correctamente");
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <Toast toast={toast} />

      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/80 grid grid-cols-1 md:grid-cols-2">

        {/* Panel izquierdo */}
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-600 via-sky-700 to-slate-900 p-10 text-white">
          <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-teal-400/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-sky-400/20 blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase text-teal-200">
              Nuevo administrador
            </div>
            <h1 className="text-4xl font-extrabold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Registro de<br />Administradores
            </h1>
            <p className="mt-4 text-teal-100 text-base leading-relaxed max-w-xs">
              Crea una cuenta institucional para acceder al sistema de gestión de la ASADA.
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            {[
              { title: "Acceso institucional", desc: "Protegido con clave de autorización." },
              { title: "Seguridad garantizada", desc: "Solo personal autorizado puede registrarse." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-teal-200 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex items-center justify-center px-8 py-12 md:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                Registrarse
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Completa los datos para crear una cuenta administrativa
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { name: "nombre", label: "Nombre completo", type: "text", placeholder: "Nombre completo" },
                { name: "email", label: "Correo electrónico", type: "email", placeholder: "correo@asada.com" },
                { name: "password", label: "Contraseña", type: "password", placeholder: "Mínimo 6 caracteres" },
                { name: "registerKey", label: "Clave de registro", type: "text", placeholder: "Clave de autorización" },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">{label}</label>
                  <input
                    type={type} name={name} value={form[name]} onChange={handleChange}
                    placeholder={placeholder} required
                    className="input-field"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="btn-glow mt-2 w-full rounded-2xl bg-gradient-to-r from-teal-500 to-sky-600 py-4 text-sm font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs text-slate-400">o</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/admin/login" className="font-semibold text-sky-600 hover:text-sky-700 hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;