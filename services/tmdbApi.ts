import { TMDB_API_KEY, TMDB_BASE_URL } from "@/constants/config";

interface TMDBResponse {
  results: TMDBMovie[];
  total_pages: number;
  page: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  runtime: number;
  credits: {
    cast: { name: string }[];
    crew: { job: string; name: string }[];
  };
}

// Fetch popular movies
export async function getPopularMovies(page: number = 1) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
  );
  const data: TMDBResponse = await response.json();
  return data;
}

// Fetch movie details with credits
export async function getMovieDetails(movieId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`,
  );
  const data: TMDBMovie = await response.json();
  return data;
}

export async function getTrendingMovies(page: number = 1) {
  const response = await fetch(
    `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=${page}`,
  );
  const data: TMDBResponse = await response.json();
  return data;
}

export interface TMDBShow {
  id: number;
  name: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  overview: string;
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  networks: { name: string }[];
  credits: {
    cast: { name: string }[];
    crew: { job: string; name: string }[];
  };
}

// Fetch popular TV shows
export async function getPopularTV(page: number = 1) {
  const response = await fetch(
    `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`,
  );
  const data: TMDBResponse = await response.json();
  return data;
}

// Add this function
export async function getTVDetails(tvId: number) {
  const response = await fetch(
    `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&append_to_response=credits`,
  );
  const data: TMDBShow = await response.json();
  return data;
}
