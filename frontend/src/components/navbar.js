import { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css"; // Import CSS file

function Navbar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/recommended" className="nav-item">Recommended For You</Link>
        <Link to="/liked" className="nav-item">Liked Movies</Link>
        <Link to="/watchlist" className="nav-item">Watchlist</Link> {/* ➕ Added Watchlist */}
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