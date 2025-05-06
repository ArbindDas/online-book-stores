import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="footer" id='footer'>
      <div className="footer-container">
        <div className="footer-logo-desc">
          <div className="logo">
            <span role="img" aria-label="icon">📸</span> CAPTURE
          </div>
          <p>
          As the day is around the corner, students might be looking forward to participating in related competitions and activities. 
          </p>
          <p>&copy;Copyright 2019. Designed by jsrGroups ™</p>
        </div>

       
        <div className="footer-links">
         
          <div className="footer-section">
            <h4>Home</h4>
            <ul>
              <li><a href="#">Collections</a></li>
              <li><a href="#">New Item</a></li>
              <li><a href="#">Latest</a></li>
              <li><a href="#">Services</a></li>
            </ul>
          </div>

         
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#">New Arrival</a></li>
              <li><a href="#">Oldest</a></li>
              <li><a href="#">Premium</a></li>
            </ul>
          </div>

          
          <div className="footer-section">
            <h4>About Us</h4>
            <ul>
              <li><a href="#">Contact Form</a></li>
              <li><a href="#">Email Us</a></li>
              <li><a href="#">Number</a></li>
              <li><a href="#">Customers Feedback</a></li>
            </ul>
          </div>

         
          <div className="footer-section">
            <h4>Privacy & Term</h4>
            <ul>
              <li><a href="#">Community</a></li>
              <li><a href="#">Guidelines</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </div>
        </div>

     
        <div className="footer-social">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
