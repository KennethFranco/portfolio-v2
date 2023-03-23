import React from "react";
import Typewriter from "typewriter-effect";
import { renderRichText } from "gatsby-source-contentful/rich-text";

import useContentfulHero from "../../hooks/useContentfulHero";
import { contentfulOptions } from "../../utils/contentfulRichTextFormatting";

const Hero = ({ name, children, bodyClassName }) => {
  let currentHero = useContentfulHero()?.filter((hero) => {
    return hero?.name === name;
  })[0];

  return (
    <div className="font-abc bg-[#DFC18F] py-12 px-0 xl:px-28 flex-none xl:flex text-center xl:text-left animate__animated animate__fadeInLeft">
      <img
        className="w-1/3 m-auto xl:w-full max-w-[300px]"
        alt="heroImage"
        src={currentHero?.heroImage?.file?.url}
      />

      <div className="ml-0 xl:ml-32">
        {currentHero?.header ? (
          <p
            className={`text-5xl font-extrabold text-red3 mt-6 xl:mt-0 ${
              currentHero?.subheader ? "" : "mb-4"
            }`}
          >
            {currentHero?.header}
          </p>
        ) : null}

        {currentHero?.subheader ? (
          <p className="text-red2 text-3xl">{currentHero?.subheader}</p>
        ) : null}

        {currentHero?.subheader2 ? (
          <p className="font-xyz italic text-cream">
            {currentHero?.subheader2}
          </p>
        ) : null}

        {currentHero?.hasExtraElements &&
        currentHero?.name === "Home Page Hero" ? (
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
        ) : null}

        {currentHero?.body ? (
          <p className={`text-xl px-4 xl:px-0 grid gap-4 ${bodyClassName}`}>
            {renderRichText(currentHero?.body, contentfulOptions)}
          </p>
        ) : null}

        {children}
      </div>
    </div>
  );
};

export default Hero;
