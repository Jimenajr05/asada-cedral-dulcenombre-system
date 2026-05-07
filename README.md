<div align="center">
  <h1>Sistema de Gestión - ASADA Cedral y Dulce Nombre</h1>
  <p><i>Plataforma integral para la administración eficiente del acueducto rural</i></p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

<br />

## Sobre el Proyecto

Este sistema fue desarrollado a medida para la **ASADA Cedral - Dulce Nombre**, con el objetivo de modernizar, digitalizar y facilitar la gestión administrativa y operativa del servicio de acueducto rural. La plataforma permite a los administradores llevar un control riguroso e integral de los usuarios (abonados), medidores, lecturas de consumo de agua, facturación de cobros, y la generacion de reportes, optimizando enormemente el trabajo diario de la asociación y garantizando transparencia y agilidad.

El sistema utiliza una arquitectura de cliente-servidor (Frontend y Backend separados), lo que garantiza que la aplicacion sea escalable, modular, segura y facil de mantener a futuro.

## Arquitectura y Estructura del Proyecto

El repositorio principal esta compuesto por dos grandes bloques o monorepositorios:

```text
asada-cedral-dulcenombre-system/
├── backend/                # API RESTful, lógica de negocio y base de datos.
│   ├── src/                # Código fuente del servidor.
│   ├── package.json        # Dependencias de Node.js.
│   └── README.md           # Documentación específica del backend.
│
├── frontend/               # Interfaz de usuario (Cliente web SPA).
│   ├── src/                # Código fuente de React.
│   ├── package.json        # Dependencias de Vite y React.
│   └── README.md           # Documentación específica del frontend.
│
└── README.md               # Documentación general del proyecto.
```

## Tecnologias Principales Utilizadas

### Frontend (Interfaz de Usuario)
- **React 19:** Biblioteca principal para construir la interfaz de usuario basada en componentes.
- **Vite:** Empaquetador y servidor de desarrollo ultrarrapido.
- **Tailwind CSS 4 y DaisyUI:** Herramientas para el diseño de interfaces responsivas y modernas mediante clases utilitarias y componentes preconstruidos.
- **React Router DOM:** Manejo del enrutamiento de la aplicacion de una sola pagina (SPA).
- **Axios:** Cliente HTTP para la comunicacion asincrona con el Backend.

### Backend (Servidor y Base de Datos)
- **Node.js:** Entorno de ejecucion para el servidor.
- **Express.js:** Framework minimalista para la creacion de la API REST.
- **MongoDB y Mongoose:** Base de datos NoSQL y libreria ODM (Object Data Modeling) para la persistencia de datos.
- **JWT (JSON Web Tokens) y Bcrypt:** Para la autenticacion segura, autorizacion de rutas y encriptado asimetrico de credenciales.

## Guia de Inicio Rapido

Para ejecutar el sistema en su entorno de desarrollo local, asegurese de tener instalado previamente [Node.js](https://nodejs.org/) y tener acceso a una instancia de [MongoDB](https://www.mongodb.com/) (local o Atlas).

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/Jimenajr05/asada-cedral-dulcenombre-system.git
cd asada-cedral-dulcenombre-system
```

### Paso 2: Iniciar el Backend
Dirijase a la carpeta del backend, instale las dependencias y ejecute el servidor:
```bash
cd backend
npm install
npm run dev
```
Para detalles sobre variables de entorno, consulte el **[README del Backend](./backend/README.md)**.

### Paso 3: Iniciar el Frontend
En una nueva terminal, dirijase a la carpeta del frontend, instale las dependencias y ejecute la aplicacion web:
```bash
cd frontend
npm install
npm run dev
```
Para detalles sobre la configuracion, consulte el **[README del Frontend](./frontend/README.md)**.

---

<br />

<div align="center">
  <h3>Autoras</h3>
  <p><b>María Jimena Jara Rojas</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Fernanda Sibaja Campos</b></p>
</div>