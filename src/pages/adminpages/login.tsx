import { useState } from "react";
import DefaultLayout from "../../components/layout/DefaultLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { authStore } from "../../../store/authStore";
import { errorHandler } from "../../../utils/errorHandler";
import Joi from "joi";
import { Bounce } from "react-activity";
import { Box, Modal, Typography } from "@mui/material";
import { IoClose } from "react-icons/io5";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: "8px",
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AdminLogin() {

  const {adminLogin, adminConfirmOTP} = useAuth();

  const [isAdminLoginLoading, setIsAdminLoading] = useState(false);

  const [uId, setUId] = useState("");

  const setLoginDetails = authStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOTP] = useState("");
  const [isOTPLoading, setOTPLoading] = useState(false);

  const [isOTPModalOpen, setOTPModalOpen] = useState(false);

    const [isPasswordHidden, setPasswordHidden] = useState(true);

    const togglePasswordHidden = () => {
        setPasswordHidden(!isPasswordHidden);
    }

    const navigate = useNavigate();

    const loginButton = async () => {
      try {
        const { error } = Joi.object({
          email: Joi.string()
            .email({ tlds: { allow: ["com", "net"] } })
            .required()
            .messages({
              "string.email": "Kindly enter a valid email",
              "any.required": "Email field is required",
            }),
          password: Joi.string().alphanum().min(8).required().messages({
            "string.alphanum": "Your password has to contain letters and numbers",
            "string.min": "Your password is too short. Your password has to be 8 characters and above",
            "any.required": "Password field is required",
          }),
        }).validate({
          email,
          password,
        });
    
        if (error) {
          toast.error(error.message);
          return;
        }

        setIsAdminLoading(true);
    
        const response = await adminLogin({ email, password });
        // console.log(response.data);
        setUId(response.data.result);
        openOTPModal();
        
      } catch (error) {
        toast.error("Login Error:", errorHandler(error));
      } finally {
        setIsAdminLoading(false);
      }
      };

      const openOTPModal = () => {
          setOTPModalOpen(true);
        };
      
        const closeOTPModal = () => {
          setOTPModalOpen(false);
        };

        const verifyOTP = async () => {
          try {

            setOTPLoading(true);

            const response = await adminConfirmOTP(uId, otp);

            setLoginDetails({
            fullName: response.data.details.fullName,
            email: response.data.details.email,
            profilePicture: response.data.details.shopLogo,
            role: response.data.details.role,
            jwt: response.data.result,
            refreshToken: response.data.details.refreshToken,
            affiliateCode: response.data?.details?.affiliateCode
          });

          console.log(response.data.details.role);

          if(response.data.details.role == 'shop' || response.data.details.role == 'admin') {
            navigate("/admin/dashboard");
          } else if (response.data.details.role == 'affiliate') {
            navigate("/admin/products");
          } else if (response.data.details.role == 'marketer') {
            navigate("/admin/dashboard");
          }
            
          } catch (error) {
            toast.error(errorHandler(error));
          } finally {
            setOTPLoading(false);
          }
        }

  return (
    <DefaultLayout withFooter={false}>
    <div className="w-full h-[calc(100vh_-_65px)] flex">
      <div className="h-full hidden md:block md:w-1/2 xl:w-[60%]">
        <img src="/BC2C24E5-2065-40A2-AED1-7CE9AEDF4605.jpeg" className="h-full w-fit" />
      </div>
      <div className="h-full w-full md:w-1/2 xl:w-[40%] flex justify-center items-center overflow-y-auto">
        <div className="w-[80%] lg:w-[65%] mx-auto">
          {/* <img
            src="/thraustlogo.png"
            className="h-[40px] w-[40px]"
            alt="Harltze Logo"
          /> */}
          <div className="mb-4 text-center font-bold text-[25px]" onClick={() => {navigate("/admin")}}>Portal Login</div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
                <label className="text-[14px]">Email</label>
                <input value={email} onChange={(e) => {setEmail(e.target.value)}} type="email" placeholder="E.g johndoe@gmail.com" className="border border-2 border-solid border-primary py-2 px-4 rounded-md" />
            </div>

            <div className="flex flex-col">
                <label className="text-[14px]">Password</label>
                <div className="border border-2 border-solid border-primary rounded-md flex items-center">
                <input value={password} onChange={(e) => {setPassword(e.target.value)}} type={isPasswordHidden ? "password" : "text"} className="w-full py-2 px-4" placeholder="********" />
                <button onClick={togglePasswordHidden} className="px-4">
                    {isPasswordHidden ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
                </button>
                </div>
            </div>

            <button className="bg-primary text-white py-4 w-full rounded-md font-bold" onClick={loginButton}>
                {isAdminLoginLoading ? <Bounce /> : "Login"}
            </button>
            {/* <button onClick={() => {navigate("/register")}}>
                <small>Don't have an account? Register</small>
            </button> */}
          </div>
        </div>
      </div>
    </div>
    <Modal
              open={isOTPModalOpen}
              onClose={closeOTPModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  <div className="flex justify-between items-center">
                    <div>OTP</div>
                    <IoClose onClick={closeOTPModal} />
                  </div>
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <div className="flex flex-col gap-4">
                    <input className="w-full border py-2 px-4 rounded-md" value={otp} onChange={(e) => {setOTP(e.target.value)}} />
                    <button onClick={verifyOTP} className="w-full bg-primary text-white py-2 rounded-md" disabled={isOTPLoading}>{isOTPLoading ? <Bounce color="white" /> : "Verify"}</button>
                  </div>
                </Typography>
              </Box>
            </Modal>
    </DefaultLayout>
  );
}