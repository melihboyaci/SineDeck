import { createContext } from "react";
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
export const AuhthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});
