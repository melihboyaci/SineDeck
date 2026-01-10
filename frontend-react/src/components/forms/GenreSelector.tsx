import { useEffect, useState } from "react";
import type { Genre } from "../../types/Genre";
import api from "../../helper/api";
import { HiX, HiPlus } from "react-icons/hi";
type GenreSelectorProps = {
  selectedGenreIds: number[];
  onChange: (genreIds: number[]) => void;
};
function GenreSelector({ selectedGenreIds, onChange }: GenreSelectorProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get("/genres");
        setGenres(response.data);
      } catch (error) {
        console.error("Türler yüklenemedi", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);
  const toggleGenre = (genreId: number) => {
    if (selectedGenreIds.includes(genreId)) {
      onChange(selectedGenreIds.filter((id) => id !== genreId));
    } else {
      onChange([...selectedGenreIds, genreId]);
    }
  };
  const selectedGenres = genres.filter((g) => selectedGenreIds.includes(g.id));
  const availableGenres = genres.filter(
    (g) => !selectedGenreIds.includes(g.id)
  );
  if (loading) {
    return (
      <div className="text-sm text-gray-500 py-2">Türler yükleniyor...</div>
    );
  }
  return (
    <div className="space-y-3">
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedGenres.map((genre) => (
            <span
              key={genre.id}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
            >
              {genre.name}
              <button
                type="button"
                onClick={() => toggleGenre(genre.id)}
                className="ml-1 hover:text-purple-900 dark:hover:text-purple-100 transition-colors"
              >
                <HiX className="text-sm" />
              </button>
            </span>
          ))}
        </div>
      )}
      {availableGenres.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {availableGenres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => toggleGenre(genre.id)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <HiPlus className="text-xs" />
              {genre.name}
            </button>
          ))}
        </div>
      )}
      {genres.length === 0 && (
        <div className="text-sm text-gray-500">
          Henüz tür eklenmemiş. Önce tür ekleyin.
        </div>
      )}
    </div>
  );
}
export default GenreSelector;