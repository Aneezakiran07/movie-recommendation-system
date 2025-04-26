import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SplashScreen from "./components/splashScreen";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import About from "./pages/about";
import Home from "./pages/home";
import SearchResults from "./pages/searchResults";
import MovieDetails from "./pages/movieDetails";
import Login from "./pages/logIn";
import UserProfile from "./pages/userProfile";
import { AuthProvider } from "./context/AuthContext";
import SignUp from './pages/signUp';
import WatchList from "./pages/watchList";
import LikeList from "./pages/likeList";
import RecommendedList from "./pages/recommendedList";
import RatedList from "./pages/ratingList";

function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(() => {
    // This function runs ONLY once on first load
    const splashShown = sessionStorage.getItem("splashShown");
    return splashShown ? false : true; // Show splash if not already shown
  });

  useEffect(() => {
    if (isSplashVisible) {
      const timer = setTimeout(() => {
        setIsSplashVisible(false);
        sessionStorage.setItem("splashShown", "true"); // Mark splash as shown
      }, 4000); // Show splash for 3 seconds
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [isSplashVisible]);

  return (
    <AuthProvider>
      <Router>
        <div id="root">
          {isSplashVisible ? (
            <SplashScreen />
          ) : (
            <>
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
                  <Route path="/watchlist" element={<WatchList />} />
                  <Route path="/liked" element={<LikeList />} />
                  <Route path="/recommended" element={<RecommendedList />} />
                  <Route path="/ratingList" element={<RatedList />} />
                </Routes>
              </div>
              <Footer />
            </>
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;