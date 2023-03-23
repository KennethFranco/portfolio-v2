import React from "react";

import Button from "../Elements/Button";
import Hero from "../Elements/Hero";

const AboutHero = () => {
  return (
    <Hero name="About Hero" bodyClassName="text-justify">
      <div className="font-abc">
        <div className="flex mt-10 justify-center xl:justify-start">
          <a
            href="https://drive.google.com/file/d/1fAXP_CmSLW3Pr5BLncQ-Ao6pOdqCnIUb/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            <Button className="mr-5" variant="primary">
              Download CV
            </Button>
          </a>
        </div>
      </div>
    </Hero>
  );
};

export default AboutHero;
