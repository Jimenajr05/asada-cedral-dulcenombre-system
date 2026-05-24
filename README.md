<div align="center">
  <h1>Portal Web e Interno - ASADA Cedral y Dulce Nombre</h1>
  <p><i>Plataforma integral para la comunicación comunitaria, rendición de cuentas y administración dinámica de contenidos</i></p>

  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

<br />

## Sobre el Proyecto

Este sistema es un desarrollo a medida para la **ASADA Cedral y Dulce Nombre** que cumple una doble función esencial:
1. **Portal Público**: Un sitio web moderno, accesible y responsivo para que los abonados y la comunidad general consulten avisos importantes, reportes e bitácoras de calidad de agua, información sobre sostenibilidad ambiental, proyectos de infraestructura en curso, descarga de formularios oficiales de trámites, y actas/calendarios de reuniones de la Junta Directiva.
2. **Panel de Administración (Intranet)**: Un gestor interno protegido por autenticación segura que permite a los directivos y administradores de la ASADA actualizar dinámicamente todo el contenido público, subir archivos PDF/fotos de respaldo, y supervisar un tablero interno de tareas organizativas.

El sistema utiliza la arquitectura moderna MERN (MongoDB, Express, React, Node.js) con desacoplamiento total de Backend y Frontend para garantizar un alto rendimiento, escalabilidad y facilidad de mantenimiento.

## Arquitectura y Estructura del Proyecto

El repositorio principal está compuesto por dos grandes bloques o monorepositorios:

```text
asada-cedral-dulcenombre-system/
├── backend/                # API RESTful, lógica de negocio, subida de archivos y persistencia de datos.
│   ├── src/                # Código fuente del servidor (MVC adaptado).
│   ├── package.json        # Dependencias de Node.js.
│   └── README.md           # Documentación específica del backend.
│
├── frontend/               # Interfaz de usuario (Cliente web Single Page Application).
│   ├── src/                # Vistas públicas, panel administrador en React y llamadas a servicios.
│   ├── package.json        # Dependencias de Vite, React y Tailwind CSS.
│   └── README.md           # Documentación específica del frontend.
│
└── README.md               # Documentación general del proyecto (este archivo).
```

## Módulos y Funcionalidades del Sistema

### 📢 1. Comunicados y Novedades (Avisos)
* **Público**: Muestra de avisos clasificados por nivel de alerta (Urgentes, Información, Completados), filtro rápido de búsqueda y avisos importantes fijados con ampliación de imágenes adjuntas.
* **Administrador**: Panel completo de creación, edición, subida de imágenes descriptivas de comunicados y opción de fijado prioritario.

### 💧 2. Gestión y Calidad del Agua
* **Público**: Acceso a bitácoras de aforos de nacientes del acueducto, parámetros físicos y químicos (cloro residual, turbidez), e informes de análisis oficiales acreditados por el AyA.
* **Administrador**: Registro mensual de aforos de caudal (L/s), actualización de parámetros de calidad e ingreso de actas/imágenes de laboratorios sanitarios.

### 🏗️ 3. Control de Proyectos
* **Público**: Desglose interactivo de proyectos en progreso, planificados o completados. Cada proyecto incluye una bitácora cronológica de actualizaciones, documentos adjuntos descargables y fotos ilustrativas.
* **Administrador**: Gestor de hitos de proyectos, administración de archivos técnicos adjuntos y fotos.

### 🌿 4. Sostenibilidad Ambiental
* **Público**: Visualización interactiva del manifiesto ambiental de la ASADA, tres galerías de imágenes autogestionadas (Cultura Hídrica, Mantenimiento e Hidrantes instalados).
* **Administrador**: Actualización del conteo de hidrantes en la red y carga de material gráfico para las galerías ambientales.

### 📄 5. Trámites y Servicios
* **Público**: Requisitos obligatorios y guías de cobro oficiales (SINPE Móvil, BN Internet Banking, etc.). Descarga directa de formularios de solicitudes y solicitudes sanitarias en PDF.
* **Administrador**: Carga, actualización y asignación de requisitos a formularios dinámicos en formato PDF.

### 🛡️ 6. Transparencia y Rendición de Cuentas
* **Público**: Acceso libre al calendario de sesiones de Junta Directiva, reglamentos vigentes, actas de asambleas y certificados oficiales ecológicos/sanitarios.
* **Administrador**: Registro de fechas de reuniones ordinarias/extraordinarias y carga de certificados.

### 📋 7. Tareas Internas (Uso Administrativo)
* **Administrador**: Un tablero de control interno tipo Kanban/Checklist para que los directores y el personal operativo asignen, categoricen y gestionen tareas internas, facilitando el seguimiento operativo diario.

---

## Tecnologías Principales Utilizadas

### Frontend (Interfaz de Usuario)
- **React 19:** Biblioteca principal para construir la SPA basada en componentes responsivos.
- **Vite:** Herramienta de construcción y servidor de desarrollo ágil y ultrarrápido.
- **Tailwind CSS 4:** Diseño estilizado moderno con variables de color HSL fluidas y personalizadas.
- **React Router DOM:** Manejo del enrutamiento de vistas públicas y protegidas.
- **Axios:** Cliente HTTP para comunicación asíncrona con el Backend.

### Backend (Servidor y Base de Datos)
- **Node.js:** Entorno de ejecución de Javascript del lado del servidor.
- **Express.js:** Framework minimalista para la estructuración de la API RESTful.
- **MongoDB y Mongoose:** Base de datos NoSQL y ODM para la definición de esquemas robustos.
- **JWT (JSON Web Tokens) y Bcryptjs:** Mecanismo de autenticación sin estado y cifrado de contraseñas.
- **Multer:** Middleware especializado para la recepción y almacenamiento de imágenes y PDFs.

---

## Guía de Inicio Rápido

### Requisitos Previos
* Tener instalado [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada).
* Acceso a una instancia de [MongoDB](https://www.mongodb.com/) activa (local o Atlas en la nube).

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/Jimenajr05/asada-cedral-dulcenombre-system.git
cd asada-cedral-dulcenombre-system
```

### Paso 2: Iniciar el Servidor Backend
Accede a la carpeta de backend, crea tu entorno de configuración, instala dependencias y ejecuta:
```bash
cd backend
# Crea y edita tu archivo .env con MONGODB_URI y JWT_SECRET
npm install
npm run dev
```
*(Para más detalles sobre los endpoints y variables, lee el [README del Backend](./backend/README.md))*

### Paso 3: Iniciar el Cliente Frontend
En otra ventana de la terminal, accede a la carpeta de frontend, instala y arranca la interfaz:
```bash
cd ../frontend
npm install
npm run dev
```
*(Por defecto correrá en `http://localhost:5173`. Para más detalles, lee el [README del Frontend](./frontend/README.md))*

---

<br />

<div align="center">
  <h3>Autoras</h3>
  <p><b>María Jimena Jara Rojas</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Fernanda Sibaja Campos</b></p>
</div>