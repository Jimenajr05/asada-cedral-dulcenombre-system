import { LogOut } from "lucide-react";
import logo from "../../assets/logo.jpeg";

function AdminNavbar({ user, onLogout }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={logo} alt="ASADA Cedral y Dulce Nombre" className="h-12 w-auto" />
        <p className="text-sm text-slate-500">Panel Administrativo</p>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-right leading-tight">
          <p className="text-base font-semibold text-slate-900">
            {user?.nombre || "Administrador ASADA"}
          </p>
          <p className="text-sm text-slate-500">Administrador</p>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
        >
          <LogOut className="w-5 h-5" strokeWidth={2} />
          <span className="text-base font-medium">Salir</span>
        </button>
      </div>
    </header>
  );
}

export default AdminNavbar;