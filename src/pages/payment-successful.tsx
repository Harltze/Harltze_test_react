// import { useNavigate } from "react-router";
import { useEffect } from "react";
import { cartStore } from "../../store/cartStore";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export default function PaymentSuccessful() {
  
  // const navigate = useNavigate();
  const clearCart = cartStore(state => state.emptyCart);

  useEffect(() => {
    clearCart();
    setTimeout(() => {
      location.assign("/");
    }, 3000);
  }, []);

  return (
      <div className="flex flex-col gap-2 justify-center items-center h-screen">
        <IoMdCheckmarkCircleOutline color="green" size={120} />
        <div className="font-bold text-[20px]">Payment Successful</div>
        <div>Redirecting... Please wait</div>
        <small>Kindly click the button below if you're not automatically redirected</small>
        <div>
          <button className="px-8 py-1 rounded-md border border-primary text-primary" onClick={() => {location.assign("/");}}>Home</button>
        </div>
      </div>
  );
}
