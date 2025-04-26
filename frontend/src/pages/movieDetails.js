import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./movieDetails.css";

const API_KEY = "3c939f5bc9657293ebed62fbdd049833";

function MovieDetails() {
  const { id, title } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState({ producers: [], writers: [] });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const backendRes = await fetch(`http://localhost:4000/api/movies/${id}`);
        if (!backendRes.ok) throw new Error("Failed to fetch movie details");
        const movieData = await backendRes.json();

        let poster_path = null;
        let castList = [];
        let producers = [];
        let writers = [];

        // Try to fetch from TMDB
        try {
          const tmdbRes = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
          );
          const tmdbData = await tmdbRes.json();

          if (tmdbData.results.length > 0) {
            const tmdbMovie = tmdbData.results[0];
            poster_path = tmdbMovie.poster_path;

            // Fetch cast and crew
            const creditsRes = await fetch(
              `https://api.themoviedb.org/3/movie/${tmdbMovie.id}/credits?api_key=${API_KEY}`
            );
            const creditsData = await creditsRes.json();

            castList = creditsData.cast.slice(0, 5).map(actor => ({
              name: actor.name,
              character: actor.character,
            }));

            producers = creditsData.crew
              .filter(member => member.job === "Producer")
              .map(prod => prod.name);

            writers = creditsData.crew
              .filter(member => member.job === "Writer" || member.department === "Writing")
              .map(writer => writer.name);
          }
        } catch (tmdbErr) {
          console.warn("TMDB fetch failed or movie not found. Falling back to backend data only.");
        }

        setMovie({ ...movieData, poster_path });
        setCast(castList);
        setCrew({ producers, writers });
      } catch (err) {
        setError(err.message);
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
      <p><strong>⭐ IMDB Rating:</strong> {movie.ratings ? movie.ratings.toFixed(1) : "N/A"}</p>
      <p><strong>🌍 Language:</strong> {movie.original_language?.toUpperCase() || "Unknown"}</p>
      <p><strong>📏 Duration:</strong> {movie.duration_minutes || "Unknown"} min</p>
      <p><strong>📅 Release Date:</strong> {movie.release_date || "Unknown"}</p>

      {(cast.length > 0 || crew.producers.length > 0 || crew.writers.length > 0) && (
        <div className="movie-credits">
          {cast.length > 0 && (
            <div className="credit-column">
              <h3>🎭 Top Cast:</h3>
              {cast.map((actor, index) => (
                <p key={index}><strong>{actor.name}</strong> as {actor.character}</p>
              ))}
            </div>
          )}

          {crew.producers.length > 0 && (
            <div className="credit-column">
              <h3>🎬 Producers:</h3>
              {crew.producers.map((producer, index) => (
                <p key={index}>{producer}</p>
              ))}
            </div>
          )}

          {crew.writers.length > 0 && (
            <div className="credit-column">
              <h3>✍️ Writers:</h3>
              {crew.writers.map((writer, index) => (
                <p key={index}>{writer}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MovieDetails;