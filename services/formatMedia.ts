import { TMDBMovie, TMDBShow } from "@/services/tmdbApi";

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

export function transformTMDBToMedia(data: TMDBMovie | TMDBShow): MediaItem {
  // Determine if it's a movie or TV show
  const isMovie = "title" in data;
  const title = isMovie ? data.title : data.name;
  const releaseDate = isMovie ? data.release_date : data.first_air_date;

  const directors =
    data.credits?.crew
      ?.filter((person) => person.job === "Director")
      .map((p) => p.name) || [];

  const cast = data.credits?.cast?.slice(0, 5).map((p) => p.name) || [];

  const formatRuntime = (minutes: number | number[] | null): string => {
    if (!minutes) return "Unknown";

    // Handle array (TV shows) or number (movies)
    const runtime = Array.isArray(minutes) ? minutes[0] : minutes;
    if (!runtime) return "Unknown";

    const hours = Math.floor(runtime / 60);
    const mins = runtime % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const playTime = isMovie
    ? formatRuntime(data.runtime)
    : formatRuntime(data.episode_run_time);

  return {
    id: String(data.id),
    title,
    poster: data.poster_path
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : "https://via.placeholder.com/300x450?text=No+Image",
    rating: data.vote_average,
    releaseYear: new Date(releaseDate).getFullYear(),
    playTime,
    director: directors.length > 0 ? directors : ["Unknown"],
    cast: cast.length > 0 ? cast : ["Unknown"],
    description: [data.overview || "No description available"],
  };
}
