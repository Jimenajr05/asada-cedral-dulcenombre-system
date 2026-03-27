import { Routes, Route } from "react-router-dom";

import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";

import Home from "./pages/public/Home";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminAvisos from "./pages/admin/AdminAvisos";

import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* PUBLICO */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      {/* AUTH ADMIN */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* PANEL ADMIN (con layout compartido) */}
      <Route
        path="/admin/panel"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminPanel />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* AVISOS */}
      <Route
        path="/admin/avisos"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminAvisos />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;