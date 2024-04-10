import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-social-media">
        <a href="https://twitter.com/NaviGradeCo" target="_blank">
          Twitter{" "}
        </a>
        <a> | </a>
        <a href="https://www.instagram.com/navigrade/" target="_blank">
          Instagram{" "}
        </a>
        <a> | </a>
        <a
          href="https://www.facebook.com/profile.php?id=61557645166638"
          target="_blank"
        >
          FaceBook{" "}
        </a>
        <a> | </a>
        <div>
          <a>© NaviGrade 2024 </a>
        </div>
        <div className="footer-email">
          <a href="mailto:navigradecontact@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
