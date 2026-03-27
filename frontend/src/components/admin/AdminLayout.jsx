import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar user={user} onLogout={handleLogout} />

      <div className="flex">
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;