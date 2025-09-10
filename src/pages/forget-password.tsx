import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Bounce } from "react-activity";
import { toast } from "react-toastify";
import Joi from "joi";
import { useNavigate } from "react-router";
import FloatingBackButton from "../components/floatingBackButton";


export default function ForgetPassword() {

    const [email, setEmail] = useState("");

    const navigate = useNavigate();

    const {forgotCustomerPassword, isForgotPasswordLoading} = useAuth();

    const forgotPasswordButton = async () => {

        const emailValidation = Joi.string().email({ tlds: { allow: ["com", "net"] } }).required().messages({
            "string.email": "Kindly enter a valid email",
            "any.required": "Email field is required",
            "string.empty": "Email field can not be empty",
          });

        const {error} = emailValidation.validate(email);

        if(error) {
            toast.error(error.message);
            return;
        }

        const response = await forgotCustomerPassword(email);

        sessionStorage.setItem("uId", response.data.details.uId);

        navigate("/confirm-otp");

    }

    return (
        <div className='h-screen w-full flex justify-center items-center'>
            <FloatingBackButton />
            <div className="flex flex-col gap-4">
                <div className="text-center">
                    <div className="font-bold text-2xl mb-2">Forget Password</div>
                    <div>Kindly enter your email</div>
                </div>
                <div className="flex flex-col">
                <label className="text-[14px]">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="E.g johndoe@gmail.com"
                  className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
                />
              </div>
              <button
                className="bg-primary text-white py-2 w-full rounded-md font-bold"
                onClick={forgotPasswordButton}
              >
                {isForgotPasswordLoading ? <Bounce /> : "Send"}
              </button>
            </div>
        </div>
    )
}
