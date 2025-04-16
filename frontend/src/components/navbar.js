import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);  // Track logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by retrieving from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set the logged-in user
    }
  }, []); // Empty array ensures this effect runs once after the component mounts

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?title=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);  // Clear the user state
    navigate("/");  // Redirect to home after logout
    window.location.reload();  // Force page refresh to update Navbar
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/recommended" className="nav-item">Recommended For You</Link>
        <Link to="/liked" className="nav-item">Liked Movies</Link>
        <Link to="/watchlist" className="nav-item">Watchlist</Link>
        <Link to="/about" className="nav-item">About</Link>

        {user ? (
          <>
            <Link to="/profile" className="nav-item">Profile</Link>
            <button onClick={handleLogout} className="nav-item logout-button">Logout</button>
          </>
        ) : (
          <button onClick={handleLoginClick} className="nav-item login-button">Sign In</button>
        )}
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