import React from "react";
import { Link } from "gatsby";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faCalendarAlt,
  faCaretUp,
  faBriefcase,
  faSchool,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import { BLOCKS } from "@contentful/rich-text-types";
import { INLINES } from "@contentful/rich-text-types";

const ExperienceDrawer = ({
  className,
  type,
  isProfessionalWorkDrawerOpen,
  setIsProfessionalWorkDrawerOpen,
  isEducationDrawerOpen,
  setIsEducationDrawerOpen,
  isStudentOrgDrawerOpen,
  setIsStudentOrgDrawerOpen,
  experiences,
  message,
}) => {
  const options = {
    renderNode: {
      [BLOCKS.UL_LIST]: (node, children) => {
        return <ul className="list-disc ml-4">{children}</ul>;
      },
      [BLOCKS.OL_LIST]: (node, children) => {
        return <ol className="list-decimal ml-4">{children}</ol>;
      },
      [INLINES.HYPERLINK]: (node, children) => {
        return (
          <Link to={`${node?.data?.uri}`} className="text-red3 font-extrabold">
            {children}
          </Link>
        );
      },
    },
  };

  const checkActiveType = (action) => {
    switch (action) {
      case "openDrawer":
        switch (type) {
          case "Professional Work Experience":
            setIsProfessionalWorkDrawerOpen(!isProfessionalWorkDrawerOpen);
            break;

          case "Education":
            setIsEducationDrawerOpen(!isEducationDrawerOpen);
            break;

          case "Student Org Involvement":
            setIsStudentOrgDrawerOpen(!isStudentOrgDrawerOpen);
            break;

          default:
            break;
        }
        break;
      case "icons":
        let icon;
        switch (type) {
          case "Professional Work Experience":
            icon = faBriefcase;
            break;

          case "Education":
            icon = faGraduationCap;
            break;

          case "Student Org Involvement":
            icon = faSchool;
            break;

          default:
            icon = faBriefcase;
        }
        return icon;
      default:
        switch (type) {
          case "Professional Work Experience":
            return isProfessionalWorkDrawerOpen;

          case "Education":
            return isEducationDrawerOpen;

          case "Student Org Involvement":
            return isStudentOrgDrawerOpen;

          default:
        }
    }
  };

  return (
    <div
      className={`border-solid border-4 rounded-md border-gold px-8 py-8 ${className}`}
      data-aos="fade-down"
    >
      <div
        className="flex-none lg:flex justify-between group text-center lg:text-left hover:cursor-pointer"
        onClick={() => checkActiveType("openDrawer")}
        role="button"
        tabIndex={0}
        onKeyDown={() => checkActiveType("openDrawer")}
      >
        <div>
          <p className="text-4xl font-extrabold text-red3 group-hover:text-red2 duration-150 ease-in">
            <span className="mr-5">
              <FontAwesomeIcon icon={checkActiveType("icons")} />
            </span>
            {type}
          </p>
          <p className="text-xl mt-2">{message}</p>
        </div>

        <FontAwesomeIcon
          className={`flex-end text-red3 group-hover:text-red2 duration-150 ease-in text-5xl lg:text-7xl ${
            checkActiveType() ? "" : "fa-rotate-180"
          }`}
          icon={faCaretUp}
        />
      </div>

      {checkActiveType() ? (
        <div className="flex-none md:flex gap-24 mt-5">
          <div>
            {experiences.map((experience) => {
              let startDate = moment(experience?.startDate).format("MMM YYYY");
              let endDate = moment(experience?.endDate).format("MMM YYYY");

              return (
                <div
                  className="mt-10 font-abc animate__animated animate__fadeInDown"
                  data-aos="fade-down"
                >
                  <div className="flex text-3xl font-abc">
                    <FontAwesomeIcon
                      icon={faGear}
                      className="text-gold hidden md:block"
                    />
                    <p className="md:ml-12 font-extrabold text-red2">
                      {experience?.organization}
                    </p>
                  </div>

                  <div className="md:border-l-8 md:border-solid md:border-gold md:ml-2 md:pl-16">
                    <p className="font-extrabold text-xl">
                      {experience?.title}
                    </p>
                    <p className="text-red3">
                      <span className="mr-2">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </span>
                      {`${startDate} to ${endDate}`}
                    </p>
                    <p className="text-justify text-lg py-8 grid gap-4">
                      {renderRichText(experience?.description, options)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExperienceDrawer;
