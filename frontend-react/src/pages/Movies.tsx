import { useEffect, useState } from "react";
import type { Movie } from "../types/Movie";
import api from "../helper/api";
import { HiFilm } from "react-icons/hi";
import MediaCard from "../components/media/MediaCard";
import MediaDetailModal from "../components/media/MediaDetailModal";
import { LoadingSpinner, EmptyState } from "../components/ui";
function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchMovieDetail = async (id: number) => {
    try {
      const response = await api.get(`/movies/${id}`);
      setSelectedMovie(response.data);
    } catch (error) {
      console.error("Film detayı yüklenemedi", error);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await api.get("/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Filmler yüklenemedi", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);
  if (loading) {
    return <LoadingSpinner message="Filmler yükleniyor..." />;
  }
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <HiFilm className="text-3xl text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Filmler
          </h1>
        </div>
        <p className="text-gray-500">{movies.length} film bulundu</p>
      </div>
      {movies.length === 0 ? (
        <EmptyState
          icon={HiFilm}
          title="Henüz film eklenmemiş"
          subtitle="Yönetim panelinden yeni filmler ekleyebilirsiniz."
          dashed={false}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MediaCard
              key={movie.id}
              item={movie}
              type="movie"
              onClick={() => fetchMovieDetail(movie.id)}
            />
          ))}
        </div>
      )}
      <MediaDetailModal
        item={selectedMovie}
        type="movie"
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onCollectionUpdated={fetchMovies}
      />
    </div>
  );
}
export default Movies;
