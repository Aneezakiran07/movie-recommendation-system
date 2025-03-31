import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate
import "./navbar.css"; // Import CSS file

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Create a navigate function

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) { // Avoid empty searches
      navigate(`/search-results?title=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/recommended" className="nav-item">Recommended For You</Link>
        <Link to="/liked" className="nav-item">Liked Movies</Link>
        <Link to="/watchlist" className="nav-item">Watchlist</Link>
        <Link to="/signin" className="nav-item">Sign In/Sign Up</Link>
        <Link to="/about" className="nav-item">About</Link>
      </div>
        
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search Movie by Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </nav>
  );
}

export default Navbar;