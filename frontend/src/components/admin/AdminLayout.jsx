/**
 * @file AdminLayout.jsx
 * @description Componente contenedor de diseño (Layout) para el panel administrativo, estructurando la barra de navegación, barra lateral y área de contenido principal.
 */

import { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { logoutAdmin } from "../../services/authService";

/**
 * AdminLayout - Provee la estructura visual común del dashboard administrativo.
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elementos secundarios a renderizar dentro de la sección principal.
 */
function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  /**
   * Cierra la sesión activa borrando la cookie en el backend y los datos del localStorage.
   */
  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch { }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;