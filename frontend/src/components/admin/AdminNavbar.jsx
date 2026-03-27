import { Droplets, LogOut } from "lucide-react";

function AdminNavbar({ user, onLogout }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center">
          <Droplets className="w-8 h-8 text-blue-600" strokeWidth={2.2} />
        </div>

        <div className="flex items-end gap-2">
          <h1 className="text-[2rem] font-bold text-slate-900 leading-none">
            ASADA
          </h1>
          <p className="text-sm text-slate-500 mb-1">Panel Administrativo</p>
        </div>
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