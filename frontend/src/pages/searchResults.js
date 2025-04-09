import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./searchResults.css";

const API_KEY = "3c939f5bc9657293ebed62fbdd049833";
const MOVIES_PER_PAGE = 12;

function SearchResults() {
  const [allMovies, setAllMovies] = useState([]);
  const [visibleMovies, setVisibleMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("title");

  const observer = useRef();

  useEffect(() => {
    if (!searchTerm) return;

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:4000/api/movies/search?title=${encodeURIComponent(searchTerm)}`
        );
        if (!res.ok) throw new Error("Failed to fetch movies");

        const data = await res.json();
        setAllMovies(data);
        setVisibleMovies([]);
        setPage(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm]);

  const loadMoviesWithPosters = useCallback(async (movies) => {
    const withPosters = await Promise.all(
      movies.map(async (movie) => {
        if (movie.poster_path) return movie;

        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.title)}`
          );
          const tmdb = await res.json();
          const poster = tmdb.results[0]?.poster_path || null;
          return { ...movie, poster_path: poster };
        } catch {
          return { ...movie, poster_path: null };
        }
      })
    );

    return withPosters;
  }, []);

  useEffect(() => {
    const load = async () => {
      if (allMovies.length === 0) return;

      const start = (page - 1) * MOVIES_PER_PAGE;
      const chunk = allMovies.slice(start, start + MOVIES_PER_PAGE);

      const withPosters = await loadMoviesWithPosters(chunk);
      setVisibleMovies((prev) => [...prev, ...withPosters]);
      setLoading(false);
      setLoadingMore(false);
    };

    load();
  }, [page, allMovies, loadMoviesWithPosters]);

  const lastMovieRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleMovies.length < allMovies.length) {
          setLoadingMore(true);
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, visibleMovies.length, allMovies.length]
  );

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="search-results-container">
      <h2>Search Results For: {searchTerm}</h2>
      <div className="search-movie-list">
        {visibleMovies.length > 0 ? (
          visibleMovies.map((movie, idx) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image";

            const isLast = idx === visibleMovies.length - 1;

            return (
              <div
                key={movie.id}
                className="search-movie-card"
                ref={isLast ? lastMovieRef : null}
                onClick={() =>
                  navigate(`/movie/${movie.Movie_id}/${encodeURIComponent(movie.title)}`)
                }
                style={{ cursor: "pointer" }}
              >
                <img src={posterUrl} alt={movie.title} className="search-movie-poster" />
                <h3>{movie.title}</h3>
                <p>
                  <strong>⭐ Rating:</strong>{" "}
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </p>
                <p>
                  <strong>🌍 Language:</strong>{" "}
                  {movie.original_language?.toUpperCase() || "Unknown"}
                </p>
                <p>
                  <strong>📏 Duration:</strong>{" "}
                  {movie.duration_minutes || "Unknown"} min
                </p>
              </div>
            );
          })
        ) : !loading ? (
          <p>No movies found.</p>
        ) : null}
      </div>

      {loading && <p className="loading-text">Loading...</p>}
    </div>
  );
}

export default SearchResults;