import type { Genre } from "./Genre";

export interface Series {
  id: number;
  title: string;
  description: string;
  startYear: number;
  endYear?: number;
  creator?: string;
  posterUrl?: string;
  genres?: Genre[];
}
