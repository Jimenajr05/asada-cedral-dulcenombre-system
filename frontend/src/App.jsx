import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";
import ScrollToTop from "./components/public/ScrollToTop";

// PÁGINAS PÚBLICAS
import HomePage from "./pages/public/Home/HomePage";
import AboutPage from "./pages/public/About/AboutPage";
import AvisosPage from "./pages/public/Avisos/AvisosPage";
import ContactoPage from "./pages/public/Contacto/ContactoPage";
import GestionAguaPage from "./pages/public/GestionAgua/GestionAguaPage";
import SostenibilidadPage from "./pages/public/Sostenibilidad/SostenibilidadPage";
import TransparenciaPage from "./pages/public/Transparencia/TransparenciaPage";
import TramitesPage from "./pages/public/Tramites/TramitesPage";

// PÁGINAS ADMIN
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminAvisos from "./pages/admin/AdminAvisos";
import AdminSobreNosotros from "./pages/admin/AdminSobreNosotros";
import AdminTramites from "./pages/admin/AdminTramites";
import AdminTransparencia from "./pages/admin/AdminTranspariencia";

// COMPONENTES ADMIN
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";

function App() {
  const location = useLocation();
  const esRutaAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      {!esRutaAdmin && <Navbar />}

      <Routes>
        {/* PÚBLICAS */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre-nosotros" element={<AboutPage />} />
        <Route path="/avisos" element={<AvisosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/gestion-agua" element={<GestionAguaPage />} />
        <Route path="/sostenibilidad" element={<SostenibilidadPage />} />
         <Route path="/transparencia" element={<TransparenciaPage />} />
        <Route path="/tramites" element={<TramitesPage />} />

        {/* AUTH ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* ADMIN PROTEGIDO */}
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

        <Route
          path="/admin/sobre-nosotros"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminSobreNosotros />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/tramites"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminTramites />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/transparencia"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminTransparencia />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      

      {!esRutaAdmin && <Footer />}
    </>
  );
}

export default App;