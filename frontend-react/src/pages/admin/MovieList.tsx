import { useContext, useEffect, useState } from "react";
import type { Movie } from "../../types/Movie";
import { toast } from "react-toastify";
import api from "../../helper/api";
import { Link } from "react-router-dom";
import { AuthContext } from "../../components/auth/AuthContext";
import { HiFilm, HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import { LoadingSpinner, PageHeader, EmptyState } from "../../components/ui";

function MovieList() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchMovies = async () => {
    try {
      const response = await api.get("/movies");
      setMovies(response.data);
    } catch (error) {
      toast.error("Filmler yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bu filmi kalıcı olarak silmek istediğine emin misin?"))
      return;
    try {
      await api.delete(`/movies/${id}`);
      toast.success("Film silindi.");
      setMovies(movies.filter((m) => m.id !== id));
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };
  if (loading) {
    return <LoadingSpinner message="Filmler yükleniyor..." />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Film Yönetimi"
        subtitle={`${movies.length} film kayıtlı`}
        icon={HiFilm}
        action={
          <Link to="/admin/add-movie">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
              <HiPlus /> Yeni Film Ekle
            </button>
          </Link>
        }
      />
      {movies.length === 0 ? (
        <EmptyState
          icon={HiFilm}
          title="Henüz film eklenmemiş"
          subtitle="Yeni film eklemek için yukarıdaki butonu kullanın."
        />
      ) : (
        <div className="space-y-3">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded shadow-sm border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150?text=Afiş+Yok";
                      }}
                    />
                  ) : (
                    <div className="w-10 h-14 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <HiFilm className="text-purple-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {movie.releaseYear} • {movie.director}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/admin/edit-movie/${movie.id}`}>
                    <button className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-colors">
                      <HiPencil className="text-lg" />
                    </button>
                  </Link>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <HiTrash className="text-lg" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default MovieList;