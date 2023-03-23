import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

import Layout from "../components/Layout/index";
import Section from "../components/Elements/Section";
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
      <Section name="Contact" headerClassName="text-center">
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

        <div
          className="p-5 border-solid border-4 border-gold rounded-md mt-5 text-xl animate__animated animate__fadeInLeft"
          data-aos="fade-left"
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label
                className="text-red2 text-2xl font-bold"
                htmlFor="name"
                for="name"
              >
                Name:
              </label>
              <input
                name="name"
                id="name"
                className="font-xyz bg-cream border-solid border-2 border-red3 rounded-md place text-black p-4 hover:border-red2 focus:border-red2"
                type="text"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </div>

            <div className="flex flex-col mt-5">
              <label
                className="text-red2 text-2xl font-bold"
                htmlFor="email"
                for="email"
              >
                Email:
              </label>
              <input
                name="email"
                id="email"
                className="font-xyz bg-cream border-solid border-2 border-red3 rounded-md place text-black p-4 hover:border-red2 focus:border-red2"
                type="email"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
            </div>

            <div className="flex flex-col mt-5">
              <label
                className="text-red2 text-2xl font-bold"
                htmlFor="message"
                for="message"
              >
                Message:
              </label>
              <textarea
                name="message"
                id="message"
                className="font-xyz bg-cream border-solid border-2 border-red3 rounded-md place text-black p-4 hover:border-red2 focus:border-red2"
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
      </Section>
    </Layout>
  );
};

export default Contact;
