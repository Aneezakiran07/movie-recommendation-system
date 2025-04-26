import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./recommendedList.css";

const API_KEY = "3c939f5bc9657293ebed62fbdd049833";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const RecommendedList = () => {
  const navigate = useNavigate();
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState(new Set());
  const [watchlist, setWatchlist] = useState(new Set());
  const [userRatings, setUserRatings] = useState({});

  const fetchPosterFromTMDB = useCallback(async (title) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
      );
      const result = await response.json();
      const movie = result.results[0];
      return movie?.poster_path || null;
    } catch (error) {
      console.error('Error fetching poster from TMDB:', error);
      return null;
    }
  }, []);

  const fetchRecommendedMovies = useCallback(async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/movies/recommend/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch recommended movies');
      const data = await response.json();

      const moviesWithPoster = await Promise.all(
        data.map(async (movie) => {
          const posterPath = await fetchPosterFromTMDB(movie.title);
          return { ...movie, posterPath };
        })
      );

      setRecommendedMovies(moviesWithPoster);
    } catch (error) {
      console.error('Error fetching recommended movies:', error);
    }
  }, [fetchPosterFromTMDB]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const userData = JSON.parse(storedUser);
      fetchRecommendedMovies(userData.user_id);
    }
  }, [navigate, fetchRecommendedMovies]);

  const handleLikeClick = async (e, movieId) => {
    e.stopPropagation();
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

  const handleAddToWatchlist = async (e, movieId) => {
    e.stopPropagation();
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

  const handleRating = async (e, movieId, rating) => {
    e.stopPropagation();
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
        toast.success("Rated successfully!");
      } else {
        toast.error("You already rated this movie!");
      }
    } catch (err) {
      console.error("Error rating movie:", err);
      toast.error("Failed to rate the movie!");
    }
  };

  return (
    <div className="recommended-page">
      <h1 className="recommended-title">Recommended For You</h1>
      <ToastContainer 
        position="top-center" 
        autoClose={3000}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
      
      {recommendedMovies.length === 0 ? (
        <p className="recommended-empty">No recommended movies available.</p>
      ) : (
        <div className="recommended-movies-grid">
          {recommendedMovies.map((movie) => {
            const isLiked = likedMovies.has(movie.Movie_id);
            const isInWatchlist = watchlist.has(movie.Movie_id);
            const currentRating = userRatings[movie.Movie_id] || 0;

            return (
              <div
                key={movie.Movie_id}
                className="recommended-movie-card"
                onClick={() => navigate(`/movie/${movie.Movie_id}/${encodeURIComponent(movie.title)}`)}
                style={{ cursor: "pointer" }}
              >
                {movie.posterPath ? (
                  <img
                    src={`${TMDB_IMAGE_URL}${movie.posterPath}`}
                    alt={movie.title}
                    className="recommended-movie-poster"
                  />
                ) : (
                  <div className="recommended-no-poster">No Poster Found</div>
                )}

                {/* Movie Title - below poster, larger font */}
                <h2 
                  className="recommended-movie-title"
                  style={{
                    fontSize: "22px",    // Increased font size
                    marginTop: "10px",
                    textAlign: "center"
                  }}
                >
                  {movie.title}
                </h2>

                {/* Like and Watchlist Buttons */}
                <div 
                  className="recommended-movie-actions"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: "8px"
                  }}
                >
                  <button
                    className="heart-btn"
                    onClick={(e) => handleLikeClick(e, movie.Movie_id)}
                    style={{
                      fontSize: "30px",
                      marginLeft: "10px",
                      color: isLiked ? "red" : "#ccc",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    ❤️
                  </button>

                  <button
                    className="watchlist-btn"
                    onClick={(e) => handleAddToWatchlist(e, movie.Movie_id)}
                    style={{
                      fontSize: "30px",
                      marginRight: "10px",
                      color: isInWatchlist ? "red" : "#ccc",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    📋
                  </button>
                </div>

                {/* Rating Section */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginTop: "10px", textAlign: "center" }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={(e) => handleRating(e, movie.Movie_id, star)}
                      style={{
                        cursor: "pointer",
                        color: currentRating >= star ? "gold" : "#ccc",
                        fontSize: "24px",
                      }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>

                {/* Movie Info */}
                <div style={{ marginTop: "8px", textAlign: "center" }}>
                  <p><strong>⭐ IMDB Rating:</strong> {movie.ratings ? movie.ratings.toFixed(1) : "N/A"}</p>
                  <p><strong>🌍 Language:</strong> {movie.original_language?.toUpperCase() || "Unknown"}</p>
                  <p><strong>📏 Duration:</strong> {movie.duration_minutes ? `${movie.duration_minutes} min` : "Unknown"}</p>
                  <p><strong>🕒 Release Date:</strong> {new Date(movie.release_date).toISOString().split("T")[0].replace(/-/g, ":")}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendedList;