import React, { useState, useEffect } from "react";
import "animate.css";
import Typewriter from "typewriter-effect";
import Aos from "aos";
import "aos/dist/aos.css";

import "../../styles/global.css";
import Seo from "./SEO";
import Navbar from "./Navbar";
import Footer from "./Footer";

import gif from "../../../static/images/loading4.gif";

if (typeof window !== "undefined") {
  Aos.init();
}

const Template = (children) => {
  const [buffer, setBuffer] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setBuffer(true);
    }, 2000);
  }, []);

  return (
    <div className="bg-cream min-h-screen">
      {buffer ? (
        <div>
          <Seo />
          <div>
            <Navbar />
            {children?.children}
            <Footer />
          </div>
        </div>
      ) : (
        <div data-aos="zoom-in">
          <img
            className="m-auto h-auto text-center py-20 animate__animated animate__heartBeat"
            src={gif}
          />
          <div className="m-auto h-auto text-center font-xyz text-red3 text-4xl">
            <Typewriter
              skipAddStyles
              options={{
                strings: [`${children?.page ? children?.page : ""} loading...`],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Template;
