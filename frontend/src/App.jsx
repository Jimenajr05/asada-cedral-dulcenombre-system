import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pública
import Home from "./pages/Inicio/HomePage";
import AboutPage from "./pages/About/AboutPage";
import GestionAguaPage from "./pages/GestionAgua/GestionAguaPage";
import SostenibilidadPage from "./pages/Sostenibilidad/SostenibilidadPage";
import TramitesPage from "./pages/Tramites/TramitesPage";
import AvisosPage from "./pages/Avisos/AvisosPage";
import ContactoPage from "./pages/Contacto/ContactoPage";

// Admin
import AdminLoginPage from "./pages/Admin/AdminloginPage";
import AdminAvisosPage from "./pages/Admin/AdminAvisosPage";

function AppContent() {
  const location = useLocation();

  const esRutaAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      {!esRutaAdmin && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-nosotros" element={<AboutPage />} />
        <Route path="/gestion-agua" element={<GestionAguaPage />} />
        <Route path="/sostenibilidad" element={<SostenibilidadPage />} />
        <Route path="/tramites" element={<TramitesPage />} />
        <Route path="/avisos" element={<AvisosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/avisos" element={<AdminAvisosPage />} />
      </Routes>

      {!esRutaAdmin && <Footer />}
    </>
  );
}

export default AppContent;