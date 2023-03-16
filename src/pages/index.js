import React from "react";
import Layout from "../components/layout";

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
