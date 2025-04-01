import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";  
import "./home.css";

const BACKEND_URL = "http://localhost:4000/api/movies/top-rated";
const API_KEY = "3c939f5bc9657293ebed62fbdd049833";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMoviesWithPosters = async () => {
      try {
        const response = await axios.get(BACKEND_URL);
        const moviesData = response.data;

        const moviesWithPosters = await Promise.all(
          moviesData.map(async (movie) => {
            if (movie.poster) {
              return movie;
            }
            try {
              const tmdbResponse = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.title)}`
              );
              const movieData = tmdbResponse.data.results[0] || {};
              return { 
                ...movie, 
                poster: movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : "/images/default.jpg"
              };
            } catch (err) {
              console.error(`❌ Failed to fetch poster for "${movie.title}":`, err);
              return { ...movie, poster: "/images/default.jpg" };
            }
          })
        );

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

              <h2 className="movie-title">{movie.title}</h2>

              <p className="movie-extra">
              <br /><br />
              <span>Release Date: </span> 
<strong>{new Date(movie.release_date).toISOString().split("T")[0].replace(/-/g, ":")}</strong><br />
                <span>🌍Language: </span> <strong>{(movie.original_language || "N/A").toUpperCase()}</strong> <br />
                <span>Rating: </span> <FaStar color="yellow" size={16} /> <strong>{movie.vote_average}</strong> <br />
                <span>Duration: </span> <strong>{movie.duration_minutes}</strong> min
              </p>
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