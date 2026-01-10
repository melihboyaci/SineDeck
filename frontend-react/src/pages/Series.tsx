import { useEffect, useState } from "react";
import type { Series } from "../types/Series";
import api from "../helper/api";
import { HiFilm, HiPlay } from "react-icons/hi";
import MediaCard from "../components/media/MediaCard";
import MediaDetailModal from "../components/media/MediaDetailModal";
import { LoadingSpinner, EmptyState } from "../components/ui";
function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const fetchSeriesDetail = async (id: number) => {
    try {
      const response = await api.get(`/series/${id}`);
      setSelectedSeries(response.data);
    } catch (error) {
      console.error("Dizi detayı yüklenemedi", error);
    }
  };
  const fetchSeries = async () => {
    try {
      const response = await api.get("/series");
      setSeries(response.data);
    } catch (error) {
      console.error("Diziler yüklenemedi", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSeries();
  }, []);
  if (loading) {
    return <LoadingSpinner message="Diziler yükleniyor..." />;
  }
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <HiPlay className="text-3xl text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Diziler
          </h1>
        </div>
        <p className="text-gray-500">{series.length} dizi bulundu</p>
      </div>
      {series.length === 0 ? (
        <EmptyState
          icon={HiPlay}
          title="Henüz dizi eklenmemiş"
          subtitle="Yönetim panelinden yeni diziler ekleyebilirsiniz."
          dashed={false}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {series.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              type="series"
              onClick={() => fetchSeriesDetail(item.id)}
            />
          ))}
        </div>
      )}
      <MediaDetailModal
        item={selectedSeries}
        type="series"
        isOpen={!!selectedSeries}
        onClose={() => setSelectedSeries(null)}
        onCollectionUpdated={fetchSeries}
      />
    </div>
  );
}
export default SeriesPage;