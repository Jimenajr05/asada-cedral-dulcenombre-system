import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiAlertTriangle } from "react-icons/fi";
import {
  obtenerGestionAgua,
  actualizarGestionAgua,
  subirFotoAnalisis,
  eliminarFotoAnalisis,
  BASE_URL,
} from "../../services/gestionAguaService";

/* ========================= UTILIDADES ========================= */
const crearParametroVacio = () => ({
  nombre: "",
  valor: "",
  rango: "",
  porcentaje: "0%",
});

const crearInfraestructuraVacia = () => ({ titulo: "", items: [""] });
const crearAforoVacio = () => ({ lugar: "", produccion: "" });

const formatearFechaActual = () =>
  new Date().toLocaleDateString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const normalizarPorcentaje = (valor) => {
  if (!valor) return "0%";
  const limpio = String(valor).replace("%", "").trim();
  const numero = Number(limpio);
  if (Number.isNaN(numero)) return "0%";
  if (numero < 0) return "0%";
  if (numero > 100) return "100%";
  return `${numero}%`;
};

/* ========================= TOAST ========================= */
function Toast({ toasts, removeToast }) {
  return (
    <div
      className="fixed top-4 right-4 left-4 sm:top-6 sm:right-6 sm:left-auto z-50 flex flex-col gap-3 sm:w-[380px]"
    >
      {toasts.map((t) => {
        const isSuccess = t.type === "success";
        const isConfirm = t.type === "confirm";

        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 sm:px-5 sm:py-4 shadow-2xl backdrop-blur-md
              ${isSuccess
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : isConfirm
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            style={{ animation: "slideIn 0.3s ease" }}
          >
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold
              ${isSuccess
                  ? "bg-emerald-500"
                  : isConfirm
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
            >
              {isSuccess ? "✓" : isConfirm ? "?" : "✕"}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-sm leading-snug">
                {isSuccess ? "¡Éxito!" : isConfirm ? "Confirmar" : "Error"}
              </p>

              <p className="text-sm mt-0.5 opacity-80">{t.message}</p>

              {isConfirm && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => t.onConfirm()}
                    className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>

                  <button
                    onClick={() => t.onCancel()}
                    className="rounded-xl bg-slate-200 px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-300 transition"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 640px) {
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(40px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        }
      `}</style>
    </div>
  );
}

/* ========================= COMPONENTES UI ========================= */
function SectionCard({ title, subtitle, children, actions }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{title}</h2>
            {subtitle ? (
              <p className="max-w-3xl text-xs sm:text-sm text-slate-500 leading-relaxed">
                {subtitle}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex w-full sm:w-auto shrink-0 flex-wrap gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

function ActionButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${styles[variant]} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

function DeleteIconButton({ onClick, title = "Eliminar" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100 hover:text-red-700 active:scale-95"
    >
      <FiTrash2 className="text-lg" />
    </button>
  );
}

function Input({ className = "", type, ...props }) {
  const isFile = type === "file";
  return (
    <input
      type={type}
      {...props}
      className={`w-full rounded-xl border border-slate-300 bg-white text-sm text-slate-900 outline-none transition placeholder:text-slate-400
        ${isFile
          ? "px-2 py-1.5 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
          : "px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        } ${className}`}
    />
  );
}

function Label({ children }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {children}
    </label>
  );
}

function ParameterPreview({ parametro }) {
  const width = normalizarPorcentaje(parametro.porcentaje);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-semibold text-slate-900">
          {parametro.nombre || "Nombre del parámetro"}
        </p>

        <div className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">
            {parametro.valor || "0"}
          </span>
          {parametro.rango ? <span className="ml-2">({parametro.rango})</span> : null}
        </div>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width }}
        />
      </div>

      <p className="mt-2 text-xs font-medium text-slate-500">
        Vista previa: {width}
      </p>
    </div>
  );
}

/* ========================= COMPONENTE PRINCIPAL ========================= */
function AdminGestionAgua() {
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [confirmacionNavegacion, setConfirmacionNavegacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const [guardandoParametros, setGuardandoParametros] = useState(false);
  const [guardandoAforos, setGuardandoAforos] = useState(false);
  const [guardandoInfraestructura, setGuardandoInfraestructura] =
    useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [nuevaImagen, setNuevaImagen] = useState(null);

  const [hasUnsavedParametros, setHasUnsavedParametros] = useState(false);
  const [hasUnsavedAforos, setHasUnsavedAforos] = useState(false);
  const [hasUnsavedInfraestructura, setHasUnsavedInfraestructura] = useState(false);

  const removeToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const addToast = (type, message, extra = {}) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message, ...extra }]);

    if (type !== "confirm") {
      setTimeout(() => removeToast(id), 3500);
    }

    return id;
  };

  const showSuccess = (msg) => addToast("success", msg);
  const showError = (msg) => addToast("error", msg);

  const showConfirm = (msg) =>
    new Promise((resolve) => {
      const id = addToast("confirm", msg, {
        onConfirm: () => {
          removeToast(id);
          resolve(true);
        },
        onCancel: () => {
          removeToast(id);
          resolve(false);
        },
      });
    });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedParametros || hasUnsavedAforos || hasUnsavedInfraestructura) {
        e.preventDefault();
        e.returnValue = "Tienes cambios sin guardar. ¿Seguro que deseas salir?";
        return e.returnValue;
      }
    };

    const handleGlobalClick = (e) => {
      const isDirty = hasUnsavedParametros || hasUnsavedAforos || hasUnsavedInfraestructura;
      if (!isDirty) return;

      let target = e.target;
      while (target && target !== document.body) {
        const isLink = target.tagName === "A";
        const isButtonInHeaderOrSidebar = target.tagName === "BUTTON" && (target.closest("header") || target.closest("aside"));

        if (isLink || isButtonInHeaderOrSidebar) {
          let href = "";
          let isLogout = false;

          if (isLink) {
            href = target.getAttribute("href") || target.getAttribute("to");
            if (href && (href.startsWith("#") || href === window.location.pathname)) {
              break;
            }
          } else {
            isLogout = true;
          }

          e.preventDefault();
          e.stopPropagation();

          setConfirmacionNavegacion({
            onConfirm: () => {
              setConfirmacionNavegacion(null);
              setHasUnsavedParametros(false);
              setHasUnsavedAforos(false);
              setHasUnsavedInfraestructura(false);

              if (isLogout) {
                if (target.click) {
                  setTimeout(() => {
                    target.click();
                  }, 50);
                } else {
                  window.location.href = "/admin/login";
                }
              } else if (href) {
                navigate(href);
              }
            },
            onCancel: () => {
              setConfirmacionNavegacion(null);
            }
          });
          break;
        }
        target = target.parentElement;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, [hasUnsavedParametros, hasUnsavedAforos, hasUnsavedInfraestructura]);

  const cargarDatos = async () => {
    try {
      const data = await obtenerGestionAgua();

      setForm({
        ...data,
        parametros: data.parametros || [],
        infraestructura: data.infraestructura || [],
        aforos: {
          fecha: data.aforos?.fecha || "",
          total: data.aforos?.total || "",
          registros: data.aforos?.registros || [],
        },
        analisisCalidadAgua: {
          titulo:
            data.analisisCalidadAgua?.titulo || "Análisis de calidad del agua",
          fotos: data.analisisCalidadAgua?.fotos || [],
        },
      });
      setHasUnsavedParametros(false);
      setHasUnsavedAforos(false);
      setHasUnsavedInfraestructura(false);
    } catch (error) {
      showError("Error al cargar gestión del agua");
    } finally {
      setLoading(false);
    }
  };

  const guardarParametros = async () => {
    try {
      setGuardandoParametros(true);

      await actualizarGestionAgua({
        parametros: form.parametros.map((p) => ({
          ...p,
          porcentaje: normalizarPorcentaje(p.porcentaje),
        })),
      });

      await cargarDatos();
      setHasUnsavedParametros(false);
      showSuccess("Parámetros guardados correctamente");
    } catch (error) {
      showError("Error al guardar parámetros");
    } finally {
      setGuardandoParametros(false);
    }
  };

  const guardarAforos = async () => {
    try {
      setGuardandoAforos(true);

      await actualizarGestionAgua({
        aforos: form.aforos,
      });

      await cargarDatos();
      setHasUnsavedAforos(false);
      showSuccess("Aforos guardados correctamente");
    } catch (error) {
      showError("Error al guardar aforos");
    } finally {
      setGuardandoAforos(false);
    }
  };

  const guardarInfraestructura = async () => {
    try {
      setGuardandoInfraestructura(true);

      await actualizarGestionAgua({
        infraestructura: form.infraestructura,
      });

      await cargarDatos();
      setHasUnsavedInfraestructura(false);
      showSuccess("Infraestructura guardada correctamente");
    } catch (error) {
      showError("Error al guardar infraestructura");
    } finally {
      setGuardandoInfraestructura(false);
    }
  };

  const handleParametroChange = (index, campo, valor) => {
    const nuevos = [...form.parametros];
    nuevos[index][campo] = valor;
    setForm((prev) => ({ ...prev, parametros: nuevos }));
    setHasUnsavedParametros(true);
  };

  const agregarParametro = () => {
    setForm((prev) => ({
      ...prev,
      parametros: [...prev.parametros, crearParametroVacio()],
    }));
    setHasUnsavedParametros(true);
  };

  const eliminarParametro = async (index) => {
    const confirmed = await showConfirm(
      "¿Deseas eliminar este parámetro? Deberás presionar 'Guardar parámetros' para aplicar el cambio."
    );

    if (!confirmed) return;

    const nuevos = [...form.parametros];
    nuevos.splice(index, 1);
    setForm((prev) => ({ ...prev, parametros: nuevos }));
    setHasUnsavedParametros(true);
  };

  const handleSubirImagen = async (e) => {
    e.preventDefault();

    if (!nuevaImagen) {
      showError("Seleccione una imagen");
      return;
    }

    try {
      setSubiendoFoto(true);

      const formData = new FormData();
      formData.append("fecha", formatearFechaActual());
      formData.append("imagen", nuevaImagen);

      await subirFotoAnalisis(formData);
      setNuevaImagen(null);
      await cargarDatos();

      showSuccess("Foto subida correctamente");
    } catch (error) {
      showError("Error al subir foto");
    } finally {
      setSubiendoFoto(false);
    }
  };

  const handleEliminarFoto = async (fotoId) => {
    const confirmed = await showConfirm("¿Desea eliminar esta foto?");

    if (!confirmed) return;

    try {
      await eliminarFotoAnalisis(fotoId);
      await cargarDatos();

      showSuccess("Foto eliminada correctamente");
    } catch (error) {
      showError("Error al eliminar foto");
    }
  };

  const handleAforoChange = (campo, valor) => {
    setForm((prev) => ({
      ...prev,
      aforos: {
        ...prev.aforos,
        [campo]: valor,
      },
    }));
    setHasUnsavedAforos(true);
  };

  const handleAforoRegistroChange = (index, campo, valor) => {
    const nuevos = [...form.aforos.registros];
    nuevos[index][campo] = valor;

    setForm((prev) => ({
      ...prev,
      aforos: {
        ...prev.aforos,
        registros: nuevos,
      },
    }));
    setHasUnsavedAforos(true);
  };

  const agregarAforo = () => {
    setForm((prev) => ({
      ...prev,
      aforos: {
        ...prev.aforos,
        registros: [...prev.aforos.registros, crearAforoVacio()],
      },
    }));
    setHasUnsavedAforos(true);
  };

  const eliminarAforo = async (index) => {
    const confirmed = await showConfirm(
      "¿Deseas eliminar este registro de aforo? Recuerda que debes presionar 'Guardar aforos' arriba para aplicar los cambios."
    );

    if (!confirmed) return;

    const nuevos = [...form.aforos.registros];
    nuevos.splice(index, 1);

    setForm((prev) => ({
      ...prev,
      aforos: {
        ...prev.aforos,
        registros: nuevos,
      },
    }));
    setHasUnsavedAforos(true);
  };

  const handleInfraTituloChange = (index, valor) => {
    const nuevas = [...form.infraestructura];
    nuevas[index].titulo = valor;

    setForm((prev) => ({
      ...prev,
      infraestructura: nuevas,
    }));
    setHasUnsavedInfraestructura(true);
  };

  const handleInfraItemChange = (infraIndex, itemIndex, valor) => {
    const nuevas = [...form.infraestructura];
    nuevas[infraIndex].items[itemIndex] = valor;

    setForm((prev) => ({
      ...prev,
      infraestructura: nuevas,
    }));
    setHasUnsavedInfraestructura(true);
  };

  const agregarBloqueInfraestructura = () => {
    setForm((prev) => ({
      ...prev,
      infraestructura: [...prev.infraestructura, crearInfraestructuraVacia()],
    }));
    setHasUnsavedInfraestructura(true);
  };

  const eliminarBloqueInfraestructura = async (index) => {
    const confirmed = await showConfirm(
      "¿Deseas eliminar este bloque de infraestructura? Recuerda presionar 'Guardar infraestructura' arriba para aplicar los cambios."
    );

    if (!confirmed) return;

    const nuevas = [...form.infraestructura];
    nuevas.splice(index, 1);

    setForm((prev) => ({
      ...prev,
      infraestructura: nuevas,
    }));
    setHasUnsavedInfraestructura(true);
  };

  const agregarItemInfraestructura = (index) => {
    const nuevas = [...form.infraestructura];
    nuevas[index].items.push("");

    setForm((prev) => ({
      ...prev,
      infraestructura: nuevas,
    }));
    setHasUnsavedInfraestructura(true);
  };

  const eliminarItemInfraestructura = async (infraIndex, itemIndex) => {
    const confirmed = await showConfirm(
      "¿Deseas eliminar este detalle? Recuerda guardar los cambios arriba para aplicar el cambio."
    );

    if (!confirmed) return;

    const nuevas = [...form.infraestructura];
    nuevas[infraIndex].items.splice(itemIndex, 1);

    setForm((prev) => ({
      ...prev,
      infraestructura: nuevas,
    }));
    setHasUnsavedInfraestructura(true);
  };

  if (loading) return <p className="p-6 text-slate-800">Cargando...</p>;

  if (!form) {
    return (
      <p className="p-6 text-red-600">
        No se pudo cargar la información.
      </p>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl leading-tight">
          Gestión del Agua
        </h1>

        <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600">
          Administra los parámetros, aforos, infraestructura y análisis del
          sistema.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* 1. Parámetros */}
        <SectionCard
          title="1. Parámetros de Calidad"
          subtitle="Edite los parámetros de calidad del agua. Recuerde presionar 'Guardar parámetros' al terminar o al realizar eliminaciones para aplicar los cambios de forma permanente."
          actions={
            <ActionButton
              variant="success"
              onClick={guardarParametros}
              disabled={guardandoParametros}
              className="w-full sm:w-auto text-center"
            >
              {guardandoParametros ? "Guardando..." : "Guardar parámetros"}
            </ActionButton>
          }
        >
          {hasUnsavedParametros && (
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs sm:text-sm text-amber-800 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span>Tienes <strong>cambios sin guardar</strong> en los parámetros. Presiona el botón verde de arriba para guardarlos de forma permanente.</span>
              </div>
            </div>
          )}
          <div className="mb-5 flex justify-start">
            <ActionButton variant="primary" onClick={agregarParametro} className="w-full sm:w-auto text-center">
              + Agregar parámetro
            </ActionButton>
          </div>

          <div className="max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid gap-5 lg:grid-cols-2">
              {form.parametros.map((parametro, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-bold text-slate-900">
                      Parámetro {index + 1}
                    </h3>

                    <ActionButton
                      variant="danger"
                      onClick={() => eliminarParametro(index)}
                      className="text-xs py-1.5 px-3 rounded-lg"
                    >
                      Eliminar
                    </ActionButton>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Nombre:</Label>
                      <Input
                        type="text"
                        value={parametro.nombre}
                        onChange={(e) =>
                          handleParametroChange(index, "nombre", e.target.value)
                        }
                        placeholder="Nombre"
                      />
                    </div>

                    <div>
                      <Label>Valor:</Label>
                      <Input
                        type="text"
                        value={parametro.valor}
                        onChange={(e) =>
                          handleParametroChange(index, "valor", e.target.value)
                        }
                        placeholder="Valor"
                      />
                    </div>

                    <div>
                      <Label>Rango:</Label>
                      <Input
                        type="text"
                        value={parametro.rango}
                        onChange={(e) =>
                          handleParametroChange(index, "rango", e.target.value)
                        }
                        placeholder="Rango"
                      />
                    </div>

                    <div>
                      <Label>Porcentaje:</Label>
                      <Input
                        type="text"
                        value={parametro.porcentaje}
                        onChange={(e) =>
                          handleParametroChange(
                            index,
                            "porcentaje",
                            e.target.value
                          )
                        }
                        placeholder="Ejemplo: 70%"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <ParameterPreview parametro={parametro} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* 2. Fotos */}
        <SectionCard
          title="2. Fotos de análisis"
          subtitle="Primero seleccione una imagen y luego presione Agregar foto. Las imágenes guardadas aparecerán debajo."
        >
          <div className="grid gap-6 lg:grid-cols-[360px_1fr] xl:grid-cols-[420px_1fr]">
            <form
              onSubmit={handleSubirImagen}
              className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 self-start"
            >
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Subir nueva foto
              </h3>

              <div>
                <Label>Seleccionar imagen</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNuevaImagen(e.target.files[0])}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Fecha automática: {formatearFechaActual()}
              </p>

              <div className="mt-5">
                <ActionButton
                  type="submit"
                  variant="primary"
                  disabled={subiendoFoto}
                  className="w-full text-center"
                >
                  {subiendoFoto ? "Subiendo..." : "Agregar foto"}
                </ActionButton>
              </div>
            </form>

            <div>
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Fotos guardadas
              </h3>

              {form.analisisCalidadAgua?.fotos?.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  Aún no hay fotos registradas.
                </div>
              ) : (
                <div className="max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {form.analisisCalidadAgua?.fotos?.map((foto) => (
                      <div
                        key={foto._id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                      >
                        <div className="relative h-48 sm:h-56 bg-slate-100">
                          <img
                            src={`${BASE_URL}${foto.imagen}`}
                            alt={foto.fecha}
                            className="h-full w-full object-cover"
                          />

                          <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow-sm">
                            {foto.fecha}
                          </div>
                        </div>

                        <div className="p-4">
                          <ActionButton
                            variant="danger"
                            onClick={() => handleEliminarFoto(foto._id)}
                            className="w-full text-xs py-2 text-center"
                          >
                            Eliminar foto
                          </ActionButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* 3. Aforos */}
        <SectionCard
          title="3. Tabla de Aforos"
          subtitle="Administre la fecha general y los registros de la tabla. Recuerde presionar 'Guardar aforos' para aplicar cualquier cambio o eliminación realizada."
          actions={
            <ActionButton
              variant="success"
              onClick={guardarAforos}
              disabled={guardandoAforos}
              className="w-full sm:w-auto text-center"
            >
              {guardandoAforos ? "Guardando..." : "Guardar aforos"}
            </ActionButton>
          }
        >
          {hasUnsavedAforos && (
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs sm:text-sm text-amber-800 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span>Tienes <strong>cambios sin guardar</strong> en la tabla de aforos. Presiona el botón verde de arriba para guardarlos de forma permanente.</span>
              </div>
            </div>
          )}
          <div className="mb-5 flex justify-start">
            <ActionButton variant="primary" onClick={agregarAforo} className="w-full sm:w-auto text-center">
              + Agregar registro
            </ActionButton>
          </div>

          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Fecha general:</Label>
              <Input
                type="text"
                value={form.aforos.fecha}
                onChange={(e) => handleAforoChange("fecha", e.target.value)}
                placeholder="Ejemplo: Abril 2026"
              />
            </div>

            <div>
              <Label>Total:</Label>
              <Input
                type="text"
                value={form.aforos.total}
                onChange={(e) => handleAforoChange("total", e.target.value)}
                placeholder="Total de l/s"
              />
            </div>
          </div>

          {/* Vista Móvil: Tarjetas (visible solo en pantallas pequeñas) */}
          <div className="block md:hidden space-y-4 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
            {form.aforos.registros.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 text-center">
                Aún no hay registros de aforo.
              </div>
            ) : (
              form.aforos.registros.map((registro, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3 relative animate-fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-sm font-bold text-slate-900">
                      Registro {index + 1}
                    </span>
                    <ActionButton
                      variant="danger"
                      onClick={() => eliminarAforo(index)}
                      className="text-xs py-1.5 px-3 rounded-lg"
                    >
                      Eliminar
                    </ActionButton>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label>Lugar:</Label>
                      <Input
                        type="text"
                        value={registro.lugar}
                        onChange={(e) =>
                          handleAforoRegistroChange(
                            index,
                            "lugar",
                            e.target.value
                          )
                        }
                        placeholder="Lugar"
                      />
                    </div>

                    <div>
                      <Label>Producción:</Label>
                      <Input
                        type="text"
                        value={registro.produccion}
                        onChange={(e) =>
                          handleAforoRegistroChange(
                            index,
                            "produccion",
                            e.target.value
                          )
                        }
                        placeholder="Producción"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Vista Escritorio: Tabla (oculta en pantallas móviles) */}
          <div className="hidden md:block max-h-[550px] overflow-auto rounded-2xl border border-slate-200 custom-scrollbar">
            <table className="w-full min-w-[700px] border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-900">
                    Lugar
                  </th>
                  <th className="border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-900">
                    Producción
                  </th>
                  <th className="border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-900">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                {form.aforos.registros.map((registro, index) => (
                  <tr key={index} className="bg-white animate-fade-in">
                    <td className="border border-slate-200 p-3">
                      <Input
                        type="text"
                        value={registro.lugar}
                        onChange={(e) =>
                          handleAforoRegistroChange(
                            index,
                            "lugar",
                            e.target.value
                          )
                        }
                        placeholder="Lugar"
                      />
                    </td>

                    <td className="border border-slate-200 p-3">
                      <Input
                        type="text"
                        value={registro.produccion}
                        onChange={(e) =>
                          handleAforoRegistroChange(
                            index,
                            "produccion",
                            e.target.value
                          )
                        }
                        placeholder="Producción"
                      />
                    </td>

                    <td className="border border-slate-200 p-3">
                      <div className="flex justify-center">
                        <DeleteIconButton
                          onClick={() => eliminarAforo(index)}
                          title="Eliminar registro"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* 4. Infraestructura */}
        <SectionCard
          title="4. Infraestructura del Sistema"
          subtitle="Gestione los bloques de infraestructura y sus detalles. Recuerde presionar 'Guardar infraestructura' para aplicar todos los cambios y eliminaciones de esta sección."
          actions={
            <ActionButton
              variant="success"
              onClick={guardarInfraestructura}
              disabled={guardandoInfraestructura}
              className="w-full sm:w-auto text-center"
            >
              {guardandoInfraestructura
                ? "Guardando..."
                : "Guardar infraestructura"}
            </ActionButton>
          }
        >
          {hasUnsavedInfraestructura && (
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs sm:text-sm text-amber-800 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span>Tienes <strong>cambios sin guardar</strong> en la infraestructura. Presiona el botón verde de arriba para guardarlos de forma permanente.</span>
              </div>
            </div>
          )}
          <div className="mb-5 flex justify-start">
            <ActionButton variant="primary" onClick={agregarBloqueInfraestructura} className="w-full sm:w-auto text-center">
              + Agregar bloque
            </ActionButton>
          </div>

          <div className="max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-5">
              {form.infraestructura.map((bloque, infraIndex) => (
                <div
                  key={infraIndex}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 animate-fade-in"
                >
                  <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-900">
                      Bloque {infraIndex + 1}
                    </h3>

                    <ActionButton
                      variant="danger"
                      onClick={() => eliminarBloqueInfraestructura(infraIndex)}
                      className="w-full sm:w-auto text-xs py-2 px-3 text-center"
                    >
                      Eliminar bloque
                    </ActionButton>
                  </div>

                  <div className="mb-6">
                    <Label>Título del bloque:</Label>
                    <Input
                      type="text"
                      value={bloque.titulo}
                      onChange={(e) =>
                        handleInfraTituloChange(infraIndex, e.target.value)
                      }
                      placeholder="Ejemplo: Nacientes"
                    />
                  </div>

                  <div className="mb-3">
                    <Label>Puntos de información (detalles):</Label>
                  </div>

                  <div className="space-y-3">
                    {bloque.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2 sm:gap-3">
                        <Input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleInfraItemChange(
                              infraIndex,
                              itemIndex,
                              e.target.value
                            )
                          }
                          placeholder="Detalle"
                        />

                        <DeleteIconButton
                          onClick={() =>
                            eliminarItemInfraestructura(infraIndex, itemIndex)
                          }
                          title="Eliminar detalle"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-start">
                    <ActionButton
                      variant="secondary"
                      onClick={() => agregarItemInfraestructura(infraIndex)}
                      className="w-full sm:w-auto text-xs py-2 px-3 text-center"
                    >
                      + Agregar ítem
                    </ActionButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {confirmacionNavegacion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md scale-95 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all animate-scale-up">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-4">
                <FiAlertTriangle className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">¿Salir sin guardar los cambios?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Tienes modificaciones pendientes en esta sección. Si sales ahora, perderás todos tus cambios en la gestión del agua de forma permanente.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={confirmacionNavegacion.onCancel}
                className="flex-1 rounded-2xl bg-slate-100 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-[0.98] cursor-pointer"
              >
                Permanecer aquí
              </button>
              <button
                type="button"
                onClick={confirmacionNavegacion.onConfirm}
                className="flex-1 rounded-2xl bg-amber-600 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700 active:scale-[0.98] shadow-lg shadow-amber-100 cursor-pointer"
              >
                Salir sin guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminGestionAgua;