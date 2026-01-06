import { Button } from "flowbite-react";
import type { Movie } from "../../types/Movie";
import { HiCalendar, HiUser, HiEye } from "react-icons/hi";

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Poster */}
      <div className="relative overflow-hidden aspect-[2/3]">
        <img
          src={
            movie.posterUrl || "https://placehold.co/400x600?text=Film+Afisi"
          }
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <Button size="sm" color="purple" className="w-full">
              <HiEye className="mr-2" /> Detayları Gör
            </Button>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-4">
        <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {movie.title}
        </h5>

        <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
          {movie.director && (
            <div className="flex items-center gap-2">
              <HiUser className="text-purple-500" />
              <span className="line-clamp-1">{movie.director}</span>
            </div>
          )}
          {movie.releaseYear && (
            <div className="flex items-center gap-2">
              <HiCalendar className="text-purple-500" />
              <span>{movie.releaseYear}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
