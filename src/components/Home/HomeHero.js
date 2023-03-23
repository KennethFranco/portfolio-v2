import React from "react";
import { Link } from "gatsby";

import Hero from "../Elements/Hero";
import Button from "../Elements/Button";

const HomeHero = () => {
  return (
    <Hero name="Home Page Hero" bodyClassName="text-justify">
      <div className="flex justify-center xl:justify-start mt-7 text-center">
        <Link to="/about">
          <Button className="px-3 py-3 mr-5" variant="primary">
            About Me
          </Button>
        </Link>

        <a
          target="_blank"
          href="https://calendly.com/kennethlaurenzfranco/30min"
          rel="noreferrer"
        >
          <Button variant="secondary">Schedule a meeting</Button>
        </a>
      </div>
    </Hero>
  );
};

export default HomeHero;
