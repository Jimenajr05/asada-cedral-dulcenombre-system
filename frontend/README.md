<div align="center">
  <h1>Frontend - ASADA Cedral y Dulce Nombre</h1>
  <p><i>Interfaz de Usuario, Experiencia y Consumo de API (UI/UX)</i></p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

<br />

## Descripcion General

El directorio `frontend` contiene el cliente web de la aplicacion, estructurado como una **Single Page Application (SPA)**. Esta capa del sistema se enfoca en proveer a los operarios y administradores de la ASADA una herramienta digital rapida, accesible e interactiva. Mediante esta plataforma, los usuarios pueden ingresar al sistema, navegar fluidamente entre modulos (sin recargar la pagina) y realizar toda la gestion operativa.

## Estructura de Directorios

La estructura interna de la aplicacion se ha organizado para fomentar la escalabilidad y la reutilizacion de codigo:

```text
frontend/
├── src/
│   ├── assets/          # Recursos estaticos como imagenes e iconos.
│   ├── components/      # Componentes de React reutilizables (Botones, Modales, Tarjetas).
│   ├── pages/           # Vistas completas de la aplicacion, divididas por modulos:
│   │   ├── admin/       # Vistas protegidas para administradores (Panel, Usuarios, etc).
│   │   └── public/      # Vistas de acceso libre (Login).
│   ├── services/        # Archivos encargados de hacer peticiones HTTP al Backend con Axios.
│   ├── App.jsx          # Componente raiz y configuracion del enrutador.
│   └── main.jsx         # Punto de entrada de React que renderiza la aplicacion en el DOM.
├── package.json         # Dependencias y scripts del frontend.
├── vite.config.js       # Configuracion del empaquetador Vite.
└── eslint.config.js     # Reglas y configuraciones del Linter para calidad de codigo.
```

## Dependencias y Librerias Principales

- **react y react-dom (v19):** Motor principal de la interfaz visual.
- **react-router-dom:** Manejo de rutas del lado del cliente, permitiendo crear enlaces y redirecciones.
- **axios:** Cliente HTTP basado en Promesas para interactuar con la API REST del backend de manera sencilla.
- **tailwindcss (v4):** Framework CSS de bajo nivel que agiliza los diseños mediante clases utilitarias.
- **daisyui:** Plugin para Tailwind que provee componentes semanticos pre-diseñados.
- **lucide-react / react-icons:** Bibliotecas de iconos vectoriales ligeros y escalables.
- **react-datepicker:** Componente especializado para la seleccion de fechas.
- **vite:** Herramienta de compilacion y servidor de desarrollo con caracteristicas avanzadas de HMR.
- **eslint:** Herramienta de analisis de codigo estatico para detectar patrones problematicos en el codigo fuente.

## Configuracion e Instalacion

### 1. Variables de Entorno (Opcional)
Si el backend no corre en el puerto por defecto, se recomienda crear un archivo `.env` en el raiz del `frontend` para especificar la URL del servidor, asi Axios la utilizara automaticamente.

```env
VITE_API_URL=http://localhost:3000/api
```

### 2. Instalacion de Dependencias
Abra su terminal apuntando a la carpeta `frontend` y proceda a instalar todos los paquetes declarados en `package.json`:

```bash
npm install
```

### 3. Ejecucion en Desarrollo
Para iniciar la plataforma en un entorno local y verla en tiempo real:

```bash
npm run dev
```

Esto desplegara un servidor local. Visite en su navegador web la direccion provista en la consola (por defecto suele ser `http://localhost:5173`).

### 4. Scripts de Compilacion y Mantenimiento
- **Generar Compilacion (Build):** `npm run build` crea una version optima para produccion dentro de una carpeta `dist`.
- **Previsualizar Compilacion:** `npm run preview` simula un servidor estatico de produccion localmente.
- **Validar Calidad del Codigo:** `npm run lint` revisa el codigo buscando errores de sintaxis y buenas practicas segun ESLint.

---

<br />

<div align="center">
  <h3>Autoras</h3>
  <p><b>María Jimena Jara Rojas</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>Fernanda Sibaja Campos</b></p>
</div>