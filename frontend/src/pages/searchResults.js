import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [likedMovies, setLikedMovies] = useState(new Set());
  const [watchlist, setWatchlist] = useState(new Set());
  const [userRatings, setUserRatings] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("title");

  const sentinelRef = useRef(null);

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
    return Promise.all(
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
  }, []);

  useEffect(() => {
    const load = async () => {
      if (allMovies.length === 0) return;
      const start = (page - 1) * MOVIES_PER_PAGE;
      const chunk = allMovies.slice(start, start + MOVIES_PER_PAGE);
      const withPosters = await loadMoviesWithPosters(chunk);
      setVisibleMovies((prev) => [...prev, ...withPosters]);
      setLoadingMore(false);
    };

    if (!loading) load();
  }, [page, allMovies, loadMoviesWithPosters, loading]);

  useEffect(() => {
    if (loadingMore || loading) return;
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleMovies.length < allMovies.length) {
          setLoadingMore(true);
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadingMore, loading, visibleMovies.length, allMovies.length]);

  const handleLikeClick = async (movieId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/likes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id, movie_id: movieId }),
      });

      if (res.ok) {
        setLikedMovies((prev) => new Set(prev).add(movieId));
        toast.success("Movie Liked Successfully!");
      } else {
        toast.error("Already Liked Movie!");
      }
    } catch (err) {
      console.error("An error occurred:", err);
      toast.error("Something went wrong. Please try later!");
    }
  };

  const handleAddToWatchlist = async (movieId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/watchlist/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id, movie_id: movieId }),
      });

      if (res.ok) {
        setWatchlist((prev) => new Set(prev).add(movieId));
        toast.success("Added to Watchlist!");
      } else {
        toast.error("Already in Watchlist!");
      }
    } catch (err) {
      console.error("Error adding to watchlist:", err);
      toast.error("Failed to add to Watchlist!");
    }
  };

  const handleRating = async (movieId, rating) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/ratings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id, movie_id: movieId, rating }),
      });

      if (res.ok) {
        setUserRatings((prev) => ({ ...prev, [movieId]: rating }));
        toast.success(`You rated ${rating}/10`);
      } else {
        toast.error("You already rated this movie!");
      }
    } catch (err) {
      console.error("Error rating movie:", err);
      toast.error("Failed to rate the movie!");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="search-results-container">
      <h2>Search Results For: {searchTerm}</h2>
      <div className="search-movie-list">
        {visibleMovies.length > 0 ? (
          visibleMovies.map((movie) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image";

            const isLiked = likedMovies.has(movie.Movie_id);
            const isInWatchlist = watchlist.has(movie.Movie_id);
            const currentRating = userRatings[movie.Movie_id] || "";

            return (
              <div
                key={movie.Movie_id}
                className="search-movie-card"
                onClick={() => navigate(`/movie/${movie.Movie_id}/${encodeURIComponent(movie.title)}`)}
                style={{ cursor: "pointer" }}
              >
                <img src={posterUrl} alt={movie.title} className="search-movie-poster" />
                <h3>{movie.title}</h3>

                <div className="icon-section" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <button
                    className={`heart-btn ${isLiked ? "liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeClick(movie.Movie_id);
                    }}
                    style={{
                      fontSize: "40px",
                      marginLeft: "10px",
                      color: isLiked ? "red" : "#ccc",
                    }}
                  >
                    ❤️
                  </button>

                  <button
                    className={`watchlist-btn ${isInWatchlist ? "liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWatchlist(movie.Movie_id);
                    }}
                    style={{
                      fontSize: "40px",
                      marginRight: "10px",
                      color: isInWatchlist ? "red" : "#ccc",
                    }}
                  >
                    📋
                  </button>
                </div>

                {/* Cleaner Rating Dropdown */}
                <div onClick={(e) => e.stopPropagation()} style={{ marginTop: "10px" }}>
                  <select
                    value={currentRating}
                    onChange={(e) => handleRating(movie.Movie_id, parseInt(e.target.value))}
                    style={{
                      color:"white",
                      backgroundColor: "black",
                      padding: "5px",
                      fontSize: "16px",
                      borderRadius: "5px",
                      marginTop: "5px",
                      width: "100%",
                    }}
                  >
                    <option value="" disabled>Rate Movie</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}/10
                      </option>
                    ))}
                  </select>
                </div>

                <p><strong>⭐ IMDB Rating:</strong> {movie.ratings ? movie.ratings.toFixed(1) : "N/A"}</p>
                <p><strong>🌍 Language:</strong> {movie.original_language?.toUpperCase() || "Unknown"}</p>
                <p><strong>📏 Duration:</strong> {movie.duration_minutes || "Unknown"} min</p>
                <p><strong>🕒 Release Date:</strong> {new Date(movie.release_date).toISOString().split("T")[0].replace(/-/g, ":")}</p>
                <p><strong>🎭 Genres:</strong> {movie.Genres}</p>
              </div>
            );
          })
        ) : !loading ? (
          <p>No movies found.</p>
        ) : null}
      </div>

      <div ref={sentinelRef} style={{ height: "20px" }}></div>

      {loading && <p className="loading-text">Loading...</p>}
      {loadingMore && <p className="loading-text">Loading more...</p>}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
    </div>
  );
}

export default SearchResults;