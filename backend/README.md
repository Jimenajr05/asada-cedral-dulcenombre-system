<div align="center">
  <h1>Servidor Backend - ASADA Cedral y Dulce Nombre</h1>
  <p><i>API RESTful, Seguridad, Subida de Archivos y Persistencia de Datos</i></p>

  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT" />
</div>

<br />

## Descripción General

El directorio `backend` contiene el servidor y la capa lógica de datos de la plataforma. Provee una **API RESTful** robusta y estructurada bajo el patrón MVC (Modelo-Controlador-Ruta) que se comunica directamente con la base de datos NoSQL MongoDB mediante esquemas estrictos de Mongoose.

El servidor asume tareas operativas vitales:
* **Seguridad y Autenticación**: Gestión de sesiones de directivos mediante tokens JWT y cifrado de claves con `bcryptjs`.
* **Procesamiento de Archivos**: Almacenamiento seguro de imágenes y archivos en formato PDF (planos de proyectos, formularios de trámites, certificados ecológicos) utilizando la biblioteca `multer`.
* **Lógica del Acueducto (Gestión de Agua)**: Almacenamiento de bitácoras físicas de aforos de nacientes e indicadores químicos mensuales del acueducto.
* **Bitácoras y Actividades**: Registro e histórico de hitos y proyectos de infraestructura.

---

## Estructura de Directorios

El backend está organizado de la siguiente manera:

```text
backend/
├── uploads/             # Directorio físico donde se almacenan las imágenes y PDFs subidos por Multer.
├── src/
│   ├── config/          # Configuración global del servidor y conexión a base de datos (db.js).
│   ├── controllers/     # Controladores que contienen la lógica de negocio y procesamiento de peticiones.
│   ├── middlewares/     # Interceptores de peticiones (Autenticación JWT, subida de archivos específicos Multer).
│   ├── models/          # Modelos y esquemas definidos con Mongoose.
│   ├── routes/          # Definición y mapeo de los endpoints del API RESTful.
│   └── app.js           # Inicialización y configuración de middlewares globales Express (CORS, JSON parser).
├── server.js            # Punto de entrada para iniciar el servidor HTTP en el puerto configurado.
├── seedLinks.js         # Script auxiliar para poblar inicialmente los enlaces institucionales (Links).
└── package.json         # Gestor de dependencias de Node.js y scripts de arranque.
```

---

## Modelos y Esquemas de Mongoose

1. **User (`user.js`)**: Información y credenciales de administradores y operarios del sistema.
2. **Aviso (`aviso.js`)**: Novedades y avisos para abonados con campos de título, descripción, tipo (urgente, info, completado), imagen adjunta y booleano para fijar en el banner principal.
3. **GestionAgua (`gestionAgua.js`)**: Reportes de cloro residual, turbidez, nacientes, histórico de aforos de caudal y galería de análisis oficiales.
4. **Proyecto (`proyecto.js`)**: Proyectos comunitarios con campos de título, descripción, estado (En progreso, Completado, Pausado, Planificado), fotos adjuntas con alt, documentos descargables en PDF y actualizaciones de bitácora.
5. **Sostenibilidad (`sostenibilidad.js`)**: Gestión ambiental de la ASADA, guardando las galerías dinámicas de Cultura Hídrica, Mantenimiento de Estructuras e Hidrantes instalados (conteo).
6. **Tramite (`tramite.js`)**: Trámites del acueducto, asociando requisitos individuales y archivos PDF de solicitud.
7. **Transparencia (`transparencia.js`)**: Calendario de sesiones de Junta Directiva ordinarias/extraordinarias y listado de certificados oficiales/acreditaciones ecológicas.
8. **Link (`link.js`)**: Enlaces rápidos y externos a asambleas de accionistas, tarifas y actas externas.
9. **Tarea (`tarea.js`)**: Control interno Kanban para directores, clasificando tareas en pendiente, en proceso y completadas.

---

## Configuración y Puesta en Marcha

### 1. Crear el Archivo de Configuración (.env)
Crea un archivo `.env` en la raíz del directorio `backend/` con las siguientes variables:

```env
# Puerto donde correrá el servidor local
PORT=4000

# URI de conexión a la base de datos de MongoDB
MONGODB_URI=mongodb://localhost:27017/asada-cedral-dulcenombre

# Clave secreta para firmar los JSON Web Tokens
JWT_SECRET=super_clave_secreta
```

### 2. Instalación de Dependencias
Asegúrate de estar en el directorio `backend` y ejecuta:
```bash
npm install
```

### 3. Población Inicial de Enlaces (Opcional)
Para insertar los primeros accesos directos institucionales en la base de datos:
```bash
npm run seed
# o bien: node seedLinks.js
```

### 4. Arrancar el Servidor
* **Modo Desarrollo (con reinicio automático al guardar):**
  ```bash
  npm run dev
  ```
* **Modo Producción:**
  ```bash
  npm start
  ```

---

<br />

<div align="center">
  <h3>Autoras</h3>
  <p><b>María Jimena Jara Rojas</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Fernanda Sibaja Campos</b></p>
</div>