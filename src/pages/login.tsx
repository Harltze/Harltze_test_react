import { useState } from "react";
import DefaultLayout from "../components/layout/DefaultLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Bounce } from "react-activity";
import { toast } from "react-toastify";
import Joi from "joi";
import { errorHandler } from "../../utils/errorHandler";
import { authStore } from "../../store/authStore";

export default function Login() {
  const { login } = useAuth();

  const setLoginDetails = authStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [isPasswordHidden, setPasswordHidden] = useState(true);

  const togglePasswordHidden = () => {
    setPasswordHidden(!isPasswordHidden);
  };

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
          "string.min":
            "Your password is too short. Your password has to be 8 characters and above",
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
  
      setIsLoginLoading(true);
  
      const response = await login({ email, password });
  
      setLoginDetails({
        fullName: response.data.details.fullName,
        email: response.data.details.email,
        profilePicture: response.data.details.profilePicture,
        role: "customer",
        jwt: response.data.result,
        refreshToken: response.data.details.refreshToken,
      });

      navigate("/");
    } catch (error) {
      toast.error(errorHandler(error));
    } finally {
      setIsLoginLoading(false);
    }
  };

  

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
            <div
              className="mb-4 text-center font-bold text-[25px]"
              onClick={() => {
                navigate("/admin");
              }}
            >
              Login
            </div>
            <div className="flex flex-col gap-6">
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

              <div className="flex flex-col">
                <label className="text-[14px]">Password</label>
                <div className="border border-2 border-solid border-primary rounded-md flex items-center">
                  <input
                    type={isPasswordHidden ? "password" : "text"}
                    className="w-full py-2 px-4"
                    placeholder="********"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <button onClick={togglePasswordHidden} className="px-4">
                    {isPasswordHidden ? (
                      <FaEyeSlash size={25} />
                    ) : (
                      <FaEye size={25} />
                    )}
                  </button>
                </div>
              </div>

              <button
                className="bg-primary text-white py-4 w-full rounded-md font-bold"
                onClick={loginButton}
              >
                {isLoginLoading ? <Bounce /> : "Login"}
              </button>
              <div className="flex flex-col items-center gap-2">
                <button
                className="inline-block w-fit"
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  <small className="text-[blue]">Don't have an account? Register</small>
                </button>
                <button
                  onClick={() => {
                    navigate("/forget-password");
                  }}
                >
                  <small className="text-[blue]">Forgot password?</small>
                </button>
                <button
                className="inline-block w-fit"
                  onClick={() => {
                    navigate("/privacy-policy");
                  }}
                >
                  <small className="text-[blue]">Read our Privacy Policy</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
