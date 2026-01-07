import type { Episode } from "./Episode";

export interface Season {
  id: number;
  seasonNumber: number;
  description?: string;
  seriesId?: number;
  series?: {
    id: number;
    title: string;
  };
  episodes?: Episode[];
  createdAt?: string;
  updatedAt?: string;
}
