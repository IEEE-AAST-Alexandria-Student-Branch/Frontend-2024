import { useState, useEffect, useContext } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
} from "@chakra-ui/react";
import FAQ from "../../assets/faq-bubble-white.png";
import Feedback from "../../assets/feedback.png";
import Linkedin from "../../assets/linkedin-white.png";
import Contact from "../../assets/contact-envelope-white.png";
import IEEEOrg from "../../assets/ieeeorg.png";
import Deanery from "../../assets/aastDeanery.png";
import FooterSocialCard from "./FooterSocialCard";
import { Element } from "react-scroll";
import getCollection from "../../firebase/getCollection";
import addData from "../../firebase/addData";
import { AppConfigContext } from "../../App";
import { UserContext } from "../../App";

interface FAQ {
  question: string;
  answer: string;
  index: number;
}

let SocialInfo = [
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
  const [isOpenFAQ, setIsOpenFAQ] = useState(false);
  const [isOpenFeedback, setIsOpenFeedback] = useState(false); // New state for feedback modal
  const onCloseFAQ = () => setIsOpenFAQ(false);
  const onOpenFAQ = () => setIsOpenFAQ(true);
  const onCloseFeedback = () => setIsOpenFeedback(false); // Close feedback modal
  const onOpenFeedback = () => setIsOpenFeedback(true); // Open feedback modal
  const [feedback, setFeedback] = useState("");
  const [faq, setFaq] = useState<FAQ[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const appConfig = useContext(AppConfigContext).appConfig;
  const {userId} = useContext(UserContext);

  useEffect(() => {
    SocialInfo[1].link = `mailto:${appConfig.contactEmail}`;
    const recruitment = appConfig.recruitment;
    getCollection("faq").then((data) => {
      const recruitmentFaq = {
        question: "How can I join you guys?",
        answer: recruitment.recruiting
          ? `You can volunteer with us today by clicking `
          : "Unfortunately, we are not currently recruiting new volunteers. Check again soon!",
        index: (data?.result?.length ?? 0) + 1,
      };
      const sortedFaq = [...(data.result ?? []), recruitmentFaq].sort(
        (a: FAQ, b: FAQ) => a.index - b.index
      );

      setFaq(sortedFaq);
    });
  }, [appConfig]);

  return (
    <Element name="contactSection">
      <footer className="bg-[#151F33] m-4 rounded-[30px] p-8 relative z-30">
        <h2 className="text-[29px] font-bold">Leading with Passion.</h2>
        <div className="flex items-center justify-between my-16 gap-8 flex-col lg:flex-row">
          <FooterSocialCard onOpen={onOpenFAQ} imgSrc={FAQ} title="FAQ" />
          <FooterSocialCard
            onOpen={onOpenFeedback} // Open feedback modal
            imgSrc={Feedback}
            title="Feedback"
          />
          {SocialInfo.map((social, index) => (
            <FooterSocialCard key={index} {...social} />
          ))}
        </div>
        <div className="flex items-center">
          <a href="https://www.ieee.org/" target="_blank" rel="noreferrer">
            <img src={IEEEOrg} alt="IEEE logo" className="w-[100px] border-r border-[#707070] pr-2" />
          </a>
          <a
            href="https://aast.edu/en/student-affairs/alex/index.php"
            target="_blank"
            rel="noreferrer"
          >
            <img src={Deanery} alt="AAST Deanery" className="w-12 ml-2" />
          </a>
        </div>

        {/* FAQ Modal */}
        <Modal isOpen={isOpenFAQ} onClose={onCloseFAQ} size={"xl"} isCentered>
          <ModalOverlay />
          <ModalContent backgroundColor={"#151F33"}>
            <ModalHeader>
              <p className="text-[28pt]">Frequently Asked Questions</p>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {faq.map((question, index) => (
                <div key={index} className="mb-4">
                  <li className="text-2xl">{question.question}</li>
                  <p className="text-lg text-gray-300">
                    {question.answer}
                    {index === faq.length - 1 && appConfig.recruitment.recruiting && (
                      <>
                        <a
                          target="_blank"
                          className="text-blue-500"
                          href={appConfig.recruitment.formLink}
                        >
                          here
                        </a>
                        !
                      </>
                    )}
                  </p>
                </div>
              ))}
            </ModalBody>
            <ModalFooter>
              <button onClick={onCloseFAQ}>Close</button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Feedback Modal */}
        <Modal isOpen={isOpenFeedback} onClose={onCloseFeedback} size={"md"} isCentered>
          <ModalOverlay />
          <ModalContent backgroundColor={"#151F33"}>
            <ModalHeader>
              <h1>Something Bothered You?</h1>
              <h5>Tell us about it to solve it...</h5>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                placeholder="Describe what's wrong here..."
                size="lg"
                resize="none"
                className="modal-body"
                border={"1px solid #0d1421"}
                onChange={(e) => {setFeedback(e.target.value);}}
                value={feedback}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => {
                  onCloseFeedback();
                }}
              >
                Cancel
              </Button>
              <Button colorScheme="blue"
                isLoading={submitting}
                loadingText="Sending..."
              onClick={async()=>{
                setSubmitting(true);
                await addData("feedback", {
                  feedback: feedback,
                  date: new Date().toISOString(),
                  from: userId
                })
                  .then(() => {
                    alert("Feedback sent successfully!");
                    setSubmitting(false);
                    setFeedback("");
                  })
                  .catch((error) => {
                    console.error("Error sending feedback:", error);
                    setSubmitting(false);
                  });
                onCloseFeedback();
              }}
              >Submit</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </footer>
    </Element>
  );
};

export default Footer;
