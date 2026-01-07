import type { Movie } from "../../types/Movie";
import type { Series } from "../../types/Series";
import { HiFilm, HiPlay } from "react-icons/hi";

type MediaCardProps = {
  item: Movie | Series;
  type?: "movie" | "series";
  onClick?: () => void;
};

function MediaCard({ item, type = "movie", onClick }: MediaCardProps) {
  const getSubtitle = () => {
    if (type === "movie") {
      const movie = item as Movie;
      return `${movie.releaseYear} • ${movie.director}`;
    } else {
      const series = item as Series;
      const years = series.endYear
        ? `${series.startYear} - ${series.endYear}`
        : `${series.startYear} - Devam Ediyor`;
      return series.creator ? `${years} • ${series.creator}` : years;
    }
  };

  // İlk 2 türü göster
  const genres = item.genres?.slice(0, 2) || [];

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
    >
      {/* Poster */}
      <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 relative">
        {item.posterUrl ? (
          <img
            src={item.posterUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HiFilm className="text-4xl text-gray-400" />
          </div>
        )}

        {/* Genre badges on poster */}
        {genres.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {genres.map((genre) => (
              <span
                key={genre.id}
                className="px-2 py-0.5 bg-purple-600/90 text-white text-[10px] font-medium rounded-full backdrop-blur-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
            <HiPlay className="text-2xl text-white ml-1" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate">
          {item.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 truncate">{getSubtitle()}</p>
      </div>
    </div>
  );
}

export default MediaCard;
