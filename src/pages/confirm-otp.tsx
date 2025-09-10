import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { Bounce } from 'react-activity';
import { useNavigate } from 'react-router';
import FloatingBackButton from '../components/floatingBackButton';

export default function ConfirmOTP() {

    const [otp, setOTP] = useState("");

    const navigate = useNavigate();

    const {confirmCustomerOTP, isConfirmOTPLoading} = useAuth();

    const confirmOTPButton = async () => {

        const uId = sessionStorage.getItem("uId") as string;

        const response = await confirmCustomerOTP(uId, otp);

        sessionStorage.setItem("encryptResult", response.data.details.encryptResult);
        sessionStorage.removeItem("uId");

        navigate("/reset-password");

    }

  return (
    <div className='h-screen w-full flex justify-center items-center'>
        <FloatingBackButton />
            <div className="flex flex-col gap-4">
                <div className="text-center">
                    <div className="font-bold text-2xl mb-2">Forget Password</div>
                    <div>Kindly enter the OTP sent to your email</div>
                </div>
                <div className="flex flex-col">
                <label className="text-[14px]">OTP</label>
                <input
                  type="number"
                  value={otp}
                  onChange={(e) => {
                    setOTP(e.target.value);
                  }}
                  placeholder="E.g 123456"
                  className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
                />
              </div>
              <button
                className="bg-primary text-white py-2 w-full rounded-md font-bold"
                onClick={confirmOTPButton}
              >
                {isConfirmOTPLoading ? <Bounce /> : "ConfirmOTP"}
              </button>
            </div>
        </div>
  )
}
