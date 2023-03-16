import React from "react";
import { Link } from "gatsby";

import upa from "../../../static/images/upa.png";

const Navbar = () => (
  <nav
    className="font-abc px-8 py-5 bg-cream flex justify-between h-16"
    role="navigation"
    aria-label="Main"
  >
    <Link className="font-semibold text-red3 hover:text-red2" to="/">
      <div className="flex">
        <img className="w-[20px]" src={upa} />
        <p className="ml-4">ken</p>
      </div>
    </Link>

    <div className="flex">
      <Link to="/about">
        <p className="mx-12">About</p>
      </Link>

      <p className="mx-12">Projects</p>
      <p className="mx-12">Resume</p>
    </div>
  </nav>
);

export default Navbar;
