import { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
} from "react-icons/fi";
import { hero, contactInfo, formOptions } from "./ContactoData";

// Número de WhatsApp de la ASADA (sin guiones ni espacios, con código de país)
const WHATSAPP_NUMBER = "50684976556";

const WaterDropBg = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 800 400">
    <circle cx="660" cy="70" r="200" fill="white" />
    <circle cx="100" cy="330" r="130" fill="white" />
    <circle cx="390" cy="210" r="80" fill="white" />
  </svg>
);

function ContactItem({ icon, title, items }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        {icon}
      </div>
      <div>
        <h3 className="mb-2 text-xl font-semibold text-slate-900">{title}</h3>
        <div className="space-y-1 text-[17px] leading-8 text-slate-700">
          {items.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre:  "",
    correo:  "",
    telefono: "",
    asunto:  formOptions[0] || "",
    mensaje: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre.trim() || !form.correo.trim() || !form.mensaje.trim()) {
      alert("Por favor completá los campos obligatorios.");
      return;
    }

    const texto =
      `ASADA Cedral y Dulce Nombre\n` +
      `Mensaje recibido desde la página web\n` +
      `Nombre: ${form.nombre}\n` +
      `Correo: ${form.correo}\n` +
      (form.telefono ? `Teléfono: ${form.telefono}\n` : "") +
      `Asunto: ${form.asunto}\n\n` +
      `Mensaje: \n${form.mensaje}\n`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");

    setForm({
      nombre:   "",
      correo:   "",
      telefono: "",
      asunto:   formOptions[0] || "",
      mensaje:  "",
    });
  };

  return (
    <main className="bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <WaterDropBg />
        <div className="absolute bottom-0 left-0 right-0 leading-none" aria-hidden="true">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block w-full h-20">
            <path
              d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
        <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-16 text-center sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-center gap-2 text-xs text-blue-300">
            <span>Inicio</span>
            <span>›</span>
            <span className="font-medium text-white">{hero.title}</span>
          </div>
          <h1 className="mb-5 text-4xl font-extrabold text-white sm:text-5xl">
            {hero.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-blue-100">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
          {/* IZQUIERDA */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-8 text-3xl font-bold text-slate-900">
                Información de Contacto
              </h2>
              <div className="space-y-8">
                <ContactItem icon={<FiMapPin className="text-[22px]" />} title="Dirección"  items={contactInfo.direccion} />
                <ContactItem icon={<FiPhone className="text-[22px]" />}  title="Teléfonos" items={contactInfo.telefonos} />
                <ContactItem icon={<FiMail  className="text-[22px]" />}  title="Correos"   items={contactInfo.correos} />
                <ContactItem icon={<FiClock className="text-[22px]" />}  title="Horario"   items={contactInfo.horario} />
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                {contactInfo.emergencia.titulo}
              </h3>
              <p className="mb-6 text-[17px] leading-8 text-slate-700">
                {contactInfo.emergencia.descripcion}
              </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${contactInfo.emergencia.telefono}`}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-lg font-bold text-white transition hover:bg-red-700"
              >
                <FiPhone className="text-xl" />
                {contactInfo.emergencia.telefono}
              </a>
              <a
                href={`https://wa.me/506${contactInfo.emergencia.telefono.replace(/-/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-lg font-bold text-white transition hover:bg-green-700"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.847L.057 23.428a.75.75 0 0 0 .916.916l5.606-1.47A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.714 9.714 0 0 1-4.953-1.355l-.355-.212-3.68.965.982-3.589-.232-.371A9.714 9.714 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
                WhatsApp
              </a>
            </div>
            </div>
          </div>

          {/* DERECHA — FORMULARIO */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-3xl font-bold text-slate-900">
              Envíanos un mensaje
            </h2>
            <p className="mb-8 text-sm text-slate-500">
              Al enviar, se abrirá WhatsApp con tu mensaje listo para enviarlo.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-base font-medium text-slate-800">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    required
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-base font-medium text-slate-800">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    required
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-base font-medium text-slate-800">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="8888-8888"
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-base font-medium text-slate-800">
                    Asunto *
                  </label>
                  <select
                    name="asunto"
                    value={form.asunto}
                    onChange={handleChange}
                    required
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {formOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-base font-medium text-slate-800">
                  Mensaje *
                </label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Escribe tu mensaje aquí..."
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 text-lg font-semibold text-white transition hover:bg-blue-700"
              >
                <FiSend className="text-xl" />
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <iframe
              title="Ubicación ASADA Cedral y Dulce Nombre"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.5!2d-84.4362427!3d10.3735681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa065002f2cf143%3A0x3e834fd6aad3eb40!2sASADA+CEDRAL+Y+DULCE+NOMBRE!5e1!3m2!1ses!2scr!4v1700000000000!5m2!1ses!2scr"
              width="100%"
              height="520"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-3 text-center text-sm text-slate-500">
            <a
              href="https://maps.app.goo.gl/44S8Kq5Y9M9qb821A"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Ver en Google Maps →
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}