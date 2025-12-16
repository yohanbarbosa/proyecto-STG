import { Link } from "react-router-dom";

 function Error404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 px-4 text-center">
      <h1 className="text-7xl font-extrabold mb-4">404</h1>

      <h2 className="text-2xl font-semibold mb-2">
        Página no encontrada
      </h2>

      <p className="max-w-md text-slate-400 mb-6">
        Lo sentimos, la página que estás buscando no existe o fue movida.
      </p>

      <Link
        to="/dashboard"
        className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
export default Error404;