import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        {/* Privacy Policy (Left Side) */}
        <div className="footer-section">
          <h3>Privacy Policy</h3>
          <p>We value your privacy and ensure that your data remains secure. 
            We do not share your personal information without your consent. 
            Any data collected is used solely to enhance your experience with our 
            movie recommendation system. We implement strong security measures to 
            protect your information, and we do not sell or trade your data to third 
            parties.</p>
        </div>

        {/* Terms & Conditions (Middle) */}
        <div className="footer-section">
          <h3>Terms & Conditions</h3>
          <p>By using our movie recommendation system, you agree to comply with our terms and conditions. You are responsible for ensuring that your use of the service does not violate any laws. We reserve the right to modify, suspend, or terminate access to the service at any time. Please use the service responsibly and in accordance with all applicable laws and guidelines.</p>
        </div>

        {/* Support & Suggestions (Right Side) */}
        <div className="footer-section">
          <h3>Support & Suggestions</h3>
          <p>For any support or suggestions, feel free to reach out to our team. We are here to assist you with any issues you encounter and appreciate any feedback you provide to improve our service.
            If you need support or have suggestions, contact us at <a href="mailto:support@movierecommendation.com">support@movierecommendation.com</a>.</p>
        </div>
      </div>

      <p className="footer-bottom">© 2025 Movie Recommendation System. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
