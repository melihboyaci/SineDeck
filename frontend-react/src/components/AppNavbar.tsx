import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import { Button } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";

const AppNavbar = () => {
  const { logout, user } = useContext(AuthContext);
  const path = useLocation().pathname;

  // Debug: Konsola user bilgisini yazdır
  console.log("Navbar User:", user);
  console.log("User Role:", user?.role);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <nav className="bg-white shadow-md mb-6 px-4 py-3 rounded-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="self-center whitespace-nowrap text-xl font-semibold text-blue-600">
            SineDeck
          </span>
        </Link>

        <div className="flex md:order-2 gap-2 items-center">
          {/* Kullanıcı adını göstermek şık olur */}
          {user && (
            <span className="self-center text-sm font-medium text-gray-600 hidden md:block">
              {user.username} ({user.role})
            </span>
          )}
          <Button color="failure" size="xs" onClick={logout}>
            Çıkış Yap
          </Button>
        </div>

        <div className="w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0 font-medium">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded ${
                  path === "/"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Ana Sayfa
              </Link>
            </li>

            {/* GİZLİ GEÇİT: Sadece Admin ise bu linki göster */}
            {isAdmin && (
              <li>
                <Link
                  to="/admin/movies"
                  className={`block py-2 px-3 rounded ${
                    path.startsWith("/admin")
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  Yönetim Paneli
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
