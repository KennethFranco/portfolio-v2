import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

import Layout from "../components/Layout/index";
import Button from "../components/Elements/Button";

const Contact = () => {
  const WEBHOOK = process.env.GATSBY_CONTACT_US_WEBHOOK;

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    await axios.post(WEBHOOK, {
      name,
      email,
      message,
    });

    setLoading(false);
    setSubmitted(true);
  };

  const checkDataValidation = () => {
    if (name && email && message) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Layout page="contact">
      <div className="px-10 lg:px-20 py-20 bg-cream font-abc">
        <p className="text-center text-red3 font-extrabold text-3xl lg:text-4xl animate__animated animate__fadeInLeft">
          Contact Me
        </p>
        <div className="flex justify-center text-4xl mt-5 text-red3 animate__animated animate__fadeInLeft">
          <a
            className="hover:text-red2 hover:scale-110 duration-150 ease-in"
            href="https://www.linkedin.com/in/kenneth-laurenz-franco-162b94200/"
          >
            <FontAwesomeIcon className="mr-5" icon={faLinkedin} />
          </a>

          <a
            className="hover:text-red2 hover:scale-110 duration-150 ease-in"
            href="https://github.com/KennethFranco"
          >
            <FontAwesomeIcon className="mr-5" icon={faGithub} />
          </a>

          <a
            className="hover:text-red2 hover:scale-110 duration-150 ease-in"
            href="mailto:kennethlaurenzfranco@gmail.com"
          >
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
        </div>
        <p className="mt-5 text-xl text-justify animate__animated animate__fadeInLeft">
          Have something to show me or interested in getting to know me better?
          Feel free to send a message through this form!
        </p>

        <div
          className="p-5 border-solid border-4 border-gold rounded-md mt-5 text-xl animate__animated animate__fadeInDown"
          data-aos="fade-down"
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="" htmlFor="name" for="name">
                Name:
              </label>
              <input
                name="name"
                id="name"
                className="bg-cream border-solid border-2 border-red3 rounded-md place text-black p-4"
                type="text"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </div>

            <div className="flex flex-col mt-5">
              <label className="" htmlFor="email" for="email">
                Email:
              </label>
              <input
                name="email"
                id="email"
                className="bg-cream border-solid border-2 border-red3 rounded-md place text-black p-4"
                type="email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
            </div>

            <div className="flex flex-col mt-5">
              <label className="" htmlFor="message" for="message">
                Message:
              </label>
              <textarea
                name="message"
                id="message"
                className="bg-cream border-solid border-2 border-red3 rounded-md place text-black p-4"
                type="text"
                onChange={(event) => setMessage(event.target.value)}
                value={message}
              />
            </div>

            <Button
              className="mt-5"
              variant="primary"
              disabled={checkDataValidation()}
              loading={loading}
              submitted={submitted}
            >
              Send
            </Button>
          </form>
        </div>

        <p className="mt-10 text-xl text-center">
          Hope to be hear from you soon!
        </p>
      </div>
    </Layout>
  );
};

export default Contact;
