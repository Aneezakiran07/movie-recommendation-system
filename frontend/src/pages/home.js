import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaHeart } from "react-icons/fa";  // ✅ Import Icons
import "./home.css";

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/movies/top-rated");
        setMovies(response.data);
      } catch (err) {
        setError("Failed to load movies. Check API.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedMovies();
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
              {/* ✅ Default Image */}
              <img 
                src={"/images/default.jpg"}  
                alt={movie.title} 
              />

              {/* ✅ Movie Title */}
              <h2>{movie.title}</h2>

              {/* ✅ Rating & Like Section */}
              <div className="movie-info">
                <span className="like-btn">
                  <FaHeart color="red" size={20} /> {/* ❤️ Like Icon */}
                </span>
                <span className="rating">
                  <FaStar color="yellow" size={20} /> {movie.vote_average}  {/* ⭐ Rating */}
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
