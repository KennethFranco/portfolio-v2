import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { GatsbyImage } from "gatsby-plugin-image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Section from "../Elements/Section";

import useContentfulProjects from "../../hooks/useContentfulProjects";

const FeaturedProjects = () => {
  let featuredProjects = useContentfulProjects()
    .sort((a, b) => a.name.localeCompare(b.name) || a.isFeatured - b.isFeatured)
    .filter((project) => {
      return project?.isFeatured;
    });

  return (
    <Section name="Home Featured Projects">
      <Swiper
        className="bg-cream mt-5"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={200}
        slidesPerView="1"
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          clickable: true,
        }}
        modules={[Pagination, Navigation, Autoplay]}
      >
        {featuredProjects.map((featuredProject) => {
          let skills = featuredProject?.skills.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          return (
            <SwiperSlide className="mb-5">
              <div className="bg-cream">
                <GatsbyImage
                  className="m-auto mb-5"
                  image={featuredProject?.hero?.gatsbyImage}
                />
                <div className="bg-cream text-cream text-abc py-4 px-4 xl:py-12 xl:px-12 border-8 border-solid border-gold overflow-visible z-100 w-2/3 lg:w-1/2 m-auto text-center rounded-md">
                  <p className="text-base xl:text-xl font-abc text-red2 font-bold">
                    {featuredProject?.name}
                  </p>
                  <p className="font-abc text-black">
                    {featuredProject?.description?.description}
                  </p>
                  <div className="flex flex-wrap justify-center font-xyz">
                    {skills.map((skill) => {
                      return (
                        <p className="text-sm xl:text-base mt-5 mr-5 text-[#3A030B] bg-[#F6C5CC] px-3 py-3 rounded-md">
                          {skill?.name}
                        </p>
                      );
                    })}
                  </div>
                  <a href={featuredProject?.link}>
                    <FontAwesomeIcon
                      className="text-xl mt-5 text-red3 hover:text-red2 hover:scale-110 transition duration-150 ease-in"
                      icon={faUpRightFromSquare}
                    />
                  </a>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
        <div className="slider-controller mb-10">
          <div className="swiper-button-prev slider-arrow"></div>
          <div className="swiper-button-next slider-arrow"></div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </Section>
  );
};

export default FeaturedProjects;
