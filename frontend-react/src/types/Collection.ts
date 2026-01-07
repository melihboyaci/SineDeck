import type { Movie } from "./Movie";
import type { Series } from "./Series";

export interface Collection {
  id: number;
  name: string;
  description?: string;
  userId: number;
  movies: Movie[];
  series: Series[];
  createdAt: string;
}
