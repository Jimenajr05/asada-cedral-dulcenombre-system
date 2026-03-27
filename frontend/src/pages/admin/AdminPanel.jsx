import {
  Bell,
  Users,
  AlertCircle,
  Droplets,
  TrendingUp,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  Pencil,
} from "lucide-react";

function AdminPanel() {
  const stats = [
    {
      title: "Avisos Activos",
      value: "12",
      description: "+2 esta semana",
      icon: Bell,
      boxColor: "bg-blue-500",
    },
    {
      title: "Abonados",
      value: "524",
      description: "+8 este mes",
      icon: Users,
      boxColor: "bg-green-500",
    },
    {
      title: "Avisos Urgentes",
      value: "3",
      description: "Requieren atención",
      icon: AlertCircle,
      boxColor: "bg-red-500",
    },
    {
      title: "Consumo Promedio",
      value: "18m³",
      description: "-5% vs mes anterior",
      icon: Droplets,
      boxColor: "bg-blue-600",
    },
  ];

  const recentActivity = [
    {
      title: "Nuevo aviso publicado",
      description: "Corte de agua programado",
      time: "Hace 2 horas",
      icon: Bell,
      iconColor: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Foto actualizada",
      description: "Banner principal cambiado",
      time: "Hace 5 horas",
      icon: ImageIcon,
      iconColor: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Contenido editado",
      description: "Sección Misión y Visión",
      time: "Hace 1 día",
      icon: FileText,
      iconColor: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Aviso archivado",
      description: "Mantenimiento completado",
      time: "Hace 2 días",
      icon: Bell,
      iconColor: "text-blue-600",
      bg: "bg-blue-100",
    },
  ];

  const pendingTasks = [
    {
      title: "Revisar solicitudes de nuevo abonado",
      count: 3,
      style: "bg-red-50 border-l-[4px] border-red-500",
      badge: "bg-red-100 text-red-500",
    },
    {
      title: "Actualizar avisos caducados",
      count: 2,
      style: "bg-yellow-50 border-l-[4px] border-yellow-500",
      badge: "bg-yellow-100 text-yellow-600",
    },
    {
      title: "Responder consultas por email",
      count: 5,
      style: "bg-blue-50 border-l-[4px] border-blue-500",
      badge: "bg-blue-100 text-blue-500",
    },
  ];

  const quickActions = [
    {
      title: "Crear Aviso",
      icon: Bell,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Subir Foto",
      icon: ImageIcon,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Editar Contenido",
      icon: Pencil,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Ver Abonados",
      icon: Users,
      bg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];

  const bottomCards = [
    {
      title: "Sistema Operativo",
      description: "Todos los servicios funcionando",
      icon: CheckCircle2,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Calidad del Agua",
      description: "Parámetros normales",
      icon: Droplets,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Usuarios Activos",
      description: "524 abonados",
      icon: Users,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="p-7">
      <div className="mb-8">
        <h2 className="text-[3rem] font-bold text-slate-900 leading-tight">
          Panel de Control
        </h2>
        <p className="text-slate-600 mt-2 text-[1.35rem]">
          Resumen general del sistema ASADA
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl ${item.boxColor} flex items-center justify-center`}
                >
                  <Icon className="w-7 h-7 text-white" strokeWidth={2.2} />
                </div>

                <TrendingUp
                  className="w-5 h-5 text-green-500"
                  strokeWidth={2.4}
                />
              </div>

              <h3 className="text-slate-600 text-lg">{item.title}</h3>
              <p className="text-[2.5rem] font-bold text-slate-900 mt-2 leading-none">
                {item.value}
              </p>
              <p className="text-sm text-slate-500 mt-3">{item.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 mb-8">
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-[2rem] font-bold text-slate-900 mb-6">
            Actividad Reciente
          </h3>

          <div className="space-y-0">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div key={index}>
                  <div className="flex items-start gap-4 py-5">
                    <div
                      className={`w-12 h-12 rounded-full ${activity.bg} flex items-center justify-center shrink-0`}
                    >
                      <Icon
                        className={`w-5 h-5 ${activity.iconColor}`}
                        strokeWidth={2.2}
                      />
                    </div>

                    <div>
                      <h4 className="text-[1.05rem] font-semibold text-slate-900">
                        {activity.title}
                      </h4>
                      <p className="text-slate-600 text-base">
                        {activity.description}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>

                  {index !== recentActivity.length - 1 && (
                    <div className="border-b border-slate-200" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-[2rem] font-bold text-slate-900 mb-6">
            Tareas Pendientes
          </h3>

          <div className="space-y-4">
            {pendingTasks.map((task, index) => (
              <div
                key={index}
                className={`rounded-2xl px-4 py-4 flex items-center justify-between ${task.style}`}
              >
                <span className="text-[1rem] font-medium text-slate-900">
                  {task.title}
                </span>

                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${task.badge}`}
                >
                  {task.count}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <h3 className="text-[2rem] font-bold text-slate-900 mb-6">
          Acciones Rápidas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                className={`${action.bg} rounded-2xl px-5 py-5 flex items-center gap-3 text-left hover:opacity-90 transition`}
              >
                <Icon
                  className={`w-5 h-5 ${action.iconColor}`}
                  strokeWidth={2.2}
                />
                <span className="text-[1.05rem] font-medium text-slate-900">
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bottomCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center shrink-0`}
              >
                <Icon
                  className={`w-5 h-5 ${card.iconColor}`}
                  strokeWidth={2.2}
                />
              </div>

              <div>
                <h4 className="text-[1.05rem] font-semibold text-slate-900">
                  {card.title}
                </h4>
                <p className="text-slate-600 text-base">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminPanel;