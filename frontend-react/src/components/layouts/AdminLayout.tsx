import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Navigate, Outlet, NavLink } from "react-router-dom";
import {
  HiFilm,
  HiHome,
  HiLogout,
  HiUser,
  HiCog,
  HiUserGroup,
  HiTag,
} from "react-icons/hi";

export default function AdminLayout() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const isAdmin = user?.role === "admin";
  const isEditor = user?.role === "editor";
  const canManageContent = isAdmin || isEditor;

  const menuItems = [
    { to: "/", icon: HiHome, label: "Ana Sayfa" },
    { to: "/movies", icon: HiFilm, label: "Filmler" },
    { to: "/series", icon: HiFilm, label: "Diziler" },
  ];

  // Editor için içerik yönetimi (silme hariç)
  const editorMenuItems = [
    ...menuItems,
    { to: "/admin/movies", icon: HiCog, label: "Film Yönetimi" },
    { to: "/admin/series", icon: HiCog, label: "Dizi Yönetimi" },
    { to: "/admin/genres", icon: HiTag, label: "Tür Yönetimi" },
  ];

  // Admin için tüm yönetim (kullanıcı yönetimi dahil)
  const adminMenuItems = [
    ...editorMenuItems,
    { to: "/admin/users", icon: HiUserGroup, label: "Kullanıcı Yönetimi" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between">
        {/* Logo - Sol */}
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center gap-2">
            <HiFilm className="text-2xl text-purple-600" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              SineDeck
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-2 flex-1">
            <div className="flex items-center gap-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <item.icon className="text-lg" />
                  {item.label}
                </NavLink>
              ))}
            </div>
            {canManageContent && (
              <div className="ml-auto flex items-center gap-1">
                {(isAdmin ? adminMenuItems : editorMenuItems)
                  .slice(menuItems.length)
                  .map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`
                      }
                    >
                      <item.icon className="text-lg" />
                      {item.label}
                    </NavLink>
                  ))}
              </div>
            )}
          </nav>
        </div>

        {/* User Info - Sağ */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.username}
            </p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <HiUser className="text-purple-600 dark:text-purple-400" />
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Çıkış Yap"
          >
            <HiLogout className="text-lg" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <nav className="flex justify-around">
          {(isAdmin
            ? adminMenuItems
            : isEditor
            ? editorMenuItems
            : menuItems
          ).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1 rounded-lg text-xs transition-colors ${
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400"
                }`
              }
            >
              <item.icon className="text-xl" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="pt-14 pb-16 sm:pb-0 min-h-screen">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
