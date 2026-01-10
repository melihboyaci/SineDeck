import { useEffect, useState, type FormEvent } from "react";
import type { Genre } from "../../types/Genre";
import api from "../../helper/api";
import { toast } from "react-toastify";
import { HiTag, HiPlus } from "react-icons/hi";
import {
  LoadingSpinner,
  PageHeader,
  EmptyState,
  Modal,
  Button,
} from "../../components/ui";
function GenreManagement() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [genreIdToDelete, setGenreIdToDelete] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [formName, setFormName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fetchGenres = async () => {
    try {
      const response = await api.get("/genres");
      setGenres(response.data);
    } catch (error) {
      toast.error("Türler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchGenres();
  }, []);
  const openAddModal = () => {
    setEditingGenre(null);
    setFormName("");
    setShowFormModal(true);
  };
  const openEditModal = (genre: Genre) => {
    setEditingGenre(genre);
    setFormName(genre.name);
    setShowFormModal(true);
  };
  const closeFormModal = () => {
    setShowFormModal(false);
    setEditingGenre(null);
    setFormName("");
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSubmitting(true);
    try {
      if (editingGenre) {
        await api.patch(`/genres/${editingGenre.id}`, { name: formName });
        toast.success("Tür güncellendi");
        setGenres(
          genres.map((g) =>
            g.id === editingGenre.id ? { ...g, name: formName } : g
          )
        );
      } else {
        const response = await api.post("/genres", { name: formName });
        toast.success("Tür eklendi");
        setGenres([...genres, response.data]);
      }
      closeFormModal();
    } catch (error) {
      toast.error(editingGenre ? "Güncelleme başarısız" : "Ekleme başarısız");
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async () => {
    if (!genreIdToDelete) return;
    try {
      await api.delete(`/genres/${genreIdToDelete}`);
      toast.success("Tür silindi");
      setGenres(genres.filter((g) => g.id !== genreIdToDelete));
      setShowDeleteModal(false);
      setGenreIdToDelete(null);
    } catch (error) {
      toast.error("Silme işlemi başarısız.");
    }
  };
  if (loading) {
    return <LoadingSpinner message="Türler yükleniyor..." />;
  }
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Tür Yönetimi"
        subtitle="Film ve dizi türlerini yönetin"
        icon={HiTag}
        action={
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
          >
            <HiPlus /> Yeni Tür
          </button>
        }
      />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Tür Adı</th>
              <th className="px-6 py-3 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {genres.map((genre) => (
              <tr
                key={genre.id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                  {genre.name}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(genre)}
                      className="px-3 py-1.5 rounded-lg text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 font-medium transition-colors"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => {
                        setGenreIdToDelete(genre.id);
                        setShowDeleteModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 font-medium transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {genres.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Henüz tür bulunmuyor.
          </div>
        )}
      </div>
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {editingGenre ? "Türü Düzenle" : "Yeni Tür Ekle"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="genreName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                >
                  Tür Adı
                </label>
                <input
                  id="genreName"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Örn: Aksiyon"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Kaydediliyor..."
                    : editingGenre
                    ? "Güncelle"
                    : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Türü Sil
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Bu türü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setGenreIdToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default GenreManagement;