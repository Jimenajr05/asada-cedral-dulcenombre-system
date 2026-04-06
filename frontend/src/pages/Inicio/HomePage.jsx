import { useNavigate } from "react-router-dom";
import { quickAccess, notices, missionCards } from "./HomeData";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="overflow-x-hidden bg-white text-slate-900">

      {/* HERO */}
      <section className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[620px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto flex min-h-[420px] sm:min-h-[500px] lg:min-h-[620px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white py-16 sm:py-20 lg:py-24">
            
            <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Agua Potable para Nuestra Comunidad
            </h1>

            <p className="mt-4 text-slate-100 sm:text-base lg:text-xl">
              Gestión responsable y sostenible del recurso hídrico al servicio de todos.
            </p>

            <button
              onClick={() => navigate("/sobre-nosotros")}
              className="btn btn-primary mt-6"
            >
              Conocer más
            </button>

          </div>
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="relative z-10 -mt-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickAccess.map((item) => (
            <div
              key={item.title}
              onClick={() => navigate(item.path)}
              className="card cursor-pointer bg-white shadow-lg hover:-translate-y-1 transition"
            >
              <div className="card-body">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${item.bg}`}>
                  {item.icon}
                </div>

                <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
                <p className="text-slate-500">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AVISOS */}
      <section className="px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between mb-10">
            <h2 className="text-3xl font-bold">Avisos Destacados</h2>

            <span
              onClick={() => navigate("/avisos")}
              className="cursor-pointer text-primary font-semibold"
            >
              Ver todos →
            </span>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <div key={notice.title} className="card bg-white shadow-md">
                <div className="card-body">
                  {notice.urgent && <div className="badge badge-error">Urgente</div>}
                  <h3 className="text-xl font-semibold">{notice.title}</h3>
                  <p className="text-sm text-slate-500">{notice.date}</p>
                  <p className="text-slate-600">{notice.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISIÓN */}
      <section className="bg-slate-100 px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12">

          <div>
            <h2 className="text-3xl font-bold">Nuestra Misión</h2>

            <p className="mt-6 text-slate-600">
              Brindar un servicio de agua potable seguro, continuo y de alta calidad a la comunidad.
            </p>

            <span
              onClick={() => navigate("/sobre-nosotros")}
              className="mt-6 inline-block cursor-pointer text-primary"
            >
              Conocer más →
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {missionCards.map((card) => (
              <div key={card.title} className="card bg-white shadow-md">
                <div className="card-body">
                  <div className="text-primary text-3xl">{card.icon}</div>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="text-slate-500">{card.text}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}