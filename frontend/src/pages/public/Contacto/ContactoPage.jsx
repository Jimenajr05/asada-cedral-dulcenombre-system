import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
} from "react-icons/fi";
import { hero, contactInfo, formOptions } from "./ContactoData";

/* ─── Fondo decorativo del hero ─────────────────────── */
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
  return (
    <main className="bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
        <WaterDropBg />

        <div className="absolute bottom-0 left-0 right-0 leading-none" aria-hidden="true">
          <svg
            viewBox="0 0 1440 80"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="block w-full h-20"
          >
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
        <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* IZQUIERDA */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-8 text-3xl font-bold text-slate-900">
                Información de Contacto
              </h2>

              <div className="space-y-8">
                <ContactItem
                  icon={<FiMapPin className="text-[22px]" />}
                  title="Dirección"
                  items={contactInfo.direccion}
                />

                <ContactItem
                  icon={<FiPhone className="text-[22px]" />}
                  title="Teléfonos"
                  items={contactInfo.telefonos}
                />

                <ContactItem
                  icon={<FiMail className="text-[22px]" />}
                  title="Correos"
                  items={contactInfo.correos}
                />

                <ContactItem
                  icon={<FiClock className="text-[22px]" />}
                  title="Horario"
                  items={contactInfo.horario}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <h3 className="mb-4 text-2xl font-bold text-slate-900">
                {contactInfo.emergencia.titulo}
              </h3>

              <p className="mb-6 text-[17px] leading-8 text-slate-700">
                {contactInfo.emergencia.descripcion}
              </p>

              <a
                href={`tel:${contactInfo.emergencia.telefono}`}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-lg font-bold text-white transition hover:bg-red-700"
              >
                <FiPhone className="text-xl" />
                {contactInfo.emergencia.telefono}
              </a>
            </div>
          </div>

          {/* DERECHA */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-8 text-3xl font-bold text-slate-900">
              Envíanos un mensaje
            </h2>

            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-base font-medium text-slate-800">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    placeholder="Juan Pérez"
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-base font-medium text-slate-800">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500"
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
                    placeholder="8888-8888"
                    className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-base font-medium text-slate-800">
                    Asunto *
                  </label>
                  <select className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-700 outline-none transition focus:border-blue-500">
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
                  rows="6"
                  placeholder="Escribe tu mensaje aquí..."
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-base text-slate-700 outline-none transition focus:border-blue-500"
                />
              </div>

              <button
                type="button"
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
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm">
            <a
              href={contactInfo.mapaLink}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-[520px] flex-col items-center justify-center px-6 text-center transition hover:bg-slate-300/40"
            >
              <FiMapPin className="mb-4 text-6xl text-slate-400" />
              <h3 className="text-3xl font-semibold text-slate-600">
                Mapa de ubicación
              </h3>
              <p className="mt-2 text-lg text-slate-500">
                (Se integraría Google Maps o similar)
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}