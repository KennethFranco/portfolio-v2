import React, { useState } from "react";
import { Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";

import upa from "../../../static/images/upa.png";
import * as styles from "./utils/navbar.module.css";

const Navbar = () => {
  const [isMobileNavbarOpen, setIsMobileNavbarOpen] = useState(false);
  const trigger = () => {
    let slider = document.getElementById("slider");
    slider.classList.toggle(`${styles.slideDown}`);
    setIsMobileNavbarOpen(!isMobileNavbarOpen);
  };

  return (
    <nav
      className="font-abc px-8 py-5 bg-cream"
      role="navigation"
      aria-label="Main"
    >
      <div className="flex justify-between h-6">
        <Link
          activeClassName="text-red3"
          className="font-semibold text-red3 hover:text-red2"
          to="/"
        >
          <div className="flex">
            <img className="w-[20px]" src={upa} alt="upa" />
            <p className="ml-4">ken</p>
          </div>
        </Link>

        {!isMobileNavbarOpen ? (
          <div className="hidden md:flex">
            <Link
              activeClassName="text-red3"
              className="hover:text-red2 duration-200"
              to="/about"
            >
              <p className="mx-12">About</p>
            </Link>

            <Link
              activeClassName="text-red3"
              className="hover:text-red2 duration-200"
              to="/projects"
            >
              <p className="mx-12">Projects</p>
            </Link>
            <Link
              activeClassName="text-red3"
              className="hover:text-red2 duration-200"
              to="/contact"
            >
              <p className="mx-12">Contact Me</p>
            </Link>
          </div>
        ) : null}

        <div className={`block ${isMobileNavbarOpen ? `` : "md:hidden"}`}>
          <button onClick={trigger}>
            <FontAwesomeIcon icon={isMobileNavbarOpen ? faX : faBars} />
          </button>
        </div>
      </div>

      <div id="slider" className={`${styles.slideUp}`}>
        <div className="text-center">
          <Link
            activeClassName="text-red3"
            className="hover:text-red2 duration-200"
            to="/about"
          >
            <p className="mx-12 my-2">About</p>
          </Link>

          <Link
            activeClassName="text-red3"
            className="hover:text-red2 duration-200"
            to="/projects"
          >
            <p className="mx-12 my-2">Projects</p>
          </Link>
          <Link
            activeClassName="text-red3"
            className="hover:text-red2 duration-200"
            to="/contact"
          >
            <p className="mx-12 my-2">Contact Me</p>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
