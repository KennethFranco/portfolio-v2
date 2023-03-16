import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => (
  <footer className="text-center justify-center font-abc py-9 bg-cream">
    <p>Developed by Ken Franco</p>
    <a
      className="hover:text-red1"
      href="https://www.linkedin.com/in/kenneth-laurenz-franco-162b94200/"
    >
      <FontAwesomeIcon className="mr-5" icon={faLinkedin} />
    </a>

    <a className="hover:text-red1" href="https://github.com/KennethFranco">
      <FontAwesomeIcon icon={faGithub} />
    </a>
  </footer>
);

export default Footer;
