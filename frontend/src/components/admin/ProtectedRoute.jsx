import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getProfile } from "../../services/authService";

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading"); // loading | ok | unauthorized

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      try {
        const data = await getProfile();
        if (!cancelled) {
          // Sincronizar datos del usuario en localStorage para la UI
          localStorage.setItem("user", JSON.stringify(data.user));
          setStatus(data.user?.role === "admin" ? "ok" : "unauthorized");
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem("user");
          setStatus("unauthorized");
        }
      }
    };

    verify();
    return () => { cancelled = true; };
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          <p className="text-sm text-slate-500 font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

export default ProtectedRoute;