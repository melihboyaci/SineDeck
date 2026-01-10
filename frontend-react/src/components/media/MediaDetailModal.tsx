import { useState, useEffect } from "react";
import type { Movie } from "../../types/Movie";
import type { Series } from "../../types/Series";
import type { Season } from "../../types/Season";
import type { Collection } from "../../types/Collection";
import api from "../../helper/api";
import { toast } from "react-toastify";
import {
  HiX,
  HiFilm,
  HiPlay,
  HiClock,
  HiCalendar,
  HiUser,
  HiPlusCircle,
  HiCheck,
} from "react-icons/hi";

type MediaDetailModalProps = {
  item: Movie | Series | null;
  type: "movie" | "series";
  isOpen: boolean;
  onClose: () => void;
  onCollectionUpdated?: () => void;
};

function MediaDetailModal({
  item,
  type,
  isOpen,
  onClose,
  onCollectionUpdated,
}: MediaDetailModalProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCollectionSelector, setShowCollectionSelector] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowCollectionSelector(false);
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    if (collections.length > 0) return;
    setLoadingCollections(true);

    try {
      const response = await api.get("/collections");
      setCollections(response.data);
    } catch (error) {
      console.error("Koleksiyonlar yüklenemedi", error);
    } finally {
      setLoadingCollections(false);
    }
  };

  const handleAddToCollection = async (collectionId: number) => {
    if (!item) return;

    try {
      await api.post(`/collections/${collectionId}/items`, {
        ...(type === "movie"
          ? { movieIds: [item.id] }
          : { seriesIds: [item.id] }),
      });
      toast.success("Koleksiyona eklendi!");
      setShowCollectionSelector(false);
      onCollectionUpdated?.();
    } catch (error) {
      toast.error("Ekleme başarısız!");
    }
  };

  const toggleCollectionSelector = () => {
    if (!showCollectionSelector) {
      fetchCollections();
    }
    setShowCollectionSelector(!showCollectionSelector);
  };

  if (!isOpen || !item) return null;

  const isMovie = type === "movie";
  const movie = isMovie ? (item as Movie) : null;
  const series = !isMovie ? (item as Series) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 md:h-80 bg-gray-800">
          {item.posterUrl ? (
            <>
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-gray-900">
              <HiFilm className="text-8xl text-purple-400/30" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
          >
            <HiX className="text-xl" />
          </button>
          <div className="absolute top-4 left-4 z-10">
            <div className="relative">
              <button
                onClick={toggleCollectionSelector}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors backdrop-blur-md"
              >
                <HiPlusCircle className="text-xl" />
                <span className="text-sm font-medium">Koleksiyona Ekle</span>
              </button>
              {showCollectionSelector && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animation-fade-in">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      Koleksiyon Seç
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {loadingCollections ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Yükleniyor...
                      </div>
                    ) : collections.length > 0 ? (
                      <div className="py-2">
                        {collections.map((collection) => (
                          <button
                            key={collection.id}
                            onClick={() => handleAddToCollection(collection.id)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center justify-between group"
                          >
                            <span className="truncate">{collection.name}</span>
                            <HiPlusCircle className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Henüz koleksiyonunuz yok.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end gap-6">
              {item.posterUrl && (
                <div className="hidden md:block w-32 h-48 rounded-lg overflow-hidden shadow-xl border-2 border-white/20 flex-shrink-0">
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {item.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
                  {isMovie && movie && (
                    <>
                      <span className="flex items-center gap-1">
                        <HiCalendar /> {movie.releaseYear}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiUser /> {movie.director}
                      </span>
                    </>
                  )}
                  {!isMovie && series && (
                    <>
                      <span className="flex items-center gap-1">
                        <HiCalendar />
                        {series.startYear} - {series.endYear || "Devam Ediyor"}
                      </span>
                      {series.creator && (
                        <span className="flex items-center gap-1">
                          <HiUser /> {series.creator}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {item.genres && item.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-purple-600/80 text-white text-xs font-medium rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-20rem)]">
          {item.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Özet
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {!isMovie &&
            series &&
            (series as Series & { seasons?: Season[] }).seasons && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Sezonlar & Bölümler
                </h2>
                <div className="space-y-3">
                  {((series as Series & { seasons?: Season[] }).seasons || [])
                    .sort(
                      (a: Season, b: Season) => a.seasonNumber - b.seasonNumber
                    )
                    .map((season: Season) => (
                      <details
                        key={season.id}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden group"
                      >
                        <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                              Sezon {season.seasonNumber}
                            </span>
                            {season.description && (
                              <span className="text-sm text-gray-500 hidden sm:inline">
                                {season.description}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {season.episodes?.length || 0} bölüm
                          </span>
                        </summary>

                        {season.episodes && season.episodes.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                            {season.episodes
                              .sort((a, b) => a.episodeNumber - b.episodeNumber)
                              .map((episode) => (
                                <div
                                  key={episode.id}
                                  className="flex items-center gap-4 p-4 pl-8 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                                    <HiPlay className="text-green-600 dark:text-green-400 text-sm" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-medium text-gray-500">
                                        E
                                        {String(episode.episodeNumber).padStart(
                                          2,
                                          "0"
                                        )}
                                      </span>
                                      <span className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                        {episode.title}
                                      </span>
                                    </div>
                                    {episode.description && (
                                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                                        {episode.description}
                                      </p>
                                    )}
                                  </div>
                                  <span className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                                    <HiClock /> {episode.duration} dk
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </details>
                    ))}
                </div>
              </div>
            )}

          {!item.description &&
            (isMovie ||
              !(series as Series & { seasons?: Season[] }).seasons?.length) && (
              <div className="text-center py-8 text-gray-500">
                <HiFilm className="text-4xl mx-auto mb-2 opacity-50" />
                <p>Henüz detay bilgisi eklenmemiş.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
export default MediaDetailModal;
