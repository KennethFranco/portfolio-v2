import React from "react";

import "./variables.css";
import "./global.css";
import Seo from "./seo";
import Navbar from "./Layout/Navbar";
import Footer from "./footer";
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
