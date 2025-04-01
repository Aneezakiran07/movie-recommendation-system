import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import About from "./pages/about";
import Home from "./pages/home"; // Import Home page
import SearchResults from "./pages/searchResults";
import MovieDetails from "./pages/movieDetails"; // Import MovieDetails page

function App() {
  return (
    <Router>
      <div id="root">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home page */}
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/about" element={<About />} /> {/* About page */}
            <Route path="/movie/:id/:title" element={<MovieDetails />} /> {/* Movie Details page */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;