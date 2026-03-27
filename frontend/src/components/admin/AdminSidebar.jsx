import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Bell,
  Image,
  FileText,
  ArrowLeft,
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
      name: "Fotos",
      icon: Image,
      path: "/admin/fotos",
    },
    {
      name: "Contenido",
      icon: FileText,
      path: "/admin/contenido",
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 min-h-[calc(100vh-80px)] flex flex-col justify-between">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                active
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={2} />
              <span className="text-[1.05rem]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition text-sm"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          Volver al sitio público
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;