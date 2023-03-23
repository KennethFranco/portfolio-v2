import React from "react";
import { renderRichText } from "gatsby-source-contentful/rich-text";

import { contentfulOptions } from "../../utils/contentfulRichTextFormatting";
import useContentfulSections from "../../hooks/useContentfulSections";

const Section = ({ children, name, headerClassName }) => {
  let sections = useContentfulSections();

  let currentSection = sections?.filter((section) => {
    return section?.name === name;
  })[0];

  return (
    <div
      className="font-abc px-8 py-16 xl:px-32 xl:py-20 bg-cream"
      data-aos="fade-down"
    >
      <p className={`text-4xl text-red3 font-extrabold ${headerClassName}`}>
        {currentSection?.header}
      </p>
      {currentSection?.subheader ? (
        <p className="text-3xl ">{currentSection?.subheader}</p>
      ) : null}

      {currentSection?.body ? (
        <p className="text-xl text-justify xl:text-left mt-5 grid gap-4">
          {renderRichText(currentSection?.body, contentfulOptions)}
        </p>
      ) : null}

      {children}
    </div>
  );
};

export default Section;
