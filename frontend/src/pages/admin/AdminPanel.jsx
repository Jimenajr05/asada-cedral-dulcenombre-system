function AdminPanel() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-emerald-700 text-white px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Panel Administrativo</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            Bienvenido, {user?.nombre}
          </h2>
          <p className="text-slate-600 mt-2">
            Desde aquí podrás administrar el contenido del sitio web de la
            ASADA.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Gestionar avisos
            </h3>
            <p className="text-slate-600 text-sm">
              Crear, editar o eliminar avisos para la página principal.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Gestionar trámites
            </h3>
            <p className="text-slate-600 text-sm">
              Actualizar la información de trámites y requisitos.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Gestionar contacto
            </h3>
            <p className="text-slate-600 text-sm">
              Modificar datos de contacto, horarios y ubicación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;