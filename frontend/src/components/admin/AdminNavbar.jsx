import { LogOut } from "lucide-react";
import logo from "../../assets/logo.jpeg";

function AdminNavbar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 h-[68px] bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="ASADA"
          className="h-11 w-24 object-cover object-center"
        />

        <div className="hidden sm:block">
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
            Panel Administrativo
          </p>
          <p className="text-xs text-slate-400">
            ASADA Cedral y Dulce Nombre
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden text-right leading-tight sm:block">
          <p className="text-sm font-semibold text-slate-900">
            {user?.nombre || "Administrador"}
          </p>
          <p className="text-xs text-slate-400">Administrador</p>
        </div>

        <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white text-sm font-bold">
          {(user?.nombre || "A")[0].toUpperCase()}
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" strokeWidth={2} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}

export default AdminNavbar;