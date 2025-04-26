import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search-results?title=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/recommended" className="nav-item">Recommended For You</Link>
        <Link to="/liked" className="nav-item">Liked Movies</Link>
        <Link to="/watchlist" className="nav-item">Watchlist</Link>
        <Link to="/ratinglist" className="nav-item">Rating List</Link>
        <Link to="/about" className="nav-item">About</Link>

        {user ? (
          <>
            <Link to="/profile" className="nav-item">Profile</Link>
            <button onClick={handleLogout} className="nav-item logout-button">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="nav-item login-button">Sign In</button>
<button onClick={() => navigate("/signup")} className="nav-item login-button">Sign Up</button>

          </>
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
