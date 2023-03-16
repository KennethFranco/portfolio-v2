import React from "react";

import "../variables.css";
import "../global.css";
import Seo from "../seo";
import Navbar from "./Navbar";
import Footer from "./Footer";
class Template extends React.Component {
  render() {
    const { children } = this.props;

    return (
      <>
        <Seo />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </>
    );
  }
}

export default Template;
