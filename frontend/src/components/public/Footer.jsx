export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 px-4 py-10 text-white sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold sm:text-xl">
              ASADA Comunidad
            </h3>
            <p className="max-w-sm text-sm leading-6 text-slate-300 sm:text-base">
              Administrando con responsabilidad el recurso hídrico de nuestra
              comunidad.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-bold sm:text-xl">Contacto</h3>
            <div className="space-y-2 text-sm text-slate-300 sm:text-base">
              <p>Teléfono: 2460-9775</p>
              <p>Email: acedraldn@ice.co.cr</p>
              <p>Horario: Lunes a Viernes 1:00pm a 5:00pm</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-bold sm:text-xl">Enlaces</h3>
            <div className="space-y-2 text-sm text-slate-300 sm:text-base">
              <p>Trámites y Servicios</p>
              <p>Avisos Importantes</p>
              <p>Panel Administrativo</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-400 sm:text-base">
          © {year} ASADA Comunidad. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}