import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutPage from "./pages/About/AboutPage";
import GestionAgua from "./pages/GestionAgua/GestionAguaPage";
import Sostenibilidad from "./pages/Sostenibilidad/SostenibilidadPage";
import Tramites from "./pages/Tramites/TramitesPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre-nosotros" element={<AboutPage />} />
        <Route path="/gestion-agua" element={<GestionAgua />} />
        <Route path="/sostenibilidad" element={<Sostenibilidad />} />
        <Route path="/tramites" element={<Tramites />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;