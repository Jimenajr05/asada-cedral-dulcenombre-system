/**
 * @file ContactoPage.jsx
 * @description Página pública de "Contacto". Muestra los canales oficiales de atención al abonado (ubicación, teléfonos, correos oficiales, horarios), acceso rápido a emergencias telefónicas y por WhatsApp, un formulario que genera y abre un mensaje precargado en WhatsApp Web, y un mapa interactivo embebido de Google Maps.
 */

import { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
} from "react-icons/fi";
import { hero, contactInfo, formOptions } from "./ContactoData";

const WHATSAPP_NUMBER = "50684976556";

/**
 * Fondo decorativo animado con formas de gotas de agua.
 * @component
 */
const WaterDropBg = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.05]" viewBox="0 0 800 400">
    <circle cx="660" cy="70" r="200" fill="white" />
    <circle cx="100" cy="330" r="130" fill="white" />
    <circle cx="390" cy="210" r="80" fill="white" />
  </svg>
);

function ContactItem({ icon, title, items }) {
  return (
    <div className="group flex items-start gap-4 rounded-xl p-3 transition-all duration-300 hover:bg-white hover:shadow-md hover:scale-[1.01]">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-sky-600 shadow-sm ring-1 ring-sky-100 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
          {title}
        </h3>

        <div className="mt-1 space-y-0.5 text-sm leading-6 text-slate-600">
          {items.map((item) => {
            const isEmail = item.includes("@");

            if (isEmail) {
              const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${item}`;

              return (
                <a
                  key={item}
                  href={gmailUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block break-all sm:break-normal text-slate-600 hover:underline transition"
                >
                  {item}
                </a>
              );
            }

            return (
              <p key={item} className="break-words text-slate-600 whitespace-normal">
                {item}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Componente de página pública de "Contacto".
 * Proporciona canales de atención al abonado y un formulario directo de WhatsApp.
 * @component
 */
export default function ContactoPage() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    asunto: formOptions[0] || "",
    mensaje: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      `Mensaje:\n${form.mensaje}\n`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      texto
    )}`;

    window.open(url, "_blank");

    setForm({
      nombre: "",
      correo: "",
      telefono: "",
      asunto: formOptions[0] || "",
      mensaje: "",
    });
  };

  return (
    <main className="bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900">
        <WaterDropBg />

        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-sky-500/15 blur-[100px]" />

        <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-teal-500/10 blur-[80px]" />

        <div
          className="absolute bottom-0 left-0 right-0 leading-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            className="block h-20 w-full"
          >
            <path
              d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,80L0,80Z"
              fill="#f8fafc"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-12 sm:pb-28 sm:pt-16 text-center sm:px-6 lg:px-8">
          <span className="section-badge mb-5 border border-sky-400/30 bg-sky-500/20 text-sky-300">
            Atención al abonado
          </span>

          <h1
            className="mb-5 mt-4 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {hero.title}
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-blue-100">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[405px_minmax(0,1fr)] lg:items-start">

          {/* Izquierda */}
          <div className="space-y-6">

            {/* Contacto */}
            <div className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">

              {/* Decorativo */}
              <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-slate-100 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-slate-100 blur-2xl" />

              <div className="relative">

                {/* Título */}
                <div className="ml-2 sm:ml-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Información de Contacto
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Canales oficiales de atención al usuario.
                  </p>
                </div>

                {/* Divider */}
                <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

                {/* Items */}
                <div className="mt-4 space-y-3 flex-1">

                  <ContactItem
                    icon={<FiMapPin className="text-[18px]" />}
                    title="Ubicación"
                    items={contactInfo.direccion}
                  />

                  <ContactItem
                    icon={<FiPhone className="text-[18px]" />}
                    title="Teléfonos"
                    items={contactInfo.telefonos}
                  />

                  <ContactItem
                    icon={<FiMail className="text-[18px]" />}
                    title="Correos oficiales"
                    items={contactInfo.correos}
                  />

                  <ContactItem
                    icon={<FiClock className="text-[18px]" />}
                    title="Horario de atención"
                    items={contactInfo.horario}
                  />

                </div>
              </div>
            </div>

            {/* Emergencia */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-6 shadow-sm">
              <h3 className="mb-3 text-2xl font-bold text-slate-900">
                {contactInfo.emergencia.titulo}
              </h3>

              <p className="mb-5 text-[17px] leading-8 text-slate-700">
                {contactInfo.emergencia.descripcion}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href={`tel:${contactInfo.emergencia.telefono}`}
                  className="flex-1 group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-red-500 to-red-700 px-6 py-3.5 text-lg font-bold text-white shadow-lg shadow-red-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-red-300 active:scale-95"
                >
                  <FiPhone className="text-xl transition-transform group-hover:rotate-12" />
                  Llamar
                </a>

                <a
                  href={`https://wa.me/506${contactInfo.emergencia.telefono.replace(/-/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 px-6 py-3.5 text-lg font-bold text-white shadow-lg shadow-green-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-green-300 active:scale-95"
                >
                  WhatsApp
                </a>
              </div>
            </div>

          </div>

          {/* Derecha */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-slate-900">
              Envíanos un mensaje
            </h2>

            <p className="mb-8 text-sm text-slate-500">
              Al enviar, se abrirá WhatsApp con tu mensaje listo para enviarlo.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-base font-medium text-slate-800">
                    Nombre completo:
                  </label>

                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-base font-medium text-slate-800">
                    Correo electrónico:
                  </label>

                  <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    required
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-base font-medium text-slate-800">
                    Teléfono:
                  </label>

                  <input
                    type="text"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-base font-medium text-slate-800">
                    Asunto:
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
                  Mensaje:
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
                className="group relative inline-flex h-15 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] active:translate-y-0 active:scale-[0.98]"
              >
                <FiSend className="text-xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" />

                <span className="relative">
                  Enviar mensaje
                </span>
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Mapa */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <iframe
              title="Ubicación ASADA Cedral y Dulce Nombre"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.5!2d-84.4362427!3d10.3735681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa065002f2cf143%3A0x3e834fd6aad3eb40!2sASADA+CEDRAL+Y+DULCE+NOMBRE!5e1!3m2!1ses!2scr!4v1700000000000!5m2!1ses!2scr"
              width="100%"
              className="h-[300px] sm:h-[400px] md:h-[520px] w-full"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-6 flex justify-center">
            <a
              href="https://maps.app.goo.gl/44S8Kq5Y9M9qb821A"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/30 active:translate-y-0"
            >
              <FiMapPin className="text-lg" />
              Abrir en Google Maps
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}