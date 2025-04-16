import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userProfile.css"; // Import the CSS

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If not logged in, redirect to login page
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="user-profile-container">
      <h2 className="user-profile-heading">👤 User Profile</h2>
      <div className="user-profile-card">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;