// import React from 'react'
// import { IoLocationSharp } from "react-icons/io5";
// import { FaPhoneFlip } from "react-icons/fa6";
// import { FaFacebookSquare } from "react-icons/fa";
// import { MdEmail } from "react-icons/md";
// import { RiTwitterXLine } from "react-icons/ri";
// import { RiInstagramFill } from "react-icons/ri";
import AnimateOnScroll from "react-animate-on-scroll";
import { ContactUsDetails, SocialMediaInterface } from "../pages/adminpages/cms-settings";
import { useProfile } from "../../hooks/useProfile";
import { useState } from "react";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler";
import { Bounce } from "react-activity";
import Joi from "joi";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdEmail, MdMyLocation } from "react-icons/md";

export default function ContactComponent({
  socialMedia,
  contactUs
}: {
  socialMedia: SocialMediaInterface[];
  contactUs: ContactUsDetails
}) {
  const { sendContactUsMessage } = useProfile();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    try {
      const { error } = Joi.object({
        fullName: Joi.string().required().messages({
          "string.empty": "Full name can not be empty",
        }),
        email: Joi.string().required().messages({
          "string.empty": "Email can not be empty",
        }),
        message: Joi.string().required().messages({
          "string.empty": "Message can not be empty",
        }),
      }).validate({ fullName, email, message });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsLoading(true);
      await sendContactUsMessage(fullName, email, message);
      toast.success("Email sent successfully");
      setFullName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error(
        errorHandler(error, "An error occurred while trying to send request.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const iconLinksStyle = "h-[35px] w-[35px] rounded-full";

  return (
    <AnimateOnScroll animateIn="fadeIn" duration={2}>
      <section className="mx-10 xl:mx-[140px] my-12 rounded-xl text-white bg-[#222] bg-black overflow-hidden">
        <div className="flex gap-4">
          {/* <img src="/contactus.jpg" className="hidden lg:block lg:w-1/2" /> */}
          <div className="px-6 py-10 w-full">
            <div className="col-md-6">
              <div className="font-bold text-[35px]">Get in Touch</div>
              <p className="text-[20px] mb-4">
                Have a question or want to collaborate?
              </p>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col">
                  <label className="text-[12px] mb-2">Full Name</label>
                  <input
                    className="px-5 py-2 rounded-md"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                    }}
                  />
                </div>

                <div className="flex flex-col gap-10">
                  <div className="flex flex-col">
                    <label className="text-[12px] mb-2">Email</label>
                    <input
                      className="px-5 py-2 rounded-md"
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-10">
                  <div className="flex flex-col">
                    <label className="text-[12px] mb-2">Message</label>
                    <textarea
                      className="px-5 py-2 rounded-md text-black"
                      name="message"
                      placeholder="Message"
                      rows={5}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>

                <button
                  className="bg-primary font-bold py-4 rounded-lg"
                  disabled={isLoading}
                  onClick={sendMessage}
                >
                  {isLoading ? <Bounce /> : "Send Message"}
                </button>
              </div>
            </div>
            <div className="mt-8">
              <div className="font-bold text-[30px] mb-4">
                Contact Information
              </div>
              <ul className="flex flex-col gap-2">
                {socialMedia?.map((s) => (
                  <li className="flex gap-2 items-center">
                    <a
                      href={s.link}
                      className="flex gap-2 items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={s.iconLink}
                        alt={s.title}
                        className={iconLinksStyle}
                      />
                      <div>{s.title}</div>
                    </a>
                  </li>
                ))}
                <li className="flex gap-2 items-center">
                    <FaPhoneFlip size={25} /> <a href={`tel:${contactUs?.phoneNumber}`}>{contactUs?.phoneNumber}</a>
                  </li>
                  <li className="flex gap-2 items-center">
                    <MdEmail size={25} />
                    <a href={`mailto:${contactUs?.email}`}>{contactUs?.email}</a>
                  </li>
                  <li className="flex gap-2 items-center">
                    <MdMyLocation size={25} />
                    {contactUs?.address}
                  </li>
              </ul>
              {/* <ul className="flex gap-4 mt-4">
                  <li>
                    <a href="#">
                      <FaFacebookSquare size={35} />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <RiTwitterXLine size={35} />
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <RiInstagramFill size={35} />
                    </a>
                  </li>
                </ul> */}
            </div>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}
