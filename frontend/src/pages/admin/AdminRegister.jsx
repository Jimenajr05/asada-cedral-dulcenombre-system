import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAdmin } from "../../services/authService";

// ── Toast ──────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const isSuccess = toast.type === "success";
  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-md
        ${isSuccess ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}
      style={{ minWidth: 280, maxWidth: 380, animation: "slideIn 0.3s ease" }}
    >
      <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold
        ${isSuccess ? "bg-emerald-500" : "bg-red-500"}`}>
        {isSuccess ? "✓" : "✕"}
      </div>
      <div>
        <p className="font-semibold text-sm leading-snug">{isSuccess ? "¡Éxito!" : "Error"}</p>
        <p className="text-sm mt-0.5 opacity-80">{toast.message}</p>
      </div>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────
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
    <div className="min-h-screen bg-[#EEF4F7] flex items-center justify-center px-4 py-10">
      <Toast toast={toast} />

      <div className="w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Panel izquierdo */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#2BA6A6] via-[#1D6FA3] to-[#0B2E59] text-white p-10">
          <div>
            <h1 className="text-4xl font-bold leading-tight">Registro de<br />Administradores</h1>
            <p className="mt-4 text-white/85 text-base leading-relaxed max-w-md">
              Crea una cuenta institucional para acceder al sistema de gestión administrativa de la ASADA.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <h3 className="font-semibold text-lg">Acceso institucional</h3>
              <p className="text-sm text-white/80 mt-1">El registro está protegido mediante clave de autorización.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <h3 className="font-semibold text-lg">Entorno formal</h3>
              <p className="text-sm text-white/80 mt-1">Diseño limpio y profesional con identidad visual inspirada en el agua.</p>
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-[#0B1F3A]">Registrarse</h2>
              <p className="text-[#5D748A] mt-3 text-base">Completa los datos para crear una cuenta administrativa</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#1F3550] mb-2">Nombre completo</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Nombre completo" required
                  className="w-full rounded-2xl border border-[#C8D7E6] bg-[#EEF5FB] px-5 py-4 text-[#0B1F3A] outline-none transition focus:border-[#2BA6A6] focus:bg-white focus:ring-4 focus:ring-[#BDEDED]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F3550] mb-2">Correo electrónico</label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="correo@asada.com" required
                  className="w-full rounded-2xl border border-[#C8D7E6] bg-[#EEF5FB] px-5 py-4 text-[#0B1F3A] outline-none transition focus:border-[#2BA6A6] focus:bg-white focus:ring-4 focus:ring-[#BDEDED]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F3550] mb-2">Contraseña</label>
                <input type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="Mínimo 6 caracteres" required
                  className="w-full rounded-2xl border border-[#C8D7E6] bg-[#EEF5FB] px-5 py-4 text-[#0B1F3A] outline-none transition focus:border-[#2BA6A6] focus:bg-white focus:ring-4 focus:ring-[#BDEDED]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F3550] mb-2">Clave de registro</label>
                <input type="text" name="registerKey" value={form.registerKey} onChange={handleChange}
                  placeholder="Clave de autorización" required
                  className="w-full rounded-2xl border border-[#C8D7E6] bg-[#EEF5FB] px-5 py-4 text-[#0B1F3A] outline-none transition focus:border-[#2BA6A6] focus:bg-white focus:ring-4 focus:ring-[#BDEDED]" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-[#1E73D8] to-[#155E8A] text-white font-semibold py-4 shadow-lg transition hover:scale-[1.01] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#D7E2EC]"></div>
              <span className="text-sm text-[#6E8194]">o</span>
              <div className="h-px flex-1 bg-[#D7E2EC]"></div>
            </div>

            <p className="text-center text-sm text-[#5D748A] mt-8">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/admin/login" className="font-semibold text-[#1D6FA3] hover:text-[#0B2E59] hover:underline">
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