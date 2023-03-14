import React from "react";
import { Link } from "gatsby";

import Button from "../Elements/Button";

const Navbar = () => (
  <nav
    className="font-abc px-8 py-5 bg-cream flex justify-between"
    role="navigation"
    aria-label="Main"
  >
    <Link to="/">
      <p className="text-red2">ken</p>
    </Link>

    <div className="flex">
      <p className="mx-12">About</p>
      <p className="mx-12">Projects</p>
      <p className="mx-12">Resume</p>
      <Button variant="primary">
        <p className="mx-12">Contact Me!</p>
      </Button>
    </div>
  </nav>
);

export default Navbar;
