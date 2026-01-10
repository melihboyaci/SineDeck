import { HiX, HiFilm, HiPlay, HiTrash } from "react-icons/hi";
import type { Collection } from "../../types/Collection";
import type { Movie } from "../../types/Movie";
import type { Series } from "../../types/Series";
import api from "../../helper/api";
import { toast } from "react-toastify";
interface Props {
  collection: Collection | null;
  isOpen: boolean;
  onClose: () => void;
  onMovieClick?: (movie: Movie) => void;
  onSeriesClick?: (series: Series) => void;
  onItemRemoved?: () => void;
}
export default function CollectionDetailModal({
  collection,
  isOpen,
  onClose,
  onMovieClick,
  onSeriesClick,
  onItemRemoved,
}: Props) {
  if (!isOpen || !collection) return null;
  const handleRemoveMovie = async (movieId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bu filmi koleksiyondan çıkarmak istediğinize emin misiniz?"))
      return;
    try {
      await api.delete(`/collections/${collection.id}/items`, {
        data: { movieIds: [movieId] },
      });
      toast.success("Film koleksiyondan çıkarıldı!");
      onItemRemoved?.();
    } catch (error) {
      console.error("Film çıkarılamadı", error);
      toast.error("Film çıkarılırken hata oluştu!");
    }
  };
  const handleRemoveSeries = async (seriesId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Bu diziyi koleksiyondan çıkarmak istediğinize emin misiniz?"))
      return;
    try {
      await api.delete(`/collections/${collection.id}/items`, {
        data: { seriesIds: [seriesId] },
      });
      toast.success("Dizi koleksiyondan çıkarıldı!");
      onItemRemoved?.();
    } catch (error) {
      console.error("Dizi çıkarılamadı", error);
      toast.error("Dizi çıkarılırken hata oluştu!");
    }
  };
  const totalItems =
    (collection.movies?.length || 0) + (collection.series?.length || 0);
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {collection.name}
            </h2>
            {collection.description && (
              <p className="text-sm text-gray-500 mt-1">
                {collection.description}
              </p>
            )}
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <HiFilm className="text-purple-500" />
                {collection.movies?.length || 0} Film
              </span>
              <span className="flex items-center gap-1">
                <HiPlay className="text-indigo-500" />
                {collection.series?.length || 0} Dizi
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <HiX className="text-xl" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {totalItems > 0 ? (
            <div className="space-y-6">
              {collection.movies && collection.movies.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <HiFilm className="text-purple-500" /> Filmler
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {collection.movies.map((movie) => (
                      <div
                        key={movie.id}
                        className="group cursor-pointer relative"
                      >
                        <div
                          className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
                          onClick={() => onMovieClick?.(movie)}
                        >
                          {movie.posterUrl ? (
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <HiFilm className="text-2xl text-gray-400" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleRemoveMovie(movie.id, e)}
                          className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          title="Koleksiyondan çıkar"
                        >
                          <HiTrash className="text-sm" />
                        </button>
                        <p className="text-xs font-medium mt-1.5 truncate text-gray-700 dark:text-gray-300">
                          {movie.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {collection.series && collection.series.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <HiPlay className="text-indigo-500" /> Diziler
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {collection.series.map((series) => (
                      <div
                        key={series.id}
                        className="group cursor-pointer relative"
                      >
                        <div
                          className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700"
                          onClick={() => onSeriesClick?.(series)}
                        >
                          {series.posterUrl ? (
                            <img
                              src={series.posterUrl}
                              alt={series.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <HiPlay className="text-2xl text-gray-400" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleRemoveSeries(series.id, e)}
                          className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          title="Koleksiyondan çıkar"
                        >
                          <HiTrash className="text-sm" />
                        </button>
                        <p className="text-xs font-medium mt-1.5 truncate text-gray-700 dark:text-gray-300">
                          {series.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <HiFilm className="text-5xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Bu koleksiyon henüz boş</p>
              <p className="text-gray-400 text-sm mt-1">
                Film veya dizi detay sayfasından bu koleksiyona içerik
                ekleyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}