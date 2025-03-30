import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaHeart } from "react-icons/fa";  
import "./home.css";

const API_KEY = "3c939f5bc9657293ebed62fbdd049833";  
const BACKEND_URL = "http://localhost:4000/api/movies/top-rated";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMoviesWithPosters = async () => {
      try {
        // 🔹 Step 1: Fetch movies from your backend
        const backendResponse = await axios.get(BACKEND_URL);
        const moviesFromBackend = backendResponse.data; // These contain titles but no posters
  
        console.log("🎥 Backend Movies:", moviesFromBackend); // Debugging
  
        // 🔹 Step 2: Fetch posters from TMDB using movie titles
        const moviesWithPosters = await Promise.all(
          moviesFromBackend.map(async (movie) => {
            try {
              const tmdbResponse = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.title)}`
              );
  
              console.log(`📌 TMDB Response for "${movie.title}":`, tmdbResponse.data); // Debugging
  
              if (tmdbResponse.data.results.length === 0) {
                console.warn(`⚠ No results for: ${movie.title}`);
              }
  
              const posterPath = tmdbResponse.data.results.length > 0
                ? `https://image.tmdb.org/t/p/w500${tmdbResponse.data.results[0].poster_path}`
                : "/images/default.jpg";  // Fallback image
  
              return { ...movie, poster: posterPath };
            } catch (err) {
              console.error(`❌ Failed to fetch poster for "${movie.title}":`, err);
              return { ...movie, poster: "/images/default.jpg" };
            }
          })
        );
  
        // 🔹 Step 3: Update state
        setMovies(moviesWithPosters);
      } catch (err) {
        console.error("❌ Error fetching movies:", err);
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchMoviesWithPosters();
  }, []);

  if (loading) return <h2 className="loading-text">Loading...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div className="home-container">
      <h1>🎬 Top Rated Movies</h1>
      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={movie.poster} alt={movie.title} />

              <h2>{movie.title}</h2>

              <div className="movie-info">
                <span className="like-btn">
                  <FaHeart color="red" size={20} />
                </span>
                <span className="rating">
                  <FaStar color="yellow" size={20} /> {movie.vote_average}
                </span>
              </div>
            </div>
          ))
        ) : (
          <h2>No movies found.</h2>
        )}
      </div>
    </div>
  );
}

export default Home;