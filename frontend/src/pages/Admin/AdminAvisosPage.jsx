import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBell,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";
import { FiAlertCircle, FiInfo, FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function tipoConfig(tipo) {
  switch (tipo) {
    case "urgente":
      return {
        label: "Urgente",
        badge: "bg-red-100 text-red-700 border border-red-200",
        icon: <FiAlertCircle className="text-base" />,
      };
    case "informacion":
      return {
        label: "Información",
        badge: "bg-blue-100 text-blue-700 border border-blue-200",
        icon: <FiInfo className="text-base" />,
      };
    case "completado":
      return {
        label: "Completado",
        badge: "bg-green-100 text-green-700 border border-green-200",
        icon: <FiCheckCircle className="text-base" />,
      };
    default:
      return {
        label: "Aviso",
        badge: "bg-slate-100 text-slate-700 border border-slate-200",
        icon: <FaBell className="text-base" />,
      };
  }
}

function EstadoBadge({ activo }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        activo
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-slate-100 text-slate-600 border border-slate-200"
      }`}
    >
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}

function formatearFechaInput(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function AvisoModal({ open, onClose, onSuccess, avisoEditar }) {
  const esEdicion = Boolean(avisoEditar?._id);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo: "informacion",
    fecha: "",
    destacado: false,
    activo: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (avisoEditar) {
      setForm({
        titulo: avisoEditar.titulo || "",
        descripcion: avisoEditar.descripcion || "",
        tipo: avisoEditar.tipo || "informacion",
        fecha: formatearFechaInput(avisoEditar.fecha),
        destacado: Boolean(avisoEditar.destacado),
        activo: avisoEditar.activo !== false,
      });
    } else {
      setForm({
        titulo: "",
        descripcion: "",
        tipo: "informacion",
        fecha: "",
        destacado: false,
        activo: true,
      });
    }
  }, [avisoEditar, open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const url = esEdicion
        ? `http://localhost:4000/api/avisos/${avisoEditar._id}`
        : "http://localhost:4000/api/avisos";

      const method = esEdicion ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (esEdicion ? "Error al actualizar el aviso" : "Error al crear el aviso")
        );
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {esEdicion ? "Editar Aviso" : "Nuevo Aviso"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {esEdicion
                ? "Actualiza la información del aviso."
                : "Completa la información para publicar un nuevo aviso."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                placeholder="Título del aviso"
                value={form.titulo}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tipo *
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500"
                required
              >
                <option value="informacion">Información</option>
                <option value="urgente">Urgente</option>
                <option value="completado">Completado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Contenido *
            </label>
            <textarea
              name="descripcion"
              placeholder="Contenido del aviso"
              value={form.descripcion}
              onChange={handleChange}
              rows="6"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500"
              required
            />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500"
                required
              />
            </div>

            <label className="mt-6 inline-flex items-center gap-2 text-slate-700">
              <input
                type="checkbox"
                name="activo"
                checked={form.activo}
                onChange={handleChange}
                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Publicado
            </label>

            <label className="mt-6 inline-flex items-center gap-2 text-slate-700">
              <input
                type="checkbox"
                name="destacado"
                checked={form.destacado}
                onChange={handleChange}
                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Destacado
            </label>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? esEdicion
                  ? "Guardando..."
                  : "Creando..."
                : esEdicion
                ? "Guardar Cambios"
                : "Crear Aviso"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAvisosPage() {
  const navigate = useNavigate();

  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [openModal, setOpenModal] = useState(false);
  const [avisoSeleccionado, setAvisoSeleccionado] = useState(null);

  const obtenerAvisos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:4000/api/avisos");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener los avisos");
      }

      const avisosFormateados = Array.isArray(data)
        ? data.map((aviso) => ({
            ...aviso,
            fechaFormateada: aviso.fecha
              ? new Date(aviso.fecha).toLocaleDateString("es-CR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "Sin fecha",
          }))
        : [];

      setAvisos(avisosFormateados);
    } catch (err) {
      console.error("Error cargando avisos admin:", err);
      setError(err.message || "No se pudieron cargar los avisos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerAvisos();
  }, []);

  const avisosFiltrados = useMemo(() => {
    if (filtroTipo === "todos") return avisos;
    return avisos.filter((aviso) => aviso.tipo === filtroTipo);
  }, [avisos, filtroTipo]);

  const abrirModalNuevo = () => {
    setAvisoSeleccionado(null);
    setOpenModal(true);
  };

  const abrirModalEditar = (aviso) => {
    setAvisoSeleccionado(aviso);
    setOpenModal(true);
  };

  const cerrarModal = () => {
    setOpenModal(false);
    setAvisoSeleccionado(null);
  };

  const handleEliminar = async (id) => {
    const confirmado = window.confirm(
      "¿Deseas eliminar este aviso? Esta acción lo desactivará."
    );

    if (!confirmado) return;

    try {
      const response = await fetch(`http://localhost:4000/api/avisos/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar el aviso");
      }

      setAvisos((prev) => prev.filter((aviso) => aviso._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Ocurrió un error al eliminar el aviso");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <AvisoModal
        open={openModal}
        onClose={cerrarModal}
        onSuccess={obtenerAvisos}
        avisoEditar={avisoSeleccionado}
      />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <FaArrowLeft />
                Volver
              </button>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Panel Admin
              </span>
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Gestión de Avisos
            </h1>

            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Administra los avisos publicados en la página web.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={abrirModalNuevo}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 sm:text-base"
            >
              <FaPlus />
              Nuevo aviso
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setFiltroTipo("todos")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filtroTipo === "todos"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Todos
          </button>

          <button
            type="button"
            onClick={() => setFiltroTipo("urgente")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filtroTipo === "urgente"
                ? "bg-red-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Urgentes
          </button>

          <button
            type="button"
            onClick={() => setFiltroTipo("informacion")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filtroTipo === "informacion"
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Información
          </button>

          <button
            type="button"
            onClick={() => setFiltroTipo("completado")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filtroTipo === "completado"
                ? "bg-green-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            Completados
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">Cargando avisos...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && avisosFiltrados.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">
                      Título
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">
                      Destacado
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-sm font-bold text-slate-700">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {avisosFiltrados.map((aviso, index) => {
                    const config = tipoConfig(aviso.tipo);

                    return (
                      <tr
                        key={aviso._id || index}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="px-6 py-4 align-top">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {aviso.titulo}
                            </h3>
                            <p className="mt-1 max-w-md text-sm text-slate-500 line-clamp-2">
                              {aviso.descripcion}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}
                          >
                            {config.icon}
                            {config.label}
                          </span>
                        </td>

                        <td className="px-6 py-4 align-top text-sm text-slate-600">
                          {aviso.fechaFormateada}
                        </td>

                        <td className="px-6 py-4 align-top">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              aviso.destacado
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {aviso.destacado ? "Sí" : "No"}
                          </span>
                        </td>

                        <td className="px-6 py-4 align-top">
                          <EstadoBadge activo={aviso.activo !== false} />
                        </td>

                        <td className="px-6 py-4 align-top">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => abrirModalEditar(aviso)}
                              className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
                            >
                              <FaEdit />
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEliminar(aviso._id)}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                            >
                              <FaTrash />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && !error && avisosFiltrados.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              No hay avisos disponibles para este filtro.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}