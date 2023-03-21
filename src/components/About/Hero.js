import React from "react";
import { StaticImage } from "gatsby-plugin-image";

import Button from "../Elements/Button";

const Hero = () => {
  return (
    <div className="flex-none lg:flex gap-12 bg-gold lg:px-20 px-10 py-20 font-abc text-center lg:text-left">
      <div>
        <StaticImage
          className="w-2/3 lg:w-full"
          src="../../../static/images/about.png"
        />
      </div>

      <div className="font-abc">
        <p className="text-red3 text-4xl font-extrabold mt-5 lg:mt-0">
          tagline god CEO
        </p>
        <p className="text-xl mt-5 text-justify lg:text-left">
          Hi again! My name is Kenneth Laurenz Franco, but you can just call me
          Ken. I'm currently an undergraduate student at the Ateneo de Manila
          University, majoring in BS Management Information Systems while taking
          up Double Specialization in both Data Science and Enterprise Systems.
        </p>

        <p className="text-xl my-5 text-justify lg:text-left">
          Web Development has grown into one of my biggest passions especially
          in the wide field of tech. I've been amazed by the impact and value
          things on the internet can actually bring to people.
        </p>

        <p className="text-xl mt-5 text-justify lg:text-left">
          If you wish to learn even more about me, feel free to explore this
          page thoroughly, get a summarized version through my resume, or even
          contact me!
        </p>

        <div className="flex mt-10 justify-center lg:justify-start">
          <Button className="mr-5" variant="primary">
            Download Resume
          </Button>
          <Button variant="secondary">Contact Me</Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
