import { HiFilm } from "react-icons/hi";
interface Props {
  src?: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg";
  hover?: boolean;
  onClick?: () => void;
}
export default function PosterThumbnail({
  src,
  alt,
  size = "md",
  hover = true,
  onClick,
}: Props) {
  const sizeClasses = {
    xs: "w-10 h-14",
    sm: "w-12 h-16",
    md: "w-20 h-28",
    lg: "w-32 h-44",
  };
  const iconSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-xl",
    lg: "text-3xl",
  };
  return (
    <div
      className={`${
        sizeClasses[size]
      } rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 ${
        hover ? "group" : ""
      } ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${
            hover ? "group-hover:scale-105 transition-transform" : ""
          }`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <HiFilm className={`text-gray-400 ${iconSizes[size]}`} />
        </div>
      )}
    </div>
  );
}