import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToolbox } from "@fortawesome/free-solid-svg-icons";
import { faReact, faSquareJs } from "@fortawesome/free-brands-svg-icons";

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
    <div className="px-32 py-32 bg-cream font-abc">
      <p className="text-4xl font-extrabold text-red3">Skills</p>
      <p className="text-2xl">
        Here are some of the skills lorem ipsum, lorem ipsum
      </p>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 lg:gap-x-16 gap-y-12">
        {skillCategories.map((skillCategory) => {
          return (
            <div className="border-8 border-solid border-gold px-11 py-16 relative">
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
                {skills.map((skill) => {
                  if (skill?.category?.name === skillCategory?.name) {
                    return (
                      <p className="text-[#3A030B] bg-[#F6C5CC] px-3 py-3 rounded-md">
                        {skill?.name}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
        {/* <div className="border-8 border-solid border-gold px-11 py-16">
          <p className="text-red2 font-bold text-2xl text-center mb-10">
            Programming Languages
          </p>
          <span className="text-[#3A030B] bg-[#F6C5CC] px-3 py-3 rounded-md">
            JavaScript
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default Skills;
