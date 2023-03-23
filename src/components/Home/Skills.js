import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToolbox } from "@fortawesome/free-solid-svg-icons";
import { faReact, faSquareJs } from "@fortawesome/free-brands-svg-icons";

import Section from "../Elements/Section";

import useContentfulSkillCategories from "./hooks/useContentfulSkillCategories";
import useContentfulSkills from "./hooks/useContentfulSkills";

const Skills = () => {
  let skillCategories = useContentfulSkillCategories().sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  let skills = useContentfulSkills().sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <Section name="Home Skills">
      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 lg:gap-x-16 gap-y-12">
        {skillCategories.map((skillCategory) => {
          return (
            <div
              className="border-8 border-solid border-gold px-11 py-16 relative rounded-md"
              data-aos="fade-down"
            >
              <FontAwesomeIcon
                className="absolute top-[-25px]  text-red3 text-5xl bg-cream"
                icon={
                  skillCategory?.name === "Frameworks"
                    ? faReact
                    : skillCategory?.name === "Programming Languages"
                    ? faSquareJs
                    : faToolbox
                }
              />

              <p className="text-red2 font-bold text-2xl text-center mb-10">
                {skillCategory?.name}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {skills
                  ?.filter((skill) => {
                    return skill?.category?.name === skillCategory?.name;
                  })
                  .map((skill) => {
                    return (
                      <div>
                        <p className="text-[#3A030B] bg-[#F6C5CC] px-3 py-3 rounded-md font-xyz">
                          {skill?.name}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default Skills;
