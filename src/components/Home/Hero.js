import React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import Typewriter from "typewriter-effect";
import "animate.css";

import Button from "../Elements/Button";

const Hero = () => {
  return (
    <div className="font-abc bg-[#DFC18F] py-12 px-0 xl:px-28 flex-none xl:flex text-center xl:text-left animate__animated animate__fadeInDown">
      <StaticImage
        className="w-1/3 xl:w-full max-w-[300px]"
        src="../../../static/images/upa.png"
        quality={100}
      />
      <div className="ml-0 xl:ml-32">
        <p className="text-5xl font-extrabold text-red3 mt-6 xl:mt-0">
          Hi there!
        </p>
        <p className="text-red2 text-3xl">
          I'm <span className="font-semibold text-red2">Ken.</span>
        </p>
        <p className="font-xyz italic text-cream">/ kɛn /</p>

        <div className="mt-14 font-xyz text-xl">
          <Typewriter
            skipAddStyles
            options={{
              strings: [
                "Full-Stack Web Developer",
                "MIS Undergraduate",
                "Tech Nerd",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>

        <p className="text-xl px-4 xl:px-0">
          I'm an undergraduate student majoring in BS Management Information
          Systems at the Ateneo de Manila University. As an aspiring Software
          Engineer, I'm eager to build meaningful experiences for people through
          the use of today's technology.
        </p>

        <div className="flex justify-center xl:justify-start mt-7 text-center">
          <Link to="/about">
            <Button className="px-3 py-3 mr-5" variant="primary">
              About Me
            </Button>
          </Link>

          <a
            target="_blank"
            href="https://calendly.com/kennethlaurenzfranco/30min"
          >
            <Button className="px-3 py-3" variant="secondary">
              Schedule a meeting
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
