<div align="center">
  <h1>Frontend - ASADA Cedral y Dulce Nombre</h1>
  <p><i>Interfaz de Usuario Responsiva, Experiencia de Navegación y Consumo de API REST (UI/UX)</i></p>

  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

<br />

## Descripción General

El directorio `frontend` aloja el cliente SPA (Single Page Application) del sistema, desarrollado sobre **React 19** y compilado mediante **Vite**. La aplicación está dividida en dos grandes ámbitos de navegación:
1. **Portal Público**: Diseñado con un estilo visual premium que wowea a primera vista, utilizando degradados fluidos, animaciones sutiles y total adaptabilidad en móviles para que los abonados consulten los datos de la ASADA cómodamente.
2. **Panel del Administrador (Backoffice)**: Un panel protegido que ofrece formularios, tablas interactivas, bitácoras de registro e inventario de archivos multimedia para la autogestión total de la información desplegada al público.

---

## Estructura de Directorios

La organización del código fuente del frontend sigue buenas prácticas de modularidad de componentes:

```text
frontend/
├── src/
│   ├── assets/          # Recursos gráficos locales y logotipos de la asociación.
│   ├── components/      # Componentes web globales y de estructura de navegación:
│   │   ├── admin/       # Elementos exclusivos de administración (Navbar, Sidebar, Layout, ProtectedRoute).
│   │   └── public/      # Elementos del portal público (Navbar, Footer, ScrollToTop).
│   ├── pages/           # Páginas completas del portal:
│   │   ├── admin/       # Vistas de gestión de datos (Panel, Avisos, Agua, Proyectos, Sostenibilidad, Trámites, Transparencia).
│   │   └── public/      # Secciones públicas de libre acceso (Home, Sobre Nosotros, Avisos, Trámites, Calidad, Proyectos, Contacto).
│   ├── services/        # Clientes HTTP estructurados por módulo (utilizan Axios para llamadas al Backend).
│   ├── App.css          # Estilos adicionales personalizados y microanimaciones de interfaz.
│   ├── index.css        # Importación de Tailwind CSS 4 y variables HSL globales.
│   ├── App.jsx          # Enrutamiento jerárquico público/protegido con React Router DOM.
│   └── main.jsx         # Punto de arranque de React.
├── vite.config.js       # Configuración del servidor de desarrollo y empaquetador de producción.
├── eslint.config.js     # Reglas del Linter de Javascript para la calidad del código.
└── package.json         # Dependencias del proyecto.
```

---

## Componentes y Páginas Destacadas

### 🌐 Portal Público (`src/pages/public/`)
* **Home (`Home/`)**: Página de entrada con accesos directos llamativos, noticias destacadas fijadas por junta directiva y pilares organizacionales.
* **Sobre Nosotros (`About/`)**: Reseña histórica interactiva, misión, visión y carrusel de miembros de la Junta Directiva.
* **Avisos (`Avisos/`)**: Búsqueda interactiva y filtrado de alertas comunitarias urgentes, informativas o completadas, junto con apertura de imágenes adjuntas en modal.
* **Gestión del Agua (`GestionAgua/`)**: Bitácoras detalladas de los aforos de nacientes y visualización gráfica de los parámetros físico-químicos.
* **Proyectos (`Proyectos/`)**: Acordeones dinámicos que muestran el avance de obras hídricas, descarga de planos técnicos e histórico de avances.
* **Sostenibilidad (`Sostenibilidad/`)**: Tres galerías fotográficas independientes de Cultura Hídrica, Mantenimiento e Hidrantes.
* **Trámites (`Tramites/`)**: Catálogo con motor de búsqueda para descargar formularios en PDF y guías detalladas para realizar transferencias.
* **Transparencia (`Transparencia/`)**: Calendario y actas de reuniones de Junta Directiva ordinarias o extraordinarias y visualización de certificados ecológicos.
* **Contacto (`Contacto/`)**: Datos oficiales de contacto directo de emergencia y formulario de contacto que genera un mensaje pre-cargado hacia WhatsApp Web.

### 🔐 Panel Administrativo (`src/pages/admin/`)
* **AdminPanel**: Tablero de control central con accesos directos de gestión de recursos y un tablero Kanban interno de administración de tareas del acueducto (`AdminTareas`).
* **Módulos de Gestión**: Vistas homólogas diseñadas para crear, editar, eliminar y adjuntar archivos multimedia/PDF a cada una de las secciones públicas descritas.

---

## Configuración e Instalación

### 1. Enlace con el Servidor Backend
Crea un archivo `.env` en la raíz de `frontend/` indicando la URL raíz de tu servidor de backend:

```env
VITE_API_URL=http://localhost:4000/api
```

### 2. Instalación de Dependencias
Asegúrate de estar en el directorio `frontend/` en tu terminal y ejecuta:
```bash
npm install
```

### 3. Servidor de Desarrollo
Para arrancar el sitio en modo de desarrollo local en tiempo real con HMR (Hot Module Replacement):
```bash
npm run dev
```
*(Generalmente estará disponible en la dirección local `http://localhost:5173`)*

### 4. Compilar para Producción
Para compilar la Single Page Application a código de producción optimizado (HTML/JS/CSS plano en el directorio `dist`):
```bash
npm run build
```

---

<br />

<div align="center">
  <h3>Autoras</h3>
  <p><b>María Jimena Jara Rojas</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Fernanda Sibaja Campos</b></p>
</div>