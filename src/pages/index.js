import React from "react";
import Layout from "../components/Layout/index";

import Hero from "../components/Home/Hero";
import Skills from "../components/Home/Skills";
import FeaturedProjects from "../components/Home/FeaturedProjects";

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <Skills />
      <FeaturedProjects />
    </Layout>
  );
};

export default HomePage;
