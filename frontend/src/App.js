import { useEffect, useState } from "react";
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  return (
    <div className="App">
      <h1>🎬 Movie List</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.Movie_id}>
            <strong>{movie.title}</strong> ({movie.release_date?.split('T')[0]}) - ⭐ {movie.vote_average}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
