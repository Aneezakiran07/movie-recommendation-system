import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import About from "./pages/about";
import Home from "./pages/home";
import SearchResults from "./pages/searchResults";
import MovieDetails from "./pages/movieDetails";
import Login from "./pages/logIn";
import UserProfile from "./pages/userProfile";

// 🔥 Import and wrap with AuthProvider
import { AuthProvider } from "./context/AuthContext";
import SignUp from './pages/signUp';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div id="root">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search-results" element={<SearchResults />} />
              <Route path="/about" element={<About />} />
              <Route path="/movie/:id/:title" element={<MovieDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/signup" element={<SignUp />} />

            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;