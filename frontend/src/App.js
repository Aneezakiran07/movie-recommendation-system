import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import About from "./pages/about";
import Home from "./pages/home"; // Import Home page

function App() {
  return (
    <Router>
      <div id="root">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home page */}
            <Route path="/about" element={<About />} /> {/* About page */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
