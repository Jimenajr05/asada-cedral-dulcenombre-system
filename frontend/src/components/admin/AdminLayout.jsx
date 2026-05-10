import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { logoutAdmin } from "../../services/authService";

function AdminLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch {
      // Continuar con el logout local incluso si falla el backend
    }
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar user={user} onLogout={handleLogout} />

      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;