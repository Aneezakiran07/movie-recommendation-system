import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./searchResults.css"; // Import CSS

const API_KEY = "3c939f5bc9657293ebed62fbdd049833";

function SearchResults() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("title");

  useEffect(() => {
    if (searchTerm) {
      const fetchMovies = async () => {
        try {
          const backendResponse = await fetch(`http://localhost:4000/api/movies/search?title=${encodeURIComponent(searchTerm)}`);
          if (!backendResponse.ok) throw new Error("Failed to fetch movies from backend");

          const backendMovies = await backendResponse.json();

          const moviesWithPosters = await Promise.all(
            backendMovies.map(async (movie) => {
              try {
                const tmdbResponse = await fetch(
                  `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.title)}`
                );
                if (!tmdbResponse.ok) throw new Error("Failed to fetch poster");

                const tmdbData = await tmdbResponse.json();
                const posterPath = tmdbData.results.length > 0 ? tmdbData.results[0].poster_path : null;

                return { 
                  ...movie,  
                  poster_path: posterPath 
                };
              } catch {
                return { 
                  ...movie, 
                  poster_path: null 
                };
              }
            })
          );

          setMovies(moviesWithPosters);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchMovies();
    }
  }, [searchTerm]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="search-results-container">
      <h2>Search Results For: {searchTerm}</h2>
      <div className="search-movie-list">
        {movies.length > 0 ? (
          movies.map((movie) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image";

            return (
              <div 
                key={movie.id} 
                className="search-movie-card"
                onClick={() => navigate(`/movie/${movie.Movie_id}/${encodeURIComponent(movie.title)}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={posterUrl} alt={movie.title} className="search-movie-poster" />
                <h3>{movie.title}</h3>
                <p><strong>⭐ Rating:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
                <p><strong>🌍 Language:</strong> {movie.original_language ? movie.original_language.toUpperCase() : "Unknown"}</p>
                <p><strong>📏 Duration:</strong> {movie.duration_minutes ? movie.duration_minutes : "Unknown"} min</p>
              </div>
            );
          })
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;