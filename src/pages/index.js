import React from "react";
import Layout from "../components/Layout/index";

import Hero from "../components/Home/Hero";
import Skills from "../components/Home/Skills";

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <Skills />
    </Layout>
  );
};

export default HomePage;
