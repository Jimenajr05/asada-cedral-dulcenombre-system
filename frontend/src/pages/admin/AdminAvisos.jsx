import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Plus,
  Pin,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  CalendarDays,
  AlertCircle,
  Info,
  CheckCircle2,
  Check,
} from "lucide-react";
import {
  getAvisos,
  createAviso,
  updateAviso,
  deleteAviso,
} from "../../services/avisoService";

function AdminAvisos() {
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [avisoEditandoId, setAvisoEditandoId] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    tipo: "info",
    estado: "publicado",
    fijado: false,
    fecha: new Date(),
  });

  const cargarAvisos = async () => {
    try {
      setLoading(true);
      const data = await getAvisos();
      setAvisos(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAvisos();
  }, []);

  const resetForm = () => {
    setForm({
      titulo: "",
      descripcion: "",
      tipo: "info",
      estado: "publicado",
      fijado: false,
      fecha: new Date(),
    });
    setModoEdicion(false);
    setAvisoEditandoId(null);
  };

  const abrirNuevoFormulario = () => {
    resetForm();
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        titulo: form.titulo,
        descripcion: form.descripcion,
        tipo: form.tipo,
        estado: form.estado,
        fijado: form.fijado,
      };

      if (modoEdicion && avisoEditandoId) {
        await updateAviso(avisoEditandoId, payload);
        alert("Aviso actualizado correctamente");
      } else {
        await createAviso(payload);
        alert("Aviso creado correctamente");
      }

      resetForm();
      setShowForm(false);
      cargarAvisos();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Deseas eliminar este aviso?");
    if (!confirmar) return;

    try {
      await deleteAviso(id);
      alert("Aviso eliminado correctamente");

      if (avisoEditandoId === id) {
        resetForm();
        setShowForm(false);
      }

      cargarAvisos();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (aviso) => {
    setModoEdicion(true);
    setAvisoEditandoId(aviso._id);
    setShowForm(true);

    setForm({
      titulo: aviso.titulo || "",
      descripcion: aviso.descripcion || "",
      tipo: aviso.tipo || "info",
      estado: aviso.estado || "publicado",
      fijado: !!aviso.fijado,
      fecha: aviso.createdAt ? new Date(aviso.createdAt) : new Date(),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFijado = async (aviso) => {
    try {
      await updateAviso(aviso._id, {
        titulo: aviso.titulo,
        descripcion: aviso.descripcion,
        tipo: aviso.tipo,
        estado: aviso.estado,
        fijado: !aviso.fijado,
      });

      if (avisoEditandoId === aviso._id) {
        setForm((prev) => ({
          ...prev,
          fijado: !aviso.fijado,
        }));
      }

      cargarAvisos();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggleEstado = async (aviso) => {
    try {
      const nuevoEstado =
        aviso.estado === "publicado" ? "borrador" : "publicado";

      await updateAviso(aviso._id, {
        titulo: aviso.titulo,
        descripcion: aviso.descripcion,
        tipo: aviso.tipo,
        estado: nuevoEstado,
        fijado: aviso.fijado,
      });

      if (avisoEditandoId === aviso._id) {
        setForm((prev) => ({
          ...prev,
          estado: nuevoEstado,
        }));
      }

      cargarAvisos();
    } catch (error) {
      alert(error.message);
    }
  };

  const getTipoBadge = (tipo) => {
    if (tipo === "urgente") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          Urgente
        </span>
      );
    }

    if (tipo === "completado") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Completado
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-600">
        <Info className="h-3.5 w-3.5" />
        Información
      </span>
    );
  };

  const getEstadoBadge = (estado) => {
    if (estado === "publicado") {
      return (
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
          Publicado
        </span>
      );
    }

    return (
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        Borrador
      </span>
    );
  };

  return (
    <div className="bg-slate-100 p-7">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            Gestión de Avisos
          </h1>
          <p className="mt-2 text-lg text-slate-700">
            Crear, editar y administrar avisos públicos
          </p>
        </div>

        <button
          type="button"
          onClick={abrirNuevoFormulario}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nuevo Aviso
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-3xl font-bold text-black">
            {modoEdicion ? "Editar Aviso" : "Nuevo Aviso"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Título *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Título del aviso"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Tipo *
                </label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="info">Información</option>
                  <option value="urgente">Urgente</option>
                  <option value="completado">Completado</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-black">
                Contenido *
              </label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Contenido del aviso"
                rows="5"
                className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-black placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1fr_1fr]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-black">
                  Fecha *
                </label>

                <div className="relative">
                  <DatePicker
                    selected={form.fecha}
                    onChange={(date) =>
                      setForm((prev) => ({
                        ...prev,
                        fecha: date,
                      }))
                    }
                    dateFormat="MM/dd/yyyy"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-base text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
                </div>
              </div>

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3 px-2 py-3 text-base text-black">
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={form.estado === "publicado"}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          estado: e.target.checked ? "publicado" : "borrador",
                        }))
                      }
                      className="peer absolute h-5 w-5 cursor-pointer appearance-none rounded-[4px] border border-slate-500 bg-white"
                    />
                    <Check className="pointer-events-none z-10 hidden h-3.5 w-3.5 text-black peer-checked:block" />
                  </span>
                  Publicado
                </label>
              </div>

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3 px-2 py-3 text-base text-black">
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={form.fijado}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          fijado: e.target.checked,
                        }))
                      }
                      className="peer absolute h-5 w-5 cursor-pointer appearance-none rounded-[4px] border border-slate-500 bg-white"
                    />
                    <Check className="pointer-events-none z-10 hidden h-3.5 w-3.5 text-black peer-checked:block" />
                  </span>
                  Destacado
                </label>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="submit"
                className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                {modoEdicion ? "Actualizar Aviso" : "Crear Aviso"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-12 border-b border-slate-200 px-6 py-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <div className="col-span-7">Aviso</div>
          <div className="col-span-1">Tipo</div>
          <div className="col-span-2">Fecha</div>
          <div className="col-span-1">Estado</div>
          <div className="col-span-1 text-center">Acciones</div>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Cargando avisos...</div>
        ) : avisos.length === 0 ? (
          <div className="p-6 text-slate-500">No hay avisos registrados.</div>
        ) : (
          avisos.map((aviso) => (
            <div
              key={aviso._id}
              className="grid grid-cols-12 items-center border-b border-slate-200 px-6 py-5"
            >
              <div className="col-span-7 flex items-start gap-3">
                <Pin
                  className={`mt-1 h-4 w-4 ${
                    aviso.fijado ? "text-blue-600" : "text-slate-400"
                  }`}
                />

                <div>
                  <h3 className="text-[1.75rem] font-semibold leading-tight text-slate-900">
                    {aviso.titulo}
                  </h3>
                  <p className="mt-1 text-lg text-slate-600">
                    {aviso.descripcion}
                  </p>
                </div>
              </div>

              <div className="col-span-1">{getTipoBadge(aviso.tipo)}</div>

              <div className="col-span-2 flex items-center gap-2 text-slate-600">
                <CalendarDays className="h-4 w-4" />
                {new Date(aviso.createdAt).toLocaleDateString()}
              </div>

              <div className="col-span-1">{getEstadoBadge(aviso.estado)}</div>

              <div className="col-span-1 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleToggleFijado(aviso)}
                  className={`transition ${
                    aviso.fijado
                      ? "text-blue-700 hover:text-blue-800"
                      : "text-blue-500 hover:text-blue-700"
                  }`}
                  title={aviso.fijado ? "Quitar destacado" : "Destacar aviso"}
                >
                  <Pin className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleEstado(aviso)}
                  className={`transition ${
                    aviso.estado === "publicado"
                      ? "text-emerald-600 hover:text-emerald-800"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                  title={
                    aviso.estado === "publicado"
                      ? "Ocultar aviso (pasar a borrador)"
                      : "Publicar aviso"
                  }
                >
                  {aviso.estado === "publicado" ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleEdit(aviso)}
                  className="text-blue-600 transition hover:text-blue-800"
                  title="Editar aviso"
                >
                  <Pencil className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(aviso._id)}
                  className="text-red-500 transition hover:text-red-700"
                  title="Eliminar aviso"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminAvisos;