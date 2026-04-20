import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Bell,
  Users,
  FileText,
  ArrowLeft,
  FolderOpen,
  Waves,
} from "lucide-react";

function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/admin/panel",
    },
    {
      name: "Avisos",
      icon: Bell,
      path: "/admin/avisos",
    },
    {
      name: "Sobre Nosotros",
      icon: Users,
      path: "/admin/sobre-nosotros",
    },
    {
      name: "Gestión del Agua",
      icon: Waves,
      path: "/admin/gestion-agua",
    },
    {
      name: "Trámites",
      icon: FolderOpen,
      path: "/admin/tramites",
    },
  ];

  return (
    <aside className="flex min-h-[calc(100vh-80px)] w-60 flex-col justify-between border-r border-slate-200 bg-white">
      <nav className="space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                active
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
              <span className="text-[1.05rem]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Volver al sitio público
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;