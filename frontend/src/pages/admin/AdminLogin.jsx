import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginAdmin } from "../../services/authService";

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
function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await loginAdmin(form);
      // Solo guardamos datos no-sensibles del usuario para la UI
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("success", "Inicio de sesión exitoso");
      setTimeout(() => navigate("/admin/panel"), 1200);
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

        {/* Panel izquierdo — decorativo */}
        <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-600 via-sky-700 to-slate-900 p-10 text-white">
          {/* Glows */}
          <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-sky-400/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-teal-400/20 blur-[80px]" />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />

          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase text-sky-200">
              Panel Administrativo
            </div>
            <h1 className="text-4xl font-extrabold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Bienvenido al<br />Sistema ASADA
            </h1>
            <p className="mt-4 text-sky-200 text-base leading-relaxed max-w-xs">
              Gestiona los contenidos del sitio público de ASADA Cedral y Dulce Nombre desde un solo lugar.
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            {[
              { icon: "🔒", title: "Acceso seguro", desc: "Protección con cookies httpOnly y rate limiting." },
              { icon: "🛡️", title: "Gestión centralizada", desc: "Avisos, trámites, proyectos y más." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                <h3 className="font-semibold text-sm">{item.icon} {item.title}</h3>
                <p className="text-xs text-sky-200 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div className="flex items-center justify-center px-8 py-12 md:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
                Iniciar sesión
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Correo electrónico
                </label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="correo@asada.com" required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="input-field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-glow mt-2 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 py-4 text-sm font-bold text-white shadow-lg shadow-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Ingresando..." : "Entrar al sistema"}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs text-slate-400">o</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              ¿No tienes una cuenta?{" "}
              <Link to="/admin/register" className="font-semibold text-sky-600 hover:text-sky-700 hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;