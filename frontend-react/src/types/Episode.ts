export interface Episode {
  id: number;
  title: string;
  episodeNumber: number;
  description?: string;
  duration: number;
  seasonId?: number;
  season?: {
    id: number;
    seasonNumber: number;
  };
  createdAt?: string;
  updatedAt?: string;
}