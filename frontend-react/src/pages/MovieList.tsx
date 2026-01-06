import { useEffect, useState } from "react";
import type { Movie } from "../types/Movie";
import { toast } from "react-toastify";
import api from "../helper/api";
import { Table, Button, Spinner } from "flowbite-react";
import { Link } from "react-router-dom";

function MovieList() {
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

  if (loading)
    return (
      <div className="text-center mt-10">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Film Yönetimi
        </h2>
        <Link to="/admin/add-movie">
          <Button color="purple">+ Yeni Film Ekle</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Film Adı</th>
              <th className="px-6 py-3">Yıl</th>
              <th className="px-6 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {movies.map((movie) => (
              <tr
                key={movie.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4">{movie.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {movie.title}
                </td>
                <td className="px-6 py-4">{movie.releaseYear}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {/* Düzenleme Sayfasına Git */}
                    <Link to={`/admin/edit-movie/${movie.id}`}>
                      <Button size="xs" color="light">
                        Düzenle
                      </Button>
                    </Link>

                    {/* Silme Butonu */}
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => handleDelete(movie.id)}
                    >
                      Sil
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MovieList;
