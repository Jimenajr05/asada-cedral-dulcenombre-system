import {
  FaFileAlt,
  FaBell,
  FaPhoneAlt,
  FaWrench,
  FaTint,
  FaLeaf,
} from "react-icons/fa";

const quickAccess = [
  {
    title: "Trámites",
    subtitle: "Acceso rápido",
    icon: <FaFileAlt />,
    bg: "bg-blue-500",
  },
  {
    title: "Avisos",
    subtitle: "Acceso rápido",
    icon: <FaBell />,
    bg: "bg-orange-500",
  },
  {
    title: "Contacto",
    subtitle: "Acceso rápido",
    icon: <FaPhoneAlt />,
    bg: "bg-green-500",
  },
  {
    title: "Gestión del Agua",
    subtitle: "Acceso rápido",
    icon: <FaWrench />,
    bg: "bg-purple-500",
  },
];

const notices = [
  {
    title: "Corte de agua programado",
    date: "10 Feb 2026",
    desc: "Se realizarán trabajos de mantenimiento el próximo domingo de 8:00 AM a 2:00 PM.",
    urgent: true,
  },
  {
    title: "Nuevos horarios de atención",
    date: "05 Feb 2026",
    desc: "A partir del 15 de febrero, el horario de atención será de lunes a viernes de 8:00 AM a 4:00 PM.",
    urgent: false,
  },
  {
    title: "Campaña de ahorro de agua",
    date: "01 Feb 2026",
    desc: "Únete a nuestra campaña comunitaria de ahorro y uso responsable del agua.",
    urgent: false,
  },
];

const missionCards = [
  {
    title: "Calidad",
    text: "Agua potable certificada",
    icon: <FaTint />,
  },
  {
    title: "Mantenimiento",
    text: "Infraestructura moderna",
    icon: <FaWrench />,
  },
  {
    title: "Sostenibilidad",
    text: "Gestión responsable",
    icon: <FaLeaf />,
  },
  {
    title: "Atención",
    text: "Servicio al cliente",
    icon: <FaPhoneAlt />,
  },
];

export default function Home() {
  return (
    <main className="bg-white text-slate-900 overflow-x-hidden">
      <section
        className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[620px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative mx-auto flex min-h-[420px] sm:min-h-[500px] lg:min-h-[620px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white py-16 sm:py-20 lg:py-24">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Agua Potable para Nuestra Comunidad
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-100 sm:mt-6 sm:text-base sm:leading-7 md:text-lg lg:text-xl">
              Gestión responsable y sostenible del recurso hídrico al servicio de todos.
            </p>

            <div className="mt-6 sm:mt-8">
              <button className="btn btn-primary btn-sm sm:btn-md lg:btn-lg px-6 sm:px-8">
                Conocer más
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-4 sm:-mt-10 sm:px-6 lg:-mt-14 lg:px-8 xl:-mt-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 lg:gap-6">
            {quickAccess.map((item) => (
              <div
                key={item.title}
                className="card border border-slate-100 bg-white shadow-lg transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="card-body p-5 sm:p-6">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg text-white sm:h-14 sm:w-14 sm:text-xl ${item.bg}`}
                  >
                    {item.icon}
                  </div>

                  <h3 className="mt-3 text-lg font-semibold sm:mt-4 sm:text-xl">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-500 sm:text-base">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Avisos Destacados
            </h2>

            <a className="cursor-pointer text-sm font-semibold text-primary sm:text-base">
              Ver todos →
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {notices.map((notice) => (
              <div
                key={notice.title}
                className="card border border-slate-100 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
              >
                <div className="card-body p-5 sm:p-6">
                  {notice.urgent && (
                    <div className="badge badge-error badge-soft w-fit">
                      Urgente
                    </div>
                  )}

                  <h3 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">
                    {notice.title}
                  </h3>

                  <p className="text-sm text-slate-500">{notice.date}</p>

                  <p className="text-sm leading-6 text-slate-600 sm:text-base">
                    {notice.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              Nuestra Misión
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:mt-6 sm:text-base lg:text-lg">
                Brindar un servicio de agua potable seguro, continuo y de alta calidad a los abonados de 
                Cedral y Dulce Nombre, mediante una gestión responsable, eficiente y orientada al bienestar 
                de la comunidad y la protección de los recursos hídricos.
            </p>

            <a className="mt-5 cursor-pointer text-sm font-semibold text-primary sm:mt-6 sm:text-base">
              Conocer más sobre nosotros →
            </a>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {missionCards.map((card) => (
              <div
                key={card.title}
                className="card bg-white shadow-md transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="card-body p-5 sm:p-6">
                  <div className="text-2xl text-primary sm:text-3xl">
                    {card.icon}
                  </div>

                  <h3 className="card-title text-lg sm:text-xl">
                    {card.title}
                  </h3>

                  <p className="text-sm text-slate-500 sm:text-base">
                    {card.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl bg-primary px-5 py-12 text-center text-white shadow-lg sm:rounded-3xl sm:px-8 sm:py-14 lg:px-10 lg:py-20">
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
              ¿Necesitas ayuda?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base lg:text-lg">
              Nuestro equipo está disponible para atenderte y orientarte con
              cualquier consulta relacionada con nuestros servicios.
            </p>

            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
              <button className="btn border-none bg-white text-primary hover:bg-slate-100">
                Contactar
              </button>

              <button className="btn btn-info border-none text-white">
                Ver trámites
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}