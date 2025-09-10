import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Bounce } from 'react-activity';
import Joi from 'joi';
import { useNavigate } from 'react-router';
import FloatingBackButton from '../components/floatingBackButton';

export default function ResetPassword() {

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    const { resetCustomerPassword, isResetPasswordLoading } = useAuth();

    const [isPasswordHidden, setPasswordHidden] = useState(true);

    const togglePasswordHidden = () => {
        setPasswordHidden(!isPasswordHidden);
    };

    const [isConfirmPasswordHidden, setConfirmPasswordHidden] = useState(true);

    const toggleConfirmPasswordHidden = () => {
        setConfirmPasswordHidden(!isConfirmPasswordHidden);
    };

    const resetPasswordButton = async () => {

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const { error } = Joi.string().alphanum().min(8).required().messages({
            "string.alphanum": "Your password has to contain letters and numbers",
            "string.min":
                "Your password is too short. Your password has to be 8 characters and above",
            "any.required": "Password field is required",
        }).validate(newPassword);

        if (error) {
            toast.error(error.message);
            return;
        }


        const encryptResult = sessionStorage.getItem("encryptResult") as string;
        const result = await resetCustomerPassword(encryptResult, newPassword);

        if (result.data.status == 200) {
            toast.success("Password updated successfully! Redirecting to login in 5seconds...");
            setTimeout(() => {
                navigate("/login");
            }, 5000);
        } else {
            toast.error("An error occurred while trying to reset your password.");
        }
    }

    return (
        <div className='h-screen w-full flex justify-center items-center'>
            <FloatingBackButton />
            <div className="flex flex-col gap-4">
                <div className="text-center">
                    <div className="font-bold text-2xl mb-2">Update Password</div>
                    <div>Enter a new password to be updated</div>
                </div>
                <div className="flex flex-col">
                    <label className="text-[14px]">New password</label>
                    <div className="border border-2 border-solid border-primary rounded-md flex items-center">
                        <input
                            type={isPasswordHidden ? "password" : "text"}
                            className="w-full py-2 px-4"
                            placeholder="********"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
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
                <div className="flex flex-col">
                    <label className="text-[14px]">Confirm password</label>
                    <div className="border border-2 border-solid border-primary rounded-md flex items-center">
                        <input
                            type={isConfirmPasswordHidden ? "password" : "text"}
                            className="w-full py-2 px-4"
                            placeholder="********"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                            }}
                        />
                        <button onClick={toggleConfirmPasswordHidden} className="px-4">
                            {isConfirmPasswordHidden ? (
                                <FaEyeSlash size={25} />
                            ) : (
                                <FaEye size={25} />
                            )}
                        </button>
                    </div>
                </div>
                <button
                    className="bg-primary text-white py-2 w-full rounded-md font-bold"
                    onClick={resetPasswordButton}
                >
                    {isResetPasswordLoading ? <Bounce /> : "Update Password"}
                </button>
            </div>
        </div>
    )
}
