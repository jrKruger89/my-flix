import { TMDBMovie } from "@/services/tmdbApi";

export interface MediaItem {
  id: string;
  title: string;
  poster: string;
  rating: number;
  releaseYear: number;
  playTime: string;
  director: string[];
  cast: string[];
  description: string[];
}

export function transformTMDBToMedia(tmdbMovie: TMDBMovie): MediaItem {
  const directors =
    tmdbMovie.credits?.crew
      .filter((person) => person.job === "Director")
      .map((p) => p.name) || [];

  const cast = tmdbMovie.credits?.cast?.slice(0, 5).map((p) => p.name) || [];

  // Format runtime as a readable string
  const formatRuntime = (minutes: number | null): string => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return {
    id: String(tmdbMovie.id),
    title: tmdbMovie.title,
    poster: tmdbMovie.poster_path
      ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Image",
    rating: tmdbMovie.vote_average,
    releaseYear: new Date(tmdbMovie.release_date).getFullYear(),
    playTime: formatRuntime(tmdbMovie.runtime),
    director: directors.length > 0 ? directors : ["Unknown"],
    cast: cast.length > 0 ? cast : ["Unknown"],
    description: [tmdbMovie.overview || "No description available"],
  };
}
