import FAQ from "../../assets/faq-bubble-white.png";
import Linkedin from "../../assets/linkedin-white.png";
import Contact from "../../assets/contact-envelope-white.png";
import Logo from "../../assets/IEEEAAST.ico";
import FooterSocialCard from "./FooterSocialCard";
import "./styles/Footer.css";
import { Element } from 'react-scroll';
import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import getCollection from "../../firebase/getCollection";
import getData from "../../firebase/getData";

interface FAQ {
  question: string;
  answer: string;
  index: number;
}

let SocialInfo = [
  {
    title: "Frequently Asked Questions",
    imgSrc: FAQ,
    link: "",
  },
  {
    title: "Contact Us",
    imgSrc: Contact,
    link: "mailto:",
  },
  {
    title: "LinkedIn",
    imgSrc: Linkedin,
    link: "https://www.linkedin.com/company/ieeeaast",
  },
];

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const [faq, setFaq] = useState<FAQ[]>([]);

  useEffect(() => {
    getCollection('faq').then((data) => {
      const sortedFaq = (data.result || []).sort((a: FAQ, b: FAQ) => a.index - b.index);
      setFaq(sortedFaq);
    });
    getData("contact", "zIwQeUb767qHByj118FY").then((response) => {SocialInfo[1].link = "mailto:"+response.result?.data()?.email || ""});
  }, []);

  return (
    <Element name="contactSection">
      <footer className="footer-container">
        <h2 className="footer-heading">Leading with Passion.</h2>
        <div className="footer-social-links">
          {SocialInfo.map((social, index) => (
            <FooterSocialCard key={index} {...social} onOpen={onOpen} />
          ))}
        </div>
        <div className="footer-bottom">
          <a href="https://www.ieee.org/" target="_blank" rel="noreferrer">
            <img src={Logo} alt="IEEE logo" className="logo-img" />
          </a>
        </div>
      </footer>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><p className="text-[28pt]">Frequently Asked Questions</p></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {faq.map((question, index) => (
              <div key={index} className="mb-4">
                <li className="text-2xl">{question.question}</li>
                <p className="text-lg text-gray-300">{question.answer}</p>
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <button onClick={onClose}>Close</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Element>
  );
};

export default Footer;
