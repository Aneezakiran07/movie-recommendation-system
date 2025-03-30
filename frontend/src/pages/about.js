import React from "react";
import "./about.css"; // Create this file for styling

function About() {
  return (
    <div className="about-container">
      <h1>About Movie Recommendation System</h1>
      <p>
        Our Movie Recommendation System helps users find the best movies based on their preferences. 
        The system analyzes user choices, liked movies, and previous history to suggest the most relevant movies.
      </p>

      <h2>🔺 Features</h2>
      <ul>
        <li>🎬 Personalized Movie Recommendations</li>
        <li>❤️ Liked Movies Section</li>
        <li>🔍 Search for Movies by Title</li>
        <li>📌 View Detailed Movie Information</li>
        <li>👤 User Login & Sign-up</li>
      </ul>

      <h2>🔺 How to Use</h2>
      <p>
        🔍  Search for a movie using the search bar on the homepage.
        <br/>  
        ❤️  Like movies to get better recommendations.  
        <br/>
        🔑  Sign in / Sign up to save your preferences and get tailored recommendations.  
      </p>

      <h2>💡 Need Help?</h2>
      <p>For support or suggestions, contact us at <a href="mailto:support@movierecommendation.com">support@movierecommendation.com</a>.</p>
    </div>
  );
}

export default About;