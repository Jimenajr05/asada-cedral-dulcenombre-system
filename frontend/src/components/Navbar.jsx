export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-64 rounded-box border border-slate-200 bg-white p-2 shadow-lg"
            >
              <li><a className="text-primary font-semibold">Inicio</a></li>
              <li><a>Sobre Nosotros</a></li>
              <li><a>Gestión del Agua</a></li>
              <li><a>Sostenibilidad</a></li>
              <li><a>Trámites</a></li>
              <li><a>Avisos</a></li>
              <li><a>Contacto</a></li>
            </ul>
          </div>

          <div className="ml-2 sm:ml-3 lg:ml-0">
            <h1 className="text-lg font-bold leading-none text-slate-900 sm:text-xl lg:text-2xl">
              ASADA
            </h1>
            <p className="-mt-0.5 text-[11px] text-slate-500 sm:text-xs lg:text-sm">
              Comunidad
            </p>
          </div>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1 text-sm font-medium text-slate-600 xl:text-base">
            <li><a className="text-primary font-semibold">Inicio</a></li>
            <li><a>Sobre Nosotros</a></li>
            <li><a>Gestión del Agua</a></li>
            <li><a>Sostenibilidad</a></li>
            <li><a>Trámites</a></li>
            <li><a>Avisos</a></li>
            <li><a>Contacto</a></li>
          </ul>
        </div>

        <div className="navbar-end">
          <button className="btn btn-primary btn-sm sm:btn-md">
            Contáctanos
          </button>
        </div>
      </div>
    </div>
  );
}