import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => (
  <footer className="text-center font-abc py-9 bg-red3 text-cream text-xl">
    <p className="mb-5">© 2023 Ken Franco</p>

    <div className="flex justify-center">
      <a
        className="hover:text-gold"
        href="https://www.linkedin.com/in/kenneth-laurenz-franco-162b94200/"
      >
        <FontAwesomeIcon className="mr-5" icon={faLinkedin} />
      </a>

      <a className="hover:text-gold" href="https://github.com/KennethFranco">
        <FontAwesomeIcon className="mr-5" icon={faGithub} />
      </a>

      <a
        className="hover:text-gold"
        href="mailto:kennethlaurenzfranco@gmail.com"
      >
        <FontAwesomeIcon icon={faEnvelope} />
      </a>
    </div>
  </footer>
);

export default Footer;
