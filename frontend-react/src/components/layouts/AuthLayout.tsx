import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { HiFilm } from "react-icons/hi";

const AuthLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex">
      {/* Sol Panel - Dekoratif */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-white">
            <HiFilm className="text-4xl" />
            <span className="text-3xl font-bold">SineDeck</span>
          </div>
        </div>

        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">
            Film Koleksiyonunuzu Yönetin
          </h1>
          <p className="text-purple-100 text-lg">
            Tüm filmlerinizi tek bir yerden organize edin, kategorize edin ve
            takip edin.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="w-12 h-1 bg-white rounded-full" />
          <div className="w-12 h-1 bg-white/40 rounded-full" />
          <div className="w-12 h-1 bg-white/40 rounded-full" />
        </div>
      </div>

      {/* Sağ Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <HiFilm className="text-3xl text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              SineDeck
            </span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
