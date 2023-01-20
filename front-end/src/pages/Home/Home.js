import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import inception from "../../images/inception.png";
import MovieCard from "../../components/MovieCard/MovieCard";
import { SyncLoader } from "react-spinners";
import "./Home.css";

export default function Home({ keys }) {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();

  function fetchPopularMovies() {
    fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${keys.apiKey}&language=en-US&page=1`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        setPopularMovies(data.results);
        setIsLoading(false);
      });
  }

  function fetchTopRatedMovies() {
    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${keys.apiKey}&language=en-US&page=1&region=US`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        setTopRatedMovies(data.results);
        setIsLoading(false);
      });
  }

  function fetchUpcomingMovies() {
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${keys.apiKey}&language=en-US&page=1`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        setUpcomingMovies(data.results);
        setIsLoading(false);
      });
  }

  function handleSearch() {
    if (!query) {
      setError("you need to enter a value");
    } else {
      history.push("/search/" + query);
    }
  }

  useEffect(() => {
    fetchPopularMovies();
    fetchTopRatedMovies();
    fetchUpcomingMovies();
  }, []);

  return (
    <div className="Home">
      <div
        className="home-header"
        style={{ backgroundImage: `url(${inception})` }}
      >
        <div className="inner-home-header">
          <div>
            <h1>Bem-vindo</h1>
            <p>Explorar filmes.</p>
          </div>
          <div>
            <form>
              <input
                type="text"
                name="search"
                placeholder="procurar um filme"
                onChange={(e) => setQuery(e.target.value)}
              />
              {error ? <p className="error">{error}</p> : ""}
              <button type="button" onClick={handleSearch}>
                Buscar
              </button>
            </form>
          </div>
        </div>
      </div>

      {!isLoading ? (
        <>
          <h2>Popular</h2>
          <div className="movie-list popular">
            {popularMovies &&
              popularMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
          </div>

          <h2>Mais votados</h2>
          <div className="movie-list top-rated">
            {topRatedMovies &&
              topRatedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
          </div>

          <h2>Em breve</h2>
          <div className="movie-list upcoming">
            {upcomingMovies &&
              upcomingMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
          </div>
        </>
      ) : (
        <div className="loading">
          <div className="loader">
            <SyncLoader className="loader" color={"#6a5acd"} />
          </div>
        </div>
      )}
    </div>
  );
}
