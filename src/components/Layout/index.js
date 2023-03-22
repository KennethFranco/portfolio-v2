import React, { useState, useEffect } from "react";
import aos from "aos";
import Typewriter from "typewriter-effect";

import "../../styles/global.css";
import "animate.css";
import "aos/dist/aos.css";

import Seo from "./SEO";
import Navbar from "./Navbar";
import Footer from "./Footer";

import loader from "../../../static/images/loader.gif";

if (typeof window !== "undefined") {
  aos.init();
}

const Template = (children) => {
  const [loadingGif, setLoadingGif] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoadingGif(false);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      {loadingGif ? (
        <div className="py-20">
          <img
            className="m-auto animate__animated animate__heartBeat"
            alt="upa loading"
            src={loader}
          />
          <div className="mt-10 font-xyz text-2xl text-red3 text-center font-bold">
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
      ) : (
        <div>
          <Seo />
          <Navbar />
          {children?.children}
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Template;
