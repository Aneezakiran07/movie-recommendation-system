import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './likeList.css';
import { FaTrash } from 'react-icons/fa';

const API_KEY = "3c939f5bc9657293ebed62fbdd049833";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const LikeList = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);

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

  const fetchLikeList = useCallback(async (userId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/likes/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch Likelist');
      const data = await response.json();

      const moviesWithPoster = await Promise.all(
        data.map(async (movie) => {
          const posterPath = await fetchPosterFromTMDB(movie.title);
          return {
            Movie_id: movie.Movie_id,
            title: movie.title,
            description: movie.description,
            ratings: movie.ratings,
            original_language: movie.original_language,
            duration_minutes: movie.duration_minutes,
            release_date: movie.release_date,
            Genres: movie.Genres,
            posterPath: posterPath,
          };
        })
      );

      setMovies(moviesWithPoster);
    } catch (error) {
      console.error('Error fetching likelist:', error);
    }
  }, [fetchPosterFromTMDB]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchLikeList(userData.user_id);
    }
  }, [navigate, fetchLikeList]);

  const handleDelete = async (movieId) => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:4000/api/likes/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, movie_id: movieId }),
      });

      if (response.ok) {
        setMovies((prevMovies) => prevMovies.filter((m) => m.Movie_id !== movieId));
      } else {
        console.error('Failed to delete movie');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <div className="likelist-page">
      <h1 className="likelist-title">My Liked Movies List</h1>
      {movies.length === 0 ? (
        <p className="likelist-empty">No movies found in your Likelist.</p>
      ) : (
        <div className="likelist-movies-grid">
          {movies.map((movie) => (
            <div
              key={movie.Movie_id}
              className="likelist-movie-card"
              onClick={() => navigate(`/movie/${movie.Movie_id}/${encodeURIComponent(movie.title)}`)}
              style={{ cursor: "pointer" }}
            >
              {movie.posterPath ? (
                <img
                  src={`${TMDB_IMAGE_URL}${movie.posterPath}`}
                  alt={movie.title}
                  className="likelist-movie-poster"
                />
              ) : (
                <div className="likelist-no-poster">No Poster Found</div>
              )}
              <FaTrash
                className="likelist-delete-icon"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click when trash clicked
                  handleDelete(movie.Movie_id);
                }}
                title="Delete from Likelist"
              />
              <h2 className="likelist-movie-title">{movie.title}</h2>
              <p><strong>⭐ IMDB Rating:</strong> {movie.ratings ? movie.ratings.toFixed(1) : "N/A"}</p>
              <p><strong>🌍 Language:</strong> {movie.original_language?.toUpperCase() || "Unknown"}</p>
              <p><strong>📏 Duration:</strong> {movie.duration_minutes ? `${movie.duration_minutes} min` : "Unknown"}</p>
              <p><strong>🕒 Release Date:</strong> {new Date(movie.release_date).toISOString().split("T")[0].replace(/-/g, ":")}</p>
              <p><strong>🎭 Genres:</strong> {movie.Genres}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikeList;