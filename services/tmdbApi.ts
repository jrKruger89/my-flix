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
