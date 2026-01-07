import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Movie } from "../types/Movie";
import type { Series } from "../types/Series";
import type { Collection } from "../types/Collection";
import api from "../helper/api";
import MediaDetailModal from "../components/media/MediaDetailModal";
import CollectionDetailModal from "../components/collections/CollectionDetailModal";
import {
  HiFilm,
  HiPlay,
  HiCollection,
  HiPlus,
  HiChevronRight,
  HiPencil,
  HiTrash,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../components/ui";

function Dashboard() {
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [recentSeries, setRecentSeries] = useState<Series[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail modal states
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  // Collection modal states
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null
  );
  const [collectionForm, setCollectionForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moviesRes, seriesRes, collectionsRes] = await Promise.all([
        api.get("/movies"),
        api.get("/series"),
        api.get("/collections"),
      ]);

      // Son 6 film ve dizi
      setRecentMovies(moviesRes.data.slice(0, 6));
      setRecentSeries(seriesRes.data.slice(0, 6));
      setCollections(collectionsRes.data);
    } catch (error) {
      console.error("Veri yüklenemedi", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetail = async (id: number) => {
    try {
      const response = await api.get(`/movies/${id}`);
      setSelectedMovie(response.data);
    } catch (error) {
      console.error("Film detayı yüklenemedi", error);
    }
  };

  const fetchSeriesDetail = async (id: number) => {
    try {
      const response = await api.get(`/series/${id}`);
      setSelectedSeries(response.data);
    } catch (error) {
      console.error("Dizi detayı yüklenemedi", error);
    }
  };
  const fetchCollectionDetail = async (id: number) => {
    try {
      const response = await api.get(`/collections/${id}`);
      setSelectedCollection(response.data);
    } catch (error) {
      console.error("Koleksiyon detayı yüklenemedi", error);
      toast.error("Koleksiyon detayları yüklenemedi!");
    }
  };
  const handleCreateCollection = async () => {
    if (!collectionForm.name.trim()) {
      toast.error("Koleksiyon adı gerekli!");
      return;
    }

    try {
      if (editingCollection) {
        await api.patch(`/collections/${editingCollection.id}`, collectionForm);
        toast.success("Koleksiyon güncellendi!");
      } else {
        await api.post("/collections", collectionForm);
        toast.success("Koleksiyon oluşturuldu!");
      }
      setShowCollectionModal(false);
      setEditingCollection(null);
      setCollectionForm({ name: "", description: "" });
      fetchData();
    } catch (error) {
      toast.error("İşlem başarısız!");
    }
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm("Bu koleksiyonu silmek istediğinize emin misiniz?")) return;

    try {
      await api.delete(`/collections/${id}`);
      toast.success("Koleksiyon silindi!");
      fetchData();
    } catch (error) {
      toast.error("Silme başarısız!");
    }
  };

  const openEditModal = (collection: Collection) => {
    setEditingCollection(collection);
    setCollectionForm({
      name: collection.name,
      description: collection.description || "",
    });
    setShowCollectionModal(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Son Eklenenler - Yan yana, minimal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Eklenen Filmler */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HiFilm className="text-lg text-purple-600" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Son Eklenen Filmler
              </h2>
            </div>
            <Link
              to="/movies"
              className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-0.5"
            >
              Tümü <HiChevronRight className="text-sm" />
            </Link>
          </div>

          {recentMovies.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {recentMovies.slice(0, 5).map((movie) => (
                <div
                  key={movie.id}
                  className="group cursor-pointer"
                  onClick={() => fetchMovieDetail(movie.id)}
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiFilm className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-medium mt-1 truncate text-gray-600 dark:text-gray-400">
                    {movie.title}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-400 text-sm">
              Henüz film yok
            </p>
          )}
        </section>

        {/* Son Eklenen Diziler */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HiPlay className="text-lg text-indigo-600" />
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Son Eklenen Diziler
              </h2>
            </div>
            <Link
              to="/series"
              className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
              Tümü <HiChevronRight className="text-sm" />
            </Link>
          </div>

          {recentSeries.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {recentSeries.slice(0, 5).map((series) => (
                <div
                  key={series.id}
                  className="group cursor-pointer"
                  onClick={() => fetchSeriesDetail(series.id)}
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {series.posterUrl ? (
                      <img
                        src={series.posterUrl}
                        alt={series.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiPlay className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-medium mt-1 truncate text-gray-600 dark:text-gray-400">
                    {series.title}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-400 text-sm">
              Henüz dizi yok
            </p>
          )}
        </section>
      </div>

      {/* Koleksiyonlarım */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
              <HiCollection className="text-xl text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Koleksiyonlarım
            </h2>
          </div>
          <button
            onClick={() => {
              setEditingCollection(null);
              setCollectionForm({ name: "", description: "" });
              setShowCollectionModal(true);
            }}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <HiPlus /> Yeni Koleksiyon
          </button>
        </div>

        {collections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <div
                key={collection.id}
                onClick={() => fetchCollectionDetail(collection.id)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-lg group-hover:text-emerald-600 transition-colors">
                      {collection.name}
                    </h3>
                    {collection.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {collection.description}
                      </p>
                    )}
                  </div>
                  <div
                    className="flex gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => openEditModal(collection)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                    >
                      <HiPencil />
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(collection.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <HiTrash />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <HiFilm className="text-purple-500" />
                    {collection.movies?.length || 0} Film
                  </span>
                  <span className="flex items-center gap-1">
                    <HiPlay className="text-indigo-500" />
                    {collection.series?.length || 0} Dizi
                  </span>
                </div>

                {/* Mini poster grid */}
                {collection.movies?.length > 0 ||
                collection.series?.length > 0 ? (
                  <div className="flex gap-2">
                    {[
                      ...(collection.movies || []).slice(0, 3),
                      ...(collection.series || []).slice(0, 3),
                    ]
                      .slice(0, 4)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="w-10 h-14 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700"
                        >
                          {item.posterUrl ? (
                            <img
                              src={item.posterUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <HiFilm className="text-gray-400 text-xs" />
                            </div>
                          )}
                        </div>
                      ))}
                    {(collection.movies?.length || 0) +
                      (collection.series?.length || 0) >
                      4 && (
                      <div className="w-10 h-14 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500">
                        +
                        {(collection.movies?.length || 0) +
                          (collection.series?.length || 0) -
                          4}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-14 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-xs text-gray-400">
                    Henüz içerik yok
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <HiCollection className="text-5xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Henüz koleksiyon oluşturmadınız
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Favori filmlerinizi ve dizilerinizi gruplamak için koleksiyon
              oluşturun.
            </p>
          </div>
        )}
      </section>

      {/* Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {editingCollection
                ? "Koleksiyonu Düzenle"
                : "Yeni Koleksiyon Oluştur"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Koleksiyon Adı
                </label>
                <input
                  type="text"
                  value={collectionForm.name}
                  onChange={(e) =>
                    setCollectionForm({
                      ...collectionForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Örn: Favori Filmlerim"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Açıklama{" "}
                  <span className="text-gray-400 font-normal">
                    (isteğe bağlı)
                  </span>
                </label>
                <textarea
                  value={collectionForm.description}
                  onChange={(e) =>
                    setCollectionForm({
                      ...collectionForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Koleksiyon hakkında kısa bir açıklama..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCollectionModal(false);
                  setEditingCollection(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                İptal
              </button>
              <button
                onClick={handleCreateCollection}
                className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
              >
                {editingCollection ? "Güncelle" : "Oluştur"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modals */}
      <MediaDetailModal
        item={selectedMovie}
        type="movie"
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
      <MediaDetailModal
        item={selectedSeries}
        type="series"
        isOpen={!!selectedSeries}
        onClose={() => setSelectedSeries(null)}
      />
      <CollectionDetailModal
        collection={selectedCollection}
        isOpen={!!selectedCollection}
        onClose={() => setSelectedCollection(null)}
        onMovieClick={(movie) => {
          setSelectedCollection(null);
          fetchMovieDetail(movie.id);
        }}
        onSeriesClick={(series) => {
          setSelectedCollection(null);
          fetchSeriesDetail(series.id);
        }}
      />
    </div>
  );
}

export default Dashboard;
