import React from "react";
import { GatsbyImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

import Layout from "../components/Layout/index";
import Section from "../components/Elements/Section";

import useContentfulProjects from "../hooks/useContentfulProjects";

const Projects = () => {
  let projects = useContentfulProjects().sort(
    (a, b) => b.isFeatured - a.isFeatured || a.name.localeCompare(b.name)
  );

  return (
    <Layout page="projects">
      <Section name="Projects" headerClassName="text-center">
        <div className="mt-10 grid md:grid-cols-2 gap-y-6 gap-x-6 content-center">
          {projects.map((project) => {
            let skills = project?.skills.sort((a, b) =>
              a.name.localeCompare(b.name)
            );
            return (
              <div
                className="border-solid border-4 border-gold rounded-md"
                data-aos="fade-down"
              >
                <GatsbyImage
                  className="m-auto border-solid border-4 border-gold max-h-[500px]"
                  image={project?.hero?.gatsbyImage}
                />
                <div className="p-4">
                  <p className="font-bold text-red2 text-2xl">
                    {project?.name}
                    {project?.link ? (
                      <span className="ml-4">
                        <a href={project?.link}>
                          <FontAwesomeIcon
                            className="text-xl mt-5 text-red3 hover:text-red2 hover:scale-110 transition duration-150 ease-in"
                            icon={faUpRightFromSquare}
                          />
                        </a>
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xl mt-5">
                    {project?.description?.description}
                  </p>
                  <div className="flex flex-wrap justify-start font-xyz">
                    {skills.map((skill) => {
                      return (
                        <p className="text-sm xl:text-base mt-5 mr-5 text-[#3A030B] bg-[#F6C5CC] px-3 py-3 rounded-md">
                          {skill?.name}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </Layout>
  );
};

export default Projects;
