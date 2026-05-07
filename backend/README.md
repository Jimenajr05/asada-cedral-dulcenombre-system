<div align="center">
  <h1>Backend - ASADA Cedral y Dulce Nombre</h1>
  <p><i>API RESTful, Seguridad y Lógica de Negocio</i></p>

  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT" />
</div>

<br />

## Descripcion General

El directorio `backend` aloja el servidor central del sistema. Su objetivo principal es proveer una **API RESTful** segura, eficiente y robusta que actua como el puente de comunicacion entre la interfaz de usuario (Frontend) y la base de datos (MongoDB).

El servidor gestiona reglas de negocio criticas como:
- Autenticacion de administradores y control de sesiones.
- Operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre abonados y propiedades.
- Registro y validacion de lecturas de medidores de agua.
- Procesamiento y calculo matematico para la facturacion mensual.
- Recepcion y almacenamiento de archivos mediante multipart/form-data.

## Estructura de Directorios

El codigo fuente sigue el patron de diseño MVC (Modelo-Vista-Controlador) adaptado a APIs, organizando las responsabilidades de la siguiente manera:

```text
backend/
├── src/
│   ├── config/          # Configuraciones globales (Conexion a BD, constantes).
│   ├── controllers/     # Logica de negocio y procesamiento de peticiones.
│   ├── middlewares/     # Funciones intermedias (Autenticacion, manejo de errores).
│   ├── models/          # Esquemas y modelos de datos de Mongoose.
│   ├── routes/          # Definicion de los endpoints de la API.
│   └── app.js           # Configuracion principal de la aplicacion Express.
├── uploads/             # Directorio para archivos subidos localmente.
├── server.js            # Punto de entrada de la aplicacion que levanta el servidor HTTP.
├── package.json         # Gestor de dependencias y scripts de Node.js.
└── seedLinks.js         # Script auxiliar para inicializar datos (Seeding).
```

## Dependencias y Librerias Principales

- **express (v5):** Framework base para el manejo del servidor web y enrutamiento.
- **mongoose:** ODM para interactuar, consultar y modelar los datos en MongoDB.
- **bcrypt / bcryptjs:** Para la encriptacion unidireccional y salting de las contraseñas de los usuarios.
- **jsonwebtoken (JWT):** Generacion de tokens seguros para mantener la sesion de los usuarios sin estado (stateless).
- **multer:** Middleware especifico para la gestion de carga (upload) de archivos.
- **cors:** Habilita el intercambio de recursos de origen cruzado, permitiendo que el Frontend consuma la API.
- **dotenv:** Carga las variables de entorno desde un archivo oculto `.env` hacia el objeto `process.env`.
- **nodemon:** (Dependencia de Desarrollo) Reinicia automaticamente el servidor al guardar cambios en el codigo.

## Configuracion e Instalacion

### 1. Variables de Entorno (.env)
Debe crear un archivo `.env` en la raiz del directorio `backend` con las variables criticas del sistema. Un ejemplo de la estructura es:

```env
# Puerto en el que correra el servidor local
PORT=3000

# Cadena de conexion a la base de datos MongoDB (Local o Atlas)
MONGODB_URI=mongodb://localhost:27017/asada_cedral_db

# Clave secreta para firmar los JSON Web Tokens (Debe ser una cadena larga y compleja)
JWT_SECRET=super_secret_key_asada_2026
```

### 2. Instalacion de Dependencias
Asegurese de estar ubicado en la carpeta `backend` en su terminal e instale los modulos ejecutando:

```bash
npm install
```

### 3. Ejecucion del Servidor
Para iniciar el servidor en modo de desarrollo con recarga automatica:

```bash
npm run dev
```

Si desea correr el servidor sin recarga automatica (modo produccion):
```bash
npm start
# o: node server.js
```
El sistema mostrara mensajes indicando que el servidor se esta ejecutando y el estado de la conexion con MongoDB.

---

<br />

<div align="center">
  <h3>Autoras</h3>
  <p><b>María Jimena Jara Rojas</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Fernanda Sibaja Campos</b></p>
</div>