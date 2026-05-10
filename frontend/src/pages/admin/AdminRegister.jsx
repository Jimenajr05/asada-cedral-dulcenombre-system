import { useState, useMemo } from "react";
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

/* ── Indicador de fuerza ─────────────────────── */
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
      {/* Barra de progreso */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`text-xs font-semibold min-w-[70px] text-right ${
          pct <= 40 ? "text-red-600" : pct <= 60 ? "text-amber-600" : "text-emerald-600"
        }`}>
          {label}
        </span>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
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

/* ── Componente principal ────────────────────── */
function AdminRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: "", email: "", password: "", registerKey: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const isPasswordValid = useMemo(() => {
    const p = form.password;
    return p.length >= 8 && /[A-Z]/.test(p) && /[a-z]/.test(p) && /\d/.test(p) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p);
  }, [form.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      showToast("error", "La contraseña no cumple con los requisitos de seguridad");
      return;
    }

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
              { icon: "🔐", title: "Acceso institucional", desc: "Protegido con clave de autorización." },
              { icon: "🛡️", title: "Contraseña segura", desc: "Requiere mayúscula, número y carácter especial." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                <h3 className="font-semibold text-sm">{item.icon} {item.title}</h3>
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
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Nombre completo</label>
                <input
                  type="text" name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Nombre completo" required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Correo electrónico</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="correo@asada.com" required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
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
                <PasswordStrength password={form.password} />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Clave de registro</label>
                <input
                  type="password" name="registerKey" value={form.registerKey} onChange={handleChange}
                  placeholder="Clave de autorización" required
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid}
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