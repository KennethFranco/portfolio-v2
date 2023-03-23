import React from "react";
import Layout from "../components/Layout/index";

import HomeHero from "../components/Home/HomeHero";
import Skills from "../components/Home/Skills";
import FeaturedProjects from "../components/Home/FeaturedProjects";

const HomePage = () => {
  return (
    <Layout>
      <HomeHero />
      <Skills />
      <FeaturedProjects />
    </Layout>
  );
};

export default HomePage;
