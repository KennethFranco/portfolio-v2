import React, { useState } from "react";
import moment from "moment";

import Layout from "../components/Layout/index";
import Hero from "../components/About/Hero";
import ExperienceDrawer from "../components/About/ExperienceDrawer";

import useContentfulExperiences from "../components/About/hooks/useContentfulExperiences";
import useContentfulExperienceTypes from "../components/About/hooks/useContentfulExperienceTypes";

const About = () => {
  const [isProfessionalWorkDrawerOpen, setIsProfessionalWorkDrawerOpen] =
    useState(false);
  const [isEducationDrawerOpen, setIsEducationDrawerOpen] = useState(false);
  const [isStudentOrgDrawerOpen, setIsStudentOrgDrawerOpen] = useState(false);

  let experiences = useContentfulExperiences().sort(
    (a, b) => moment(b?.endDate) - moment(a?.endDate)
  );

  let experienceTypes = useContentfulExperienceTypes().sort(
    (a, b) => a?.orderOnWebsite - b?.orderOnWebsite
  );

  return (
    <Layout>
      <Hero />
      <div className="bg-cream px-5 md:px-14 py-14 font-abc">
        {experienceTypes.map((experienceType) => {
          return (
            <ExperienceDrawer
              className="mb-5"
              isProfessionalWorkDrawerOpen={isProfessionalWorkDrawerOpen}
              isEducationDrawerOpen={isEducationDrawerOpen}
              isStudentOrgDrawerOpen={isStudentOrgDrawerOpen}
              setIsProfessionalWorkDrawerOpen={setIsProfessionalWorkDrawerOpen}
              setIsEducationDrawerOpen={setIsEducationDrawerOpen}
              setIsStudentOrgDrawerOpen={setIsStudentOrgDrawerOpen}
              experiences={experiences.filter((experience) => {
                return experience?.type?.name === experienceType?.name;
              })}
              type={experienceType?.name}
              message={experienceType?.message?.message}
            />
          );
        })}
      </div>
    </Layout>
  );
};

export default About;
