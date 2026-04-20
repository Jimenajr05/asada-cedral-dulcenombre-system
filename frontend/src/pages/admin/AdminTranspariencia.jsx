import { useRef, useState } from "react";
import { Pencil, Trash2, Upload, CalendarDays, Image as ImageIcon, Link as LinkIcon } from "lucide-react";

// ─── Links estáticos editables ────────────────────────────────────────────────
const LINKS_INICIALES = [
  { id: "asamblea",    label: "Informe de Asamblea",  url: "https://drive.google.com/drive/folders/REEMPLAZAR" },
  { id: "financieros", label: "Estados Financieros",  url: "https://drive.google.com/drive/folders/REEMPLAZAR" },
  { id: "tarifas",    label: "Tarifas (ARESEP)",      url: "https://aresep.go.cr/agua-potable/tarifas/" },
];

function AdminTransparencia() {
  // ── Links ──────────────────────────────────────────────────────────────────
  const [links, setLinks] = useState(LINKS_INICIALES);
  const [linkEditando, setLinkEditando] = useState(null); // id del link
  const [linkUrl, setLinkUrl]           = useState("");

  const handleEditarLink = (link) => {
    setLinkEditando(link.id);
    setLinkUrl(link.url);
  };

  const handleGuardarLink = () => {
    setLinks((prev) =>
      prev.map((l) => (l.id === linkEditando ? { ...l, url: linkUrl } : l))
    );
    setLinkEditando(null);
    setLinkUrl("");
  };

  // ── Reuniones ─────────────────────────────────────────────────────────────
  const [reuniones, setReuniones]           = useState([]);
  const [reunionForm, setReunionForm]       = useState({ descripcion: "", fecha: "" });
  const [editandoReunion, setEditandoReunion] = useState(null);

  const limpiarReunionForm = () => {
    setReunionForm({ descripcion: "", fecha: "" });
    setEditandoReunion(null);
  };

  const handleGuardarReunion = (e) => {
    e.preventDefault();
    if (!reunionForm.descripcion.trim()) {
      alert("La descripción es obligatoria");
      return;
    }
    if (editandoReunion !== null) {
      setReuniones((prev) =>
        prev.map((r, i) => (i === editandoReunion ? { ...reunionForm } : r))
      );
    } else {
      setReuniones((prev) => [...prev, { ...reunionForm }]);
    }
    limpiarReunionForm();
  };

  const handleEditarReunion = (index) => {
    setEditandoReunion(index);
    setReunionForm({ ...reuniones[index] });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminarReunion = (index) => {
    if (!window.confirm("¿Deseas eliminar esta reunión?")) return;
    setReuniones((prev) => prev.filter((_, i) => i !== index));
    if (editandoReunion === index) limpiarReunionForm();
  };

  // ── Certificados ──────────────────────────────────────────────────────────
  const certFileRef = useRef(null);
  const [certificados, setCertificados]     = useState([]);
  const [certForm, setCertForm]             = useState({ titulo: "", imagenUrl: "", preview: null });
  const [editandoCert, setEditandoCert]     = useState(null);

  const limpiarCertForm = () => {
    setCertForm({ titulo: "", imagenUrl: "", preview: null });
    setEditandoCert(null);
    if (certFileRef.current) certFileRef.current.value = "";
  };

  const handleCertFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCertForm((prev) => ({
      ...prev,
      preview: URL.createObjectURL(file),
      imagenUrl: file.name,
    }));
  };

  const handleGuardarCert = (e) => {
    e.preventDefault();
    if (!certForm.preview && !certForm.imagenUrl) {
      alert("Debes seleccionar una imagen");
      return;
    }
    const nuevo = { titulo: certForm.titulo, imagenUrl: certForm.preview || certForm.imagenUrl };
    if (editandoCert !== null) {
      setCertificados((prev) => prev.map((c, i) => (i === editandoCert ? nuevo : c)));
    } else {
      setCertificados((prev) => [...prev, nuevo]);
    }
    limpiarCertForm();
  };

  const handleEditarCert = (index) => {
    setEditandoCert(index);
    setCertForm({
      titulo: certificados[index].titulo,
      imagenUrl: certificados[index].imagenUrl,
      preview: certificados[index].imagenUrl,
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleEliminarCert = (index) => {
    if (!window.confirm("¿Deseas eliminar este certificado?")) return;
    setCertificados((prev) => prev.filter((_, i) => i !== index));
    if (editandoCert === index) limpiarCertForm();
  };

  return (
    <div className="space-y-8 bg-slate-100 p-7">
      {/* ENCABEZADO */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
          Gestión de Transparencia
        </h1>
        <p className="mt-2 text-lg text-slate-700">
          Administra los enlaces institucionales, reuniones y certificados.
        </p>
      </div>

      {/* ── SECCIÓN 1: LINKS ESTÁTICOS ─────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <LinkIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">
            Enlaces institucionales
          </h2>
        </div>
        <p className="mb-5 text-sm text-slate-500">
          Actualiza las URLs de los documentos públicos. El link de Tarifas apunta directamente a ARESEP.
        </p>

        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="mb-2 text-sm font-semibold text-slate-800">
                {link.label}
              </p>

              {linkEditando === link.id ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="https://..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleGuardarLink}
                      className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => { setLinkEditando(null); setLinkUrl(""); }}
                      className="rounded-2xl bg-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-sm text-blue-600 hover:underline"
                  >
                    {link.url}
                  </a>
                  <button
                    onClick={() => handleEditarLink(link)}
                    className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-blue-50 px-4 py-2 text-sm text-blue-600 transition hover:bg-blue-100"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── SECCIÓN 2: REUNIONES ──────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">
            Fechas de Reuniones de Junta Directiva
          </h2>
        </div>

        <form onSubmit={handleGuardarReunion} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Descripción *
              </label>
              <input
                type="text"
                value={reunionForm.descripcion}
                onChange={(e) =>
                  setReunionForm((prev) => ({ ...prev, descripcion: e.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Ej: Sesión ordinaria de Junta Directiva"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">
                Fecha
              </label>
              <input
                type="date"
                value={reunionForm.fecha}
                onChange={(e) =>
                  setReunionForm((prev) => ({ ...prev, fecha: e.target.value }))
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {editandoReunion !== null ? "Guardar cambios" : "Agregar reunión"}
            </button>
            <button
              type="button"
              onClick={limpiarReunionForm}
              className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* LISTA */}
        <div className="mt-8 space-y-3">
          {reuniones.length > 0 ? (
            reuniones.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">{r.descripcion}</p>
                  {r.fecha && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(r.fecha + "T00:00:00").toLocaleDateString("es-CR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleEditarReunion(i)}
                    className="flex items-center gap-1.5 rounded-2xl bg-blue-50 px-4 py-2 text-sm text-blue-600 transition hover:bg-blue-100"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminarReunion(i)}
                    className="flex items-center gap-1.5 rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
              No hay reuniones registradas aún.
            </div>
          )}
        </div>
      </section>

      {/* ── SECCIÓN 3: CERTIFICADOS ───────────────────────────────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <ImageIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-slate-900">Certificados</h2>
        </div>

        <form onSubmit={handleGuardarCert} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Título del certificado
            </label>
            <input
              type="text"
              value={certForm.titulo}
              onChange={(e) =>
                setCertForm((prev) => ({ ...prev, titulo: e.target.value }))
              }
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Ej: Certificado de calidad sanitaria 2024"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Imagen *
            </label>
            <div
              onClick={() => certFileRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
            >
              <Upload className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <p className="text-slate-700">Click para seleccionar una imagen</p>
              <p className="mt-1 text-sm text-slate-500">PNG, JPG, JPEG o WEBP</p>

              {certForm.preview && (
                <div className="mx-auto mt-4 h-40 w-40 overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={certForm.preview}
                    alt="Vista previa"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <input
                ref={certFileRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleCertFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {editandoCert !== null ? "Guardar cambios" : "Agregar certificado"}
            </button>
            <button
              type="button"
              onClick={limpiarCertForm}
              className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-300"
            >
              Cancelar
            </button>
          </div>
        </form>

        {/* GALERÍA */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {certificados.length > 0 ? (
            certificados.map((cert, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                  <img
                    src={cert.imagenUrl}
                    alt={cert.titulo || "Certificado"}
                    className="h-full w-full object-cover"
                  />
                </div>
                {cert.titulo && (
                  <p className="px-4 py-3 text-sm font-semibold text-slate-700">
                    {cert.titulo}
                  </p>
                )}
                <div className="flex gap-2 px-4 pb-4">
                  <button
                    onClick={() => handleEditarCert(i)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-blue-50 px-3 py-2 text-sm text-blue-600 transition hover:bg-blue-100"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminarCert(i)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
              No hay certificados registrados aún.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminTransparencia;