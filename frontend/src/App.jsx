import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Inicio/HomePage";
import AboutPage from "./pages/About/AboutPage";
import GestionAguaPage from "./pages/GestionAgua/GestionAguaPage";
import SostenibilidadPage from "./pages/Sostenibilidad/SostenibilidadPage";
import TramitesPage from "./pages/Tramites/TramitesPage";
import AvisosPage from "./pages/Avisos/AvisosPage";
import ContactoPage from "./pages/Contacto/ContactoPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-nosotros" element={<AboutPage />} />
        <Route path="/gestion-agua" element={<GestionAguaPage />} />
        <Route path="/sostenibilidad" element={<SostenibilidadPage />} />
        <Route path="/tramites" element={<TramitesPage />} />
        <Route path="/avisos" element={<AvisosPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;