import { useState } from "react";
import DefaultLayout from "../components/layout/DefaultLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Bounce } from "react-activity";
import Joi from "joi";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordHidden, setPasswordHidden] = useState(true);

  const [isConfirmPasswordHidden, setConfirmPasswordHidden] = useState(true);

  const { register, isRegisterLoading } = useAuth();

  const togglePasswordHidden = () => {
    setPasswordHidden(!isPasswordHidden);
  };

  const toggleConfirmPasswordHidden = () => {
    setConfirmPasswordHidden(!isConfirmPasswordHidden);
  };

  const navigate = useNavigate();

  const registerButton = async () => {

    const { error } = Joi.object({
      firstName: Joi.string().min(3).required().messages({
        "string.min": "First name has to be more thn two characters",
        "any.required": "First name is required",
      }),
      lastName: Joi.string().min(3).required().messages({
        "string.min": "Last name has to be more thn two characters",
        "any.required": "Last name is required",
      }),
      phoneNumber: Joi.string().min(11).required().messages({
        "string.min": "Phone number has to be at least 11 characters",
        "any.required": "Phone number is required",
      }),
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
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if(password !== confirmPassword) {
      toast.error("Password and confirm password does not match");
      return;
    }

    const response = await register({
      firstName,
      lastName,
      phoneNumber,
      email,
      password
    });

    // console.log(response);

    if (response.data.status == 201) {
      toast.success("Registration successful");
      navigate("/login");
    } else {
      toast.error(errorHandler(response.error));
    }
  };

  return (
    <DefaultLayout withFooter={false}>
      <div className="w-full h-[calc(100vh_-_65px)] flex">
        <div className="h-full hidden md:block md:w-1/2 xl:w-[60%]">
          <img src="/76851FDF-D945-4857-BF8D-FFBE6E8F877E.jpeg" className="h-full w-fit" />
        </div>
        <div className="h-full w-full md:w-1/2 xl:w-[40%] flex justify-center items-center overflow-y-auto">
          <div className="w-[80%] lg:w-[65%] mx-auto">
            {/* <img
                    src="/thraustlogo.png"
                    className="h-[40px] w-[40px]"
                    alt="Harltze Logo"
                  /> */}
            <div className="mb-2 text-center font-bold text-[25px] pt-[250px]">
              Register
            </div>
            <div className="flex flex-col gap-6 pt-4 pb-8 px-2">
              <div className="flex flex-col">
                <label className="text-[14px]">First Name</label>
                <input
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  type="text"
                  placeholder="E.g John"
                  className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[14px]">Surname</label>
                <input
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  type="text"
                  placeholder="E.g Doe"
                  className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[14px]">Phone Number</label>
                <input
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  type="tel"
                  placeholder="E.g 0801234567"
                  className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[14px]">Email</label>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="email"
                  placeholder="E.g johndoe@gmail.com"
                  className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[14px]">Password</label>
                <div className="border border-2 overflow-hidden border-solid border-primary rounded-md flex items-center">
                  <input
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    type={isPasswordHidden ? "password" : "text"}
                    className="w-full py-2 px-4"
                    placeholder="********"
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

              <div className="flex flex-col">
                <label className="text-[14px]">Confirm Password</label>
                <div className="border border-2 border-solid border-primary rounded-md flex items-center">
                  <input
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                    type={isConfirmPasswordHidden ? "password" : "text"}
                    className="w-full py-2 px-4 overflow-hidden"
                    placeholder="********"
                  />
                  <button
                    onClick={toggleConfirmPasswordHidden}
                    className="px-4"
                  >
                    {isConfirmPasswordHidden ? (
                      <FaEyeSlash size={25} />
                    ) : (
                      <FaEye size={25} />
                    )}
                  </button>
                </div>
              </div>

              <button onClick={registerButton} className="bg-primary text-white py-4 w-full rounded-md font-bold">
                {isRegisterLoading ? <Bounce /> : "Register"}
              </button>

              <button
                onClick={() => {
                  navigate("/login");
                }}
              >
                <small>Already have an account? Login</small>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
