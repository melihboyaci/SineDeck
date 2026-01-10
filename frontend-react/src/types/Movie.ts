import type { Genre } from "./Genre";
export interface Movie {
  id: number;
  title: string;
  director: string;
  releaseYear: number;
  posterUrl?: string;
  description?: string;
  genres?: Genre[];
}