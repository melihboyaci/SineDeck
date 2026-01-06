import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../helper/api";
import { HiFilm, HiArrowLeft } from "react-icons/hi";

function AddMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    director: "",
    releaseYear: String(new Date().getFullYear()),
    posterUrl: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/movies", {
        title: formData.title,
        description: formData.description,
        director: formData.director,
        releaseYear: Number(formData.releaseYear),
        ...(formData.posterUrl ? { posterUrl: formData.posterUrl } : {}),
      });

      toast.success("Film başarıyla eklendi");
      navigate("/admin/movies");
    } catch (error) {
      console.error(error);
      toast.error("Film eklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/movies")}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-4"
        >
          <HiArrowLeft /> Geri Dön
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <HiFilm className="text-xl text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Yeni Film Ekle
            </h1>
            <p className="text-sm text-gray-500">Film bilgilerini girin</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5"
      >
        {/* Film Adı */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Film Adı
          </label>
          <input
            id="title"
            type="text"
            placeholder="Örn: The Matrix"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Özet */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Film Özeti
          </label>
          <textarea
            id="description"
            placeholder="Filmin konusu nedir?"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Yönetmen ve Yıl */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="director"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Yönetmen
            </label>
            <input
              id="director"
              type="text"
              placeholder="Christopher Nolan"
              required
              value={formData.director}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="releaseYear"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Vizyon Yılı
            </label>
            <input
              id="releaseYear"
              type="number"
              required
              value={formData.releaseYear}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Poster URL */}
        <div>
          <label
            htmlFor="posterUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Afiş URL{" "}
            <span className="text-gray-400 font-normal">(isteğe bağlı)</span>
          </label>
          <input
            id="posterUrl"
            type="url"
            placeholder="https://example.com/poster.jpg"
            value={formData.posterUrl}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Butonlar */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => navigate("/admin/movies")}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Kaydediliyor...
              </>
            ) : (
              "Filmi Kaydet"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMovie;
