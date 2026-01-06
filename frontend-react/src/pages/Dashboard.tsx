import { useEffect, useState } from "react";
import type { Movie } from "../types/Movie";
import api from "../helper/api";
import { toast } from "react-toastify";
import { Spinner } from "flowbite-react";
import MovieCard from "../components/movies/MovieCard";
import { HiFilm, HiPlus } from "react-icons/hi";

function Dashboard() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Hata", error);
        toast.error("Filmler yüklenirken bir hata oluştu!");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 gap-4">
        <Spinner size="xl" color="purple" />
        <p className="text-gray-500 animate-pulse">Filmler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Başlık ve İstatistikler */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <HiFilm className="text-4xl" />
              Film Koleksiyonu
            </h1>
            <p className="text-purple-100 mt-1">
              Tüm filmleri buradan görüntüleyebilir ve yönetebilirsiniz.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 text-center">
              <p className="text-2xl font-bold">{movies.length}</p>
              <p className="text-sm text-purple-100">Toplam Film</p>
            </div>
          </div>
        </div>
      </div>

      {/* Film Listesi */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <HiFilm className="text-6xl text-gray-400 mb-4" />
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-300">
            Henüz film eklenmemiş
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Koleksiyonunuza ilk filminizi ekleyin!
          </p>
          <button className="mt-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            <HiPlus /> Film Ekle
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
