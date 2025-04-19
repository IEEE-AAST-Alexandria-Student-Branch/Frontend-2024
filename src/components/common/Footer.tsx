import FAQ from "../../assets/faq-bubble-white.png";
import Linkedin from "../../assets/linkedin-white.png";
import Contact from "../../assets/contact-envelope-white.png";
import IEEEOrg from "../../assets/ieeeorg.png";
import Deanery from "../../assets/aastDeanery.png";
import FooterSocialCard from "./FooterSocialCard";
import "./styles/Footer.css";
import { Element } from 'react-scroll';
import { useState, useEffect, useContext } from 'react';
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
import { AppConfigContext } from "../../App";

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
    link: `mailto:`,
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
  const appConfig = useContext(AppConfigContext).appConfig;

  useEffect(() => {
    SocialInfo[1].link = `mailto:${appConfig.contactEmail}`;
    const recruitment = appConfig.recruitment;
    getCollection('faq').then((data) => {
      const recruitmentFaq = {
        question: "How can I join you guys?",
        answer: recruitment.recruiting ?
          `You can volunteer with us today by clicking ` :
          "Unfortunately, we are not currently recruiting new volunteers. Check again soon!",
        index: (data?.result?.length ?? 0) + 1
      };
      const sortedFaq = ([...(data.result ?? []), recruitmentFaq]).sort((a: FAQ, b: FAQ) => a.index - b.index);

      setFaq(sortedFaq);
    });
  }, [appConfig]);

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
            <img src={IEEEOrg} alt="IEEE logo" className="logo-img" />
          </a>
          <a href="https://aast.edu/en/student-affairs/alex/index.php" target="_blank" rel="noreferrer">
            <img src={Deanery} alt="AAST Deanery" className="w-12 ml-2" />
          </a>
        </div>
      </footer>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"} >
        <ModalOverlay />
        <ModalContent backgroundColor={"#151F33"}>
          <ModalHeader><p className="text-[28pt]">Frequently Asked Questions</p></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {faq.map((question, index) => (
              <div key={index} className="mb-4">
                <li className="text-2xl">{question.question}</li>
                <p className="text-lg text-gray-300">
                  {question.answer}
                  {(index == faq.length - 1
                    && appConfig.recruitment.recruiting
                  ) && (
                      <>
                        <a target="_blank" className="text-blue-500" href={appConfig.recruitment.formLink}>here</a>!
                      </>
                    )}
                </p>

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
