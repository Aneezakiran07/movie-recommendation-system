import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./searchResults.css"; // Import CSS

const API_KEY = "3c939f5bc9657293ebed62fbdd049833";

function SearchResults() {
  const [movieData, setMovieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("title");

  useEffect(() => {
    if (searchTerm) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`
          );
          if (!response.ok) throw new Error("Failed to fetch movies");

          const data = await response.json();
          setMovieData(data.results || []); // Ensure an array is always set
        } catch (error) {
          setError("Failed to fetch movies");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [searchTerm]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="search-results-container">
      <h2>Search Results for: {searchTerm}</h2>
      <div className="search-movie-list"> {/* Updated class name */}
        {movieData.length > 0 ? (
          movieData.map((movie) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"; // Fallback for missing posters

            return (
              <div key={movie.id} className="search-movie-card"> {/* Updated class name */}
                <img src={posterUrl} alt={movie.title} className="search-movie-poster" /> {/* Updated class name */}
                <h3>{movie.title}</h3>
                <p>{movie.overview || "No description available."}</p>
                <p><strong>⭐ Rating:</strong> {movie.vote_average.toFixed(1)}</p>
                <p><strong>🌍 Language:</strong> {movie.original_language.toUpperCase()}</p>
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