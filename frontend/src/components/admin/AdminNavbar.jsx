/**
 * @file AdminNavbar.jsx
 * @description Barra de navegación superior para el panel de administración, que muestra el logotipo de la ASADA, detalles del usuario y el botón de salida.
 */

import { LogOut, Menu } from "lucide-react";
import logo from "../../assets/logo.png";

/**
 * AdminNavbar - Encabezado superior administrativo.
 * @component
 * @param {Object} props
 * @param {Object} props.user - Objeto del usuario autenticado (nombre, email).
 * @param {function} props.onLogout - Callback para ejecutar el cierre de sesión.
 * @param {function} props.onToggleSidebar - Callback para alternar la barra lateral en pantallas pequeñas.
 */
function AdminNavbar({ user, onLogout, onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 h-[68px] bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        <img
          src={logo}
          alt="ASADA"
          className="h-10 w-auto object-contain"
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