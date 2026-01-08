import { useContext, useEffect, useState } from "react";
import type { Series } from "../../types/Series";
import type { Season } from "../../types/Season";
import type { Episode } from "../../types/Episode";
import { toast } from "react-toastify";
import api from "../../helper/api";
import { Link } from "react-router-dom";
import {
  HiFilm,
  HiPlus,
  HiX,
  HiChevronDown,
  HiChevronRight,
  HiCollection,
  HiPlay,
  HiPencil,
  HiTrash,
} from "react-icons/hi";
import { AuthContext } from "../../components/auth/AuthContext";
import {
  LoadingSpinner,
  PageHeader,
  EmptyState,
  Modal,
  Button,
  FormInput,
  FormTextarea,
} from "../../components/ui";

function SeriesList() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";

  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  // Expanded states
  const [expandedSeries, setExpandedSeries] = useState<number | null>(null);
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);

  // Seasons and Episodes data
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingSeasons, setLoadingSeasons] = useState(false);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  // Modal states
  const [seasonModalOpen, setSeasonModalOpen] = useState(false);
  const [episodeModalOpen, setEpisodeModalOpen] = useState(false);
  const [editingSeasonId, setEditingSeasonId] = useState<number | null>(null);
  const [editingEpisodeId, setEditingEpisodeId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [seasonForm, setSeasonForm] = useState({
    seasonNumber: "",
    description: "",
    seriesId: 0,
  });

  const [episodeForm, setEpisodeForm] = useState({
    title: "",
    episodeNumber: "",
    description: "",
    duration: "",
    seasonId: 0,
  });

  const fetchSeries = async () => {
    try {
      const response = await api.get("/series");
      setSeries(response.data);
    } catch (error) {
      toast.error("Diziler yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  // Fetch seasons for a series
  const fetchSeasons = async (seriesId: number) => {
    setLoadingSeasons(true);
    try {
      const response = await api.get("/seasons");
      const filtered = response.data.filter(
        (s: Season) => s.series?.id === seriesId
      );
      setSeasons(filtered);
    } catch (error) {
      toast.error("Sezonlar yüklenemedi!");
    } finally {
      setLoadingSeasons(false);
    }
  };

  // Fetch episodes for a season
  const fetchEpisodes = async (seasonId: number) => {
    setLoadingEpisodes(true);
    try {
      const response = await api.get("/episodes");
      const filtered = response.data.filter(
        (e: Episode) => e.season?.id === seasonId
      );
      setEpisodes(filtered);
    } catch (error) {
      toast.error("Bölümler yüklenemedi!");
    } finally {
      setLoadingEpisodes(false);
    }
  };

  // Toggle series expansion
  const toggleSeries = (seriesId: number) => {
    if (expandedSeries === seriesId) {
      setExpandedSeries(null);
      setExpandedSeason(null);
      setSeasons([]);
      setEpisodes([]);
    } else {
      setExpandedSeries(seriesId);
      setExpandedSeason(null);
      setEpisodes([]);
      fetchSeasons(seriesId);
    }
  };

  // Toggle season expansion
  const toggleSeason = (seasonId: number) => {
    if (expandedSeason === seasonId) {
      setExpandedSeason(null);
      setEpisodes([]);
    } else {
      setExpandedSeason(seasonId);
      fetchEpisodes(seasonId);
    }
  };

  // Delete handlers
  const handleDeleteSeries = async (id: number) => {
    if (
      !window.confirm(
        "Bu diziyi silmek istediğinize emin misiniz? Tüm sezon ve bölümler de silinecek!"
      )
    )
      return;

    try {
      await api.delete(`/series/${id}`);
      toast.success("Dizi silindi.");
      setSeries(series.filter((s) => s.id !== id));
      if (expandedSeries === id) {
        setExpandedSeries(null);
        setSeasons([]);
        setEpisodes([]);
      }
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const handleDeleteSeason = async (id: number) => {
    if (
      !window.confirm(
        "Bu sezonu silmek istediğinize emin misiniz? Tüm bölümler de silinecek!"
      )
    )
      return;

    try {
      await api.delete(`/seasons/${id}`);
      toast.success("Sezon silindi.");
      setSeasons(seasons.filter((s) => s.id !== id));
      if (expandedSeason === id) {
        setExpandedSeason(null);
        setEpisodes([]);
      }
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const handleDeleteEpisode = async (id: number) => {
    if (!window.confirm("Bu bölümü silmek istediğinize emin misiniz?")) return;

    try {
      await api.delete(`/episodes/${id}`);
      toast.success("Bölüm silindi.");
      setEpisodes(episodes.filter((e) => e.id !== id));
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  // Season Modal handlers
  const openAddSeasonModal = (seriesId: number) => {
    setEditingSeasonId(null);
    setSeasonForm({ seasonNumber: "", description: "", seriesId });
    setSeasonModalOpen(true);
  };

  const openEditSeasonModal = (season: Season) => {
    setEditingSeasonId(season.id);
    setSeasonForm({
      seasonNumber: String(season.seasonNumber),
      description: season.description ?? "",
      seriesId: season.series?.id ?? 0,
    });
    setSeasonModalOpen(true);
  };

  const handleSeasonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        seasonNumber: Number(seasonForm.seasonNumber),
        description: seasonForm.description || undefined,
        seriesId: seasonForm.seriesId,
      };

      if (editingSeasonId) {
        await api.patch(`/seasons/${editingSeasonId}`, payload);
        toast.success("Sezon güncellendi!");
      } else {
        await api.post("/seasons", payload);
        toast.success("Sezon eklendi!");
      }

      setSeasonModalOpen(false);
      fetchSeasons(seasonForm.seriesId);
    } catch (error) {
      toast.error("İşlem başarısız!");
    } finally {
      setSubmitting(false);
    }
  };

  // Episode Modal handlers
  const openAddEpisodeModal = (seasonId: number) => {
    setEditingEpisodeId(null);
    setEpisodeForm({
      title: "",
      episodeNumber: "",
      description: "",
      duration: "",
      seasonId,
    });
    setEpisodeModalOpen(true);
  };

  const openEditEpisodeModal = (episode: Episode) => {
    setEditingEpisodeId(episode.id);
    setEpisodeForm({
      title: episode.title,
      episodeNumber: String(episode.episodeNumber),
      description: episode.description ?? "",
      duration: String(episode.duration),
      seasonId: episode.season?.id ?? 0,
    });
    setEpisodeModalOpen(true);
  };

  const handleEpisodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: episodeForm.title,
        episodeNumber: Number(episodeForm.episodeNumber),
        description: episodeForm.description || undefined,
        duration: Number(episodeForm.duration),
        seasonId: episodeForm.seasonId,
      };

      if (editingEpisodeId) {
        await api.patch(`/episodes/${editingEpisodeId}`, payload);
        toast.success("Bölüm güncellendi!");
      } else {
        await api.post("/episodes", payload);
        toast.success("Bölüm eklendi!");
      }

      setEpisodeModalOpen(false);
      fetchEpisodes(episodeForm.seasonId);
    } catch (error) {
      toast.error("İşlem başarısız!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Diziler yükleniyor..." />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Dizi Yönetimi"
        subtitle="Dizileri, sezonları ve bölümleri yönetin"
        icon={HiFilm}
        action={
          <Link to="/admin/add-series">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
              <HiPlus /> Yeni Dizi
            </button>
          </Link>
        }
      />

      {/* Series List */}
      <div className="space-y-3">
        {series.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Series Row */}
            <div
              className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              onClick={() => toggleSeries(item.id)}
            >
              <div className="flex items-center gap-4">
                <button className="text-gray-400">
                  {expandedSeries === item.id ? (
                    <HiChevronDown className="text-xl" />
                  ) : (
                    <HiChevronRight className="text-xl" />
                  )}
                </button>
                {item.posterUrl ? (
                  <img
                    src={item.posterUrl}
                    alt={item.title}
                    className="w-10 h-14 object-cover rounded shadow-sm border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "";
                    }}
                  />
                ) : (
                  <div className="w-10 h-14 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <HiFilm className="text-purple-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.startYear} - {item.endYear || "Devam Ediyor"}
                    {item.creator && ` • ${item.creator}`}
                  </p>
                </div>
              </div>
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Link to={`/admin/edit-series/${item.id}`}>
                  <button className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 transition-colors">
                    <HiPencil className="text-lg" />
                  </button>
                </Link>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteSeries(item.id)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <HiTrash className="text-lg" />
                  </button>
                )}
              </div>
            </div>

            {/* Seasons Panel */}
            {expandedSeries === item.id && (
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="px-5 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <HiCollection className="text-purple-500" />
                    Sezonlar
                  </div>
                  <button
                    onClick={() => openAddSeasonModal(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    <HiPlus /> Sezon Ekle
                  </button>
                </div>

                {loadingSeasons ? (
                  <div className="px-5 py-6 text-center text-gray-500">
                    Sezonlar yükleniyor...
                  </div>
                ) : seasons.length === 0 ? (
                  <div className="px-5 py-6 text-center text-gray-500">
                    Henüz sezon eklenmemiş.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {seasons
                      .sort((a, b) => a.seasonNumber - b.seasonNumber)
                      .map((season) => (
                        <div key={season.id}>
                          {/* Season Row */}
                          <div
                            className="flex items-center justify-between px-5 py-3 pl-12 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
                            onClick={() => toggleSeason(season.id)}
                          >
                            <div className="flex items-center gap-3">
                              <button className="text-gray-400">
                                {expandedSeason === season.id ? (
                                  <HiChevronDown />
                                ) : (
                                  <HiChevronRight />
                                )}
                              </button>
                              <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                                Sezon {season.seasonNumber}
                              </span>
                              {season.description && (
                                <span className="text-sm text-gray-500 truncate max-w-xs">
                                  {season.description}
                                </span>
                              )}
                            </div>
                            <div
                              className="flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => openEditSeasonModal(season)}
                                className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30 transition-colors"
                              >
                                <HiPencil className="text-sm" />
                              </button>
                              {isAdmin && (
                                <button
                                  onClick={() => handleDeleteSeason(season.id)}
                                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                                >
                                  <HiTrash className="text-sm" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Episodes Panel */}
                          {expandedSeason === season.id && (
                            <div className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                              <div className="px-5 py-2 pl-20 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                                  <HiPlay className="text-green-500" />
                                  Bölümler
                                </div>
                                <button
                                  onClick={() => openAddEpisodeModal(season.id)}
                                  className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                >
                                  <HiPlus /> Bölüm Ekle
                                </button>
                              </div>

                              {loadingEpisodes ? (
                                <div className="px-5 py-4 pl-20 text-center text-gray-500 text-sm">
                                  Bölümler yükleniyor...
                                </div>
                              ) : episodes.length === 0 ? (
                                <div className="px-5 py-4 pl-20 text-center text-gray-500 text-sm">
                                  Henüz bölüm eklenmemiş.
                                </div>
                              ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                  {episodes
                                    .sort(
                                      (a, b) =>
                                        a.episodeNumber - b.episodeNumber
                                    )
                                    .map((episode) => (
                                      <div
                                        key={episode.id}
                                        className="flex items-center justify-between px-5 py-2.5 pl-20 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                                      >
                                        <div className="flex items-center gap-3">
                                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium">
                                            E
                                            {String(
                                              episode.episodeNumber
                                            ).padStart(2, "0")}
                                          </span>
                                          <span className="text-sm text-gray-900 dark:text-white">
                                            {episode.title}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {episode.duration} dk
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <button
                                            onClick={() =>
                                              openEditEpisodeModal(episode)
                                            }
                                            className="p-1 rounded text-purple-600 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/30 transition-colors"
                                          >
                                            <HiPencil className="text-xs" />
                                          </button>
                                          {isAdmin && (
                                            <button
                                              onClick={() =>
                                                handleDeleteEpisode(episode.id)
                                              }
                                              className="p-1 rounded text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                                            >
                                              <HiTrash className="text-xs" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {series.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-500">
            Henüz dizi bulunmuyor.
          </div>
        )}
      </div>

      {/* Season Modal */}
      <Modal
        isOpen={seasonModalOpen}
        onClose={() => setSeasonModalOpen(false)}
        title={editingSeasonId ? "Sezon Düzenle" : "Yeni Sezon Ekle"}
        size="sm"
      >
        <form onSubmit={handleSeasonSubmit} className="space-y-4">
          <FormInput
            label="Sezon Numarası"
            type="number"
            required
            min={1}
            value={seasonForm.seasonNumber}
            onChange={(e) =>
              setSeasonForm({
                ...seasonForm,
                seasonNumber: e.target.value,
              })
            }
          />

          <FormTextarea
            label="Açıklama"
            optional
            rows={3}
            value={seasonForm.description}
            onChange={(e) =>
              setSeasonForm({
                ...seasonForm,
                description: e.target.value,
              })
            }
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setSeasonModalOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={submitting}
            >
              {submitting
                ? "Kaydediliyor..."
                : editingSeasonId
                ? "Güncelle"
                : "Ekle"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Episode Modal */}
      <Modal
        isOpen={episodeModalOpen}
        onClose={() => setEpisodeModalOpen(false)}
        title={editingEpisodeId ? "Bölüm Düzenle" : "Yeni Bölüm Ekle"}
        size="sm"
      >
        <form onSubmit={handleEpisodeSubmit} className="space-y-4">
          <FormInput
            label="Bölüm Numarası"
            type="number"
            required
            min={1}
            value={episodeForm.episodeNumber}
            onChange={(e) =>
              setEpisodeForm({
                ...episodeForm,
                episodeNumber: e.target.value,
              })
            }
          />

          <FormInput
            label="Bölüm Başlığı"
            type="text"
            required
            placeholder="Örn: Pilot"
            value={episodeForm.title}
            onChange={(e) =>
              setEpisodeForm({ ...episodeForm, title: e.target.value })
            }
          />

          <FormInput
            label="Süre (dakika)"
            type="number"
            required
            min={1}
            placeholder="45"
            value={episodeForm.duration}
            onChange={(e) =>
              setEpisodeForm({ ...episodeForm, duration: e.target.value })
            }
          />

          <FormTextarea
            label="Açıklama"
            optional
            rows={3}
            value={episodeForm.description}
            onChange={(e) =>
              setEpisodeForm({
                ...episodeForm,
                description: e.target.value,
              })
            }
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setEpisodeModalOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={submitting}
            >
              {submitting
                ? "Kaydediliyor..."
                : editingEpisodeId
                ? "Güncelle"
                : "Ekle"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default SeriesList;
