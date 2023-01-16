const API_KEY = "b1029ba80cf55e74a7185d039c745528";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface INet {
    id: number;
    backdrop_path: string;
    poster_path: string;
    title?: string;
    overview: string;
    name?: string;
    vote_average: number;
    adult: boolean;
  }
  export interface IGetNetsResult {
    dates?: {
      maximum: string;
      minimum: string;
    };
    page: number;
    results: INet[];
    total_pages: number;
    total_results: number;
  }
  
  export enum CategoryType {
    "on_the_air" = "on_the_air",
    "now_playing" = "now_playing",
    "airing_today" = "airing_today",
    "upcoming" = "upcoming",
    "popular" = "popular",
    "top_rated" = "top_rated",
  }
  export async function getMovies(category: CategoryType) {
    return await fetch(
      `${BASE_PATH}/movie/${category}?api_key=${API_KEY}&page=1&region=kr`
    ).then((res) => res.json());
  }

  export async function getTvshows(category: CategoryType) {
    return await fetch(
      `${BASE_PATH}/tv/${category}?api_key=${API_KEY}&page=1&region=kr`
    ).then((res) => res.json());
  }

  export async function getSerchMovies(keyword: string) {
    return await fetch(
      `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`
    ).then((res) => res.json());
  }

  export async function getSerchTvshows(keyword: string) {
    return await fetch(
      `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`
    ).then((res) => res.json());
  }



