import axios from "axios";

// Axios instance oluşturuluyor. Tüm API istekleri bu temel URL üzerinden gidecek.
const api = axios.create({
  baseURL: "http://localhost:3000",
});

// İstek gönderilmeden hemen önce çalışan "interceptor" (araya girici).
api.interceptors.request.use(
  (config) => {
    // Tarayıcı hafızasından (localStorage) giriş token'ını alıyoruz.
    const token = localStorage.getItem("token");

    // Eğer token varsa, isteğin başlığına (header) "Authorization" olarak ekliyoruz.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // İstek sırasında bir hata oluşursa hatayı geri döndürüyoruz.
    return Promise.reject(error);
  }
);

export default api;
