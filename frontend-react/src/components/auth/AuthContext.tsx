import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../../types/User";

/**
 * 1. AuthContextType: Context içinde hangi verilerin ve fonksiyonların
 * bulunacağını belirleyen bir arayüz (interface) tanımlıyoruz.
 */
interface AuthContextType {
  user: User | null; // Kullanıcı verisi (giriş yapılmadıysa null)
  isAuthenticated: boolean; // Oturum durumu (true/false)
  login: (token: string, username: string, role: string) => void; // Giriş yapma fonksiyonu
  logout: () => void; // Çıkış yapma fonksiyonu
}

/**
 * 2. createContext: Uygulama genelinde paylaşılacak olan kimlik doğrulama
 * bağlamını (context) oluşturuyoruz.
 *
 * 3. Varsayılan Değerler: Context henüz bir Provider ile sarmalanmadığında
 * kullanılacak başlangıç değerlerini veriyoruz.
 */
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (token && username) {
      setUser({ username, role: role || "user" });
    }
  }, []);

  const login = (token: string, username: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    setUser({ username, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
