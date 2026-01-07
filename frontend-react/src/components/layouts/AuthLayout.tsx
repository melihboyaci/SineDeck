import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { HiFilm } from "react-icons/hi";

const AuthLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <HiFilm className="text-4xl text-white" />
          <span className="text-3xl font-bold text-white">SineDeck</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
