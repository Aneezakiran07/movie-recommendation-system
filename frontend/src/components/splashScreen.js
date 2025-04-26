import React, { useEffect, useState } from "react";
import "./splashScreen.css";

const SplashScreen = ({ onFinish }) => {
  const [text, setText] = useState("");
  const [showTagline, setShowTagline] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fullText = "Next Watch"; // App name
  const typingSpeed = 100; // milliseconds between each letter
  const waitAfterCompletion = 3000; // 3 seconds after everything is shown

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      const taglineTimeout = setTimeout(() => {
        setShowTagline(true); // After app name is typed, show tagline
      }, 500);

      const finishTimeout = setTimeout(() => {
        if (onFinish) {
          onFinish();
        }
      }, waitAfterCompletion);

      return () => {
        clearTimeout(taglineTimeout);
        clearTimeout(finishTimeout);
      };
    }
  }, [currentIndex, fullText, onFinish]);

  return (
    <div className="splash-screen">
      <h1 className="splash-text">{text}</h1>
      <p className={`splash-tagline ${showTagline ? "show" : ""}`}>
        Find Your Next Favourite Movie
      </p>
    </div>
  );
};

export default SplashScreen;