import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./movieDetails.css"; // Correct path to the CSS file

const API_KEY = "3c939f5bc9657293ebed62fbdd049833";

function MovieDetails() {
  const { id, title } = useParams();
  console.log("Movie ID & Title:", id, title);
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Fetch movie details from backend
        const backendResponse = await fetch(`http://localhost:4000/api/movies/${id}`);
        if (!backendResponse.ok) throw new Error("Failed to fetch movie details");
        const movieData = await backendResponse.json();

        // Fetch movie from TMDB
        const tmdbResponse = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
        );
        if (!tmdbResponse.ok) throw new Error("Failed to fetch movie poster from TMDB");
        const tmdbData = await tmdbResponse.json();

        if (tmdbData.results.length === 0) throw new Error("Movie not found on TMDB");
        const tmdbMovie = tmdbData.results[0];

        // Fetch cast & crew details
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${tmdbMovie.id}/credits?api_key=${API_KEY}`
        );
        if (!creditsResponse.ok) throw new Error("Failed to fetch movie credits from TMDB");
        const creditsData = await creditsResponse.json();

        // Extract relevant info
        const actors = creditsData.cast.slice(0, 5).map(actor => ({
          name: actor.name,
          character: actor.character,
        })); // Get top 5 actors with their character names
        const producers = creditsData.crew.filter(member => member.job === "Producer").map(prod => prod.name);
        const writers = creditsData.crew.filter(member => member.job === "Writer" || member.department === "Writing").map(writer => writer.name);

        setMovie({
          ...movieData,
          poster_path: tmdbMovie.poster_path,
        });
        setCast(actors);
        setCrew({ producers, writers });
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, title]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="movie-details-container">
      <h2>{movie.title}</h2>
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={movie.title}
        className="movie-poster"
      />
      <p><strong>Overview:</strong> {movie.description || "No description available."}</p>
      <p><strong>⭐ Rating:</strong> {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</p>
      <p><strong>🌍 Language:</strong> {movie.original_language ? movie.original_language.toUpperCase() : "Unknown"}</p>
      <p><strong>📏 Duration:</strong> {movie.duration_minutes ? movie.duration_minutes : "Unknown"} min</p>
      <p><strong>📅 Release Date:</strong> {movie.release_date ? movie.release_date : "Unknown"}</p>

      {/* Cast and Crew */}
      <div className="movie-credits">
        <div className="credit-column">
          <h3>🎭 Top Cast:</h3>
          {cast.length ? (
            cast.map((actor, index) => (
              <p key={index}><strong>{actor.name}</strong> as {actor.character}</p>
            ))
          ) : (
            <p>Unknown</p>
          )}
        </div>

        <div className="credit-column">
          <h3>🎬 Producers:</h3>
          {crew.producers.length ? (
            crew.producers.map((producer, index) => (
              <p key={index}>{producer}</p>
            ))
          ) : (
            <p>Unknown</p>
          )}
        </div>

        <div className="credit-column">
          <h3>✍️ Writers:</h3>
          {crew.writers.length ? (
            crew.writers.map((writer, index) => (
              <p key={index}>{writer}</p>
            ))
          ) : (
            <p>Unknown</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;