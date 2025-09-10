import React, { useEffect, useState } from 'react'
import Header from '../Header';
import Footer from '../Footer';
import { CopyrightFooterInterface, FooterInterface, SocialMediaInterface } from '../../pages/adminpages/cms-settings';
import { Box, Modal, Typography } from '@mui/material';
import { CgClose } from 'react-icons/cg';
import { useProfile } from '../../../hooks/useProfile';
import { newsLetterStore } from '../../../store/newsLetterStore';
import { toast } from 'react-toastify';
import { errorHandler } from '../../../utils/errorHandler';
import { Bounce } from 'react-activity';
import Joi from 'joi';
// import { useNavigate } from 'react-router';
// import { authStore } from '../../../store/authStore';


interface Props {
    children: React.ReactNode;
    withHeader?: boolean;
    withFooter?: boolean;
    socialMediaLinks?: SocialMediaInterface[];
    footerLinks?: FooterInterface[];
    footerCopyright?: CopyrightFooterInterface;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function DefaultLayout({children, socialMediaLinks, footerLinks, footerCopyright, withHeader = true, withFooter = true}: Props) {

  const {subscribeToNewsletters} = useProfile();
  const showNewsletter = newsLetterStore(state => state.showNewsletter);
  const setShowNewsletter = newsLetterStore(state => state.setShowNewsletter);
  const [subscribersName, setSucscribersName] = useState("");
  const [subscribersEmail, setSubscribersEmail] = useState("");
  const [isSubscribing, setSubscribing] = useState(false);

  const [isModalOpen, setOpenModal] = useState(false);

  const closeModal = () => {
    setOpenModal(false);
    setShowNewsletter(false);
  }

  useEffect(() => {
    setTimeout(() => {
      if(showNewsletter) {
        setOpenModal(true);
      }
    }, 8000);
  }, []);

  const subscribeButton = async () => {
    try {

      const {error} = Joi.object({
        subscribersName: Joi.string().required().messages({
          "string.empty": "Subscriber's name can not be empty"
        }),
        subscribersEmail: Joi.string().email().required().messages({
          "string.empty": "Subscriber's email can not be empty"
        })
      }).validate({subscribersName, subscribersEmail});

      if(error) {
        toast.error(error.message);
        return;
      }

      setSubscribing(true);

      await subscribeToNewsletters(subscribersName, subscribersEmail);
      toast.success("Newsletter subscription successful");
      setShowNewsletter(false);
      setSucscribersName("");
      setSubscribersEmail("");
    } catch (error) {
      toast.error(errorHandler(error, "An error occurred"));
    } finally {
      setSubscribing(false);
    }
  }

  const inputStyle =
    "py-2 px-2 w-full border border-1 border-[#333] rounded-md";

  // const navigate = useNavigate();

  // const userDetails = authStore(state => state.userDetails);
  // const isLoggedIn = authStore(state => state.isLoggedIn);

  // // if(userDetails.role == "shop" && isLoggedIn) {
  // //   navigate("/admin/dashboard");
  // // }

  return (
    <>
    {/* <button onClick={() => {setShowNewsletter(true)}}>Show</button> */}
        <div className="bg-[#292929] text-white px-10 xl:px-[140px] h-[35px] flex justify-between items-center">
          <div>HARLTZE | 3PLEHYCE</div>
          <div className='flex items-center gap-2'>
            <img src='/nigerian-flag.png' className='w-[20px] h-[15px]' />
            <div>NG</div>
          </div>
        </div>
        {withHeader && <Header />}
        {children}
        {withFooter && <Footer socialMediaLinks={socialMediaLinks} footerLinks={footerLinks} footerCopyright={footerCopyright} />}
        <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                // contentLabel="Example Modal"
              >
                <Box sx={style}>
                  <Typography>
                    <div className="flex justify-between items-center mb-8">
                      <div className="font-bold text-[20px]">
                        Subscribe to our Newsletter
                      </div>
                      <button onClick={closeModal}>
                        <CgClose size={25} />
                      </button>
                    </div>
                    <div className='flex flex-col gap-4'>
                      <div>
                        <div>
                          <input placeholder='Full Name' className={inputStyle} value={subscribersName} onChange={(e) => {setSucscribersName(e.target.value)}} />
                        </div>
                      </div>
                      <div className='mt-4 mb-4'>
                        {/* <small>Description</small> */}
                        <div>
                          <input placeholder='Email' className={inputStyle} value={subscribersEmail} onChange={(e) => {setSubscribersEmail(e.target.value)}} />
                        </div>
                      </div>
                      <button className='bg-primary rounded-md text-white py-2' disabled={isSubscribing} onClick={subscribeButton}>{isSubscribing ? <Bounce /> : "Subscribe"}</button>
                    </div>
                  </Typography>
                </Box>
              </Modal>
    </>
  )
}
