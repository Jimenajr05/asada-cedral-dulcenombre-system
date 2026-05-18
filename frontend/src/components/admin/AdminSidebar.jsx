/**
 * @file AdminSidebar.jsx
 * @description Barra lateral de navegación (Sidebar) para el panel de administración, conteniendo enlaces a todas las secciones CRUD y regreso al sitio público.
 */

import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Bell,
  Users,
  ArrowLeft,
  FolderOpen,
  Waves,
  Leaf,
  ShieldCheck,
  Hammer,
  X,
} from "lucide-react";

/**
 * Listado de opciones del menú con sus respectivos iconos y rutas.
 */
const menuItems = [
  { name: "Dashboard", icon: LayoutGrid, path: "/admin/panel" },
  { name: "Avisos", icon: Bell, path: "/admin/avisos" },
  { name: "Sobre Nosotros", icon: Users, path: "/admin/sobre-nosotros" },
  { name: "Gestión del Agua", icon: Waves, path: "/admin/gestion-agua" },
  { name: "Sostenibilidad", icon: Leaf, path: "/admin/sostenibilidad" },
  { name: "Trámites", icon: FolderOpen, path: "/admin/tramites" },
  { name: "Transparencia", icon: ShieldCheck, path: "/admin/transparencia" },
  { name: "Proyectos", icon: Hammer, path: "/admin/proyectos" },
];

/**
 * AdminSidebar - Navegación lateral adaptable a dispositivos móviles.
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Determina si el menú lateral está desplegado en móviles.
 * @param {function} props.onClose - Callback para cerrar el menú desplegable.
 */
function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-gradient-to-b from-white via-sky-50/30 to-white transition-transform duration-300 ease-in-out lg:sticky lg:top-[68px] lg:z-40 lg:h-[calc(100vh-68px)] lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 p-4 lg:hidden">
          <span className="font-bold text-slate-800">Menú Administrativo</span>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menú */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${active
                  ? "bg-sky-600 text-white shadow-md shadow-sky-100"
                  : "text-slate-600 hover:bg-white hover:text-sky-700 hover:shadow-sm"
                  }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                )}

                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${active
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-700"
                    }`}
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
                </span>

                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Botón inferior */}
        <div className="border-t border-slate-200 bg-white/70 p-4">
          <Link
            to="/"
            onClick={onClose}
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-white">
              <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            </span>

            Volver al sitio
          </Link>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;