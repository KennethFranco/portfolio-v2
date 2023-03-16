import React from "react";

import "../../styles/global.css";
import Seo from "./SEO";
import Navbar from "./Navbar";
import Footer from "./Footer";
class Template extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <>
        <Seo />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </>
    );
  }
}

export default Template;
