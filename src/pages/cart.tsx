import { useEffect, useMemo, useState } from "react";
import { authStore } from "../../store/authStore";
import { cartStore } from "../../store/cartStore";
import { shippingAddressStore } from "../../store/shippingAddressStore";
import CartItem from "../components/CartComponent/CartItem";
import OtherPageHeader from "../components/OtherPageHeader";
import DefaultLayout from "../components/layout/DefaultLayout";
import { formatCurrency, getCurrencySymbol } from "../../utils/formatCurrency";
import { Link, useNavigate } from "react-router";
import { useOrders } from "../../hooks/useOrders";
import { toast } from "react-toastify";
import { Bounce } from "react-activity";
import { errorHandler } from "../../utils/errorHandler";
import { CMSInterface } from "./adminpages/cms-settings";
import { useCMS } from "../../hooks/useCMS";
import { Box, Modal, Typography } from "@mui/material";
import { CgClose } from "react-icons/cg";

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

export default function Cart() {

  const [code, setCode] = useState("");
  const [codeType, setCodeType] = useState("");
  const [codeDetails, setCodeDetails] = useState<any>(null);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  
  const { createPaystackPaymentLink, isCreatePaymentLinkLoading, createAnOrder, isCreateOrderLoading, affiliateOrDiscountDetails } = useOrders();

  const openModal = () => {
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
  }

  const applyCode = async () => {
    try {
      setIsCheckingCode(true);
      const res = await affiliateOrDiscountDetails(code, codeType);
      console.log(res.data);
      if(res.data.codeType == "discount") {
        setCodeDetails({
          code: res.data.discount?.discountCode,
          codeType: res.data?.codeType,
          discountAmountOrPercent: res.data?.discount?.discountAmountOrPercent,
          discountForProductsAbove: res.data?.discount?.discountForProductsAbove,
          discountType: res.data?.discount?.discountType,
        });
        console.log({
          code: res.data.discount?.discountCode,
          codeType: res.data?.codeType,
          discountAmountOrPercent: res.data?.discount?.discountAmountOrPercent,
          discountForProductsAbove: res.data?.discount?.discountForProductsAbove,
          discountType: res.data?.discount?.discountType,
        });
      } else if(res.data.codeType == "affiliate") {
        setCodeDetails({
          code: res.data?.code,
          codeType: res.data?.codeType,
          affiliateFullName: `${res.data?.affiliate?.firstName} ${res.data?.affiliate?.lastName}`,
          discountPercent: res.data?.discountPercent?.defaultAffiliatePercent,
        });
        console.log({
          code: res.data?.code,
          codeType: res.data?.codeType,
          affiliateFullName: `${res.data?.affiliate?.firstName} ${res.data?.affiliate?.lastName}`,
          discountPercent: res.data?.discountPercent?.defaultAffiliatePercent,
        });
      }
      setModalOpen(false);
      setCode("");
      setCodeType("");
    } catch (error) {
      toast.error(errorHandler(error, "An error occurred while trying to load the code. Kindly try again later."));
    } finally {
      setIsCheckingCode(false);
    }
  }

  const [cms, setCMS] = useState<CMSInterface | null>(null);
  const {getCMSRecord} = useCMS();
  
    const fetchCMS = async () => {
      try {
        const cmsContent = await getCMSRecord();
        setCMS(cmsContent.data.result);
        console.log(cmsContent.data.result);
      } catch (error) {
        toast.error(errorHandler(error, "Contents failed to load, kindly refresh this page..."));
      }
    }
  useEffect(() => {
      fetchCMS();
    }, []);

  const navigate = useNavigate();

  // const [affiliateOrDiscountCode, setAffiliateOrDiscountCode] = useState("");

  // const [codeType, setCodeType] = useState("");


  const isLoggedIn = authStore((state) => state.isLoggedIn);
  const userDetails = authStore((state) => state.userDetails);
  const emptyCart = cartStore(state => state.emptyCart);

  const cart = cartStore((state) => state.cart);

  const shippingAddresses = shippingAddressStore(
    (state) => state.shippingAddresses
  );

  const defaultShippingAddress = shippingAddresses.find(
    (s) => s.isDefault == true
  );

  const checkoutDisabled = useMemo(() => {
    return !defaultShippingAddress || !isLoggedIn;
  }, [shippingAddresses, isLoggedIn]);

  const grandTotal = useMemo(() => {
    let total = 0;

    for (let i = 0; i < cart.length; i++) {
      let totalPerQuantity = 0;
      if (cart[i].sizeColorQuantity!!.length > 0) {
        for (let j = 0; j < cart[i].sizeColorQuantity!!.length; j++) {
          totalPerQuantity +=
            cart[i].cost * cart[i].sizeColorQuantity!![j].quantity!!;
        }
        total += totalPerQuantity;
      }
    }

    if(codeDetails?.codeType == "discount") {

      if (total >= codeDetails?.discountForProductsAbove) {
        const amountToDiscount = total * (codeDetails?.discountAmountOrPercent / 100);
        const recalculatedTotal = total - amountToDiscount;
        return {
          total: recalculatedTotal, totalWithoutDiscount: total
        };
      } else {
        setCodeDetails(null);
      }
    }

    return {total};
  }, [cart, codeDetails, isCheckingCode]);

  const currencySymbol = getCurrencySymbol();

  const pay = async () => {

    if(!defaultShippingAddress) {
      toast.error("No shipping address is selected");
      return;
    }

    if(grandTotal.total == 0) {
      toast.error("Kindly update the quantity on your products");
      return;
    }

    const orderDetails = await createAnOrder({
      products: cart,
      totalCost: grandTotal.total,
      state: defaultShippingAddress!!.state,
      city: defaultShippingAddress!!.city,
      address: defaultShippingAddress!!.address,
      codeDetails: codeDetails ? codeDetails : null
    });

    const orderId = orderDetails.data.result._id;

    const response = await createPaystackPaymentLink(orderId);

    const authorizationUrl = response.data.result.data.authorization_url;

    location.assign(`${authorizationUrl}?orderId=${orderId}`);

  };

  const inputStyle =
    "py-2 px-2 w-full border border-1 border-[#333] rounded-md";

  return (
    <DefaultLayout socialMediaLinks={cms?.socialMedia} footerLinks={cms?.footer} footerCopyright={cms?.copyrightFooter}>
      <OtherPageHeader header="Cart" subHeader="Please review and update your cart." />

      <section
        id="about"
        className="flex flex-col-reverse md:flex-row-reverse gap-10 py-10 px-10 xl:px-[140px] min-h-[70vh]"
      >
        <div className="w-full md:w-[460px] text-left md:text-right">
          {isLoggedIn ? (
            <div>
              <div className="mb-4">
                <div className="my-2 font-bold text-[20px] text-left">
                  User Details
                </div>
                <div className="flex flex-col gap-2">
                  {/* <img src={
                      userDetails.profilePicture == ""
                        ? "/avatar.png"
                        : userDetails.profilePicture
                    } className="ml-0 md:ml-auto h-[80px] w-[80px] rounded-full" /> */}
                  <div className="flex justify-between items-end">
                    <div className="text-[#aaa] text-[14px]">Full name</div>
                    <div className="font-medium text-[18px]">
                      {userDetails.fullName}
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-[#aaa] text-[14px]">Email</div>
                    <div className="font-medium text-[18px]">
                      {userDetails.email}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="my-2 font-bold text-[20px] text-left">
                  Shipping Details
                </div>
                <div className=" justify-end items-center">
                  {defaultShippingAddress ? (
                    <div className="flex flex-col gap-2 text-right w-full">
                      {/* <div>Country: {defaultShippingAddress?.country}</div> */}
                      <div className="flex justify-between items-end">
                        <div className="text-[#aaa] text-[14px]">State</div>
                        <div className="font-medium text-[18px]">
                          {defaultShippingAddress?.state[0].toLocaleUpperCase() +
                            defaultShippingAddress?.state.slice(1)}
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-[#aaa] text-[14px]">City</div>
                        <div className="font-medium text-[18px]">
                          {defaultShippingAddress?.city}
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-[#aaa] text-[14px]">Address</div>
                        <div className="font-medium text-[18px]">
                          {defaultShippingAddress?.address}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>No shipping address</div>
                  )}
                </div>
                <Link
                  to="/shippingaddress"
                  className="block text-center w-full px-8 py-2 my-4 font-bold border border-2 border-primary text-primary rounded-xl"
                >
                  {defaultShippingAddress ? "Update" : "Add"} Shipping Address
                </Link>
                {
                  !codeDetails ? (
                    <button className="text-primary text-center w-full my-2" onClick={openModal}>Have an affiliate/discount code?</button>
                  ) : (
                    <div>
                      {
                        codeDetails.codeType == "affiliate" && (
                          <div>
                              <div className="text-center font-bold">Affiliate code applied: {codeDetails?.code}</div>
                          </div>
                        )
                      }
                      {
                        codeDetails.codeType == "discount" && (
                          <div className="text-center">
                            <div>Discount code: {codeDetails?.code}</div>
                            <div>Discount percent: {codeDetails?.discountAmountOrPercent}% (for total amounts above {currencySymbol}{formatCurrency(codeDetails?.discountForProductsAbove)})</div>
                          </div>
                        )
                      }
                      <button className="text-primary text-center w-full my-2" onClick={openModal}>Change discount/affiliate code</button>
                    </div>
                  )
                }
              </div>

              <div className="text-right my-2">
                <div className="border-y border-y-2 border-[black] py-4 my-4">
                  <div className="font-bold">Total</div>
                  {
                    grandTotal?.totalWithoutDiscount && (
                      <div className="font-bold text-[16px] text-[#aaa] line-through">
                        {currencySymbol}
                        {formatCurrency(grandTotal.totalWithoutDiscount)}
                      </div>
                    )
                  }
                  <div className="font-bold text-[25px]">
                    {currencySymbol}
                    {formatCurrency(grandTotal.total)}
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-[#FF0000]">Note:</span> Orders with multiple products will be shipped together based on the longest item fulfillment time.
                </div>
                <button
                onClick={pay}
                  className={`w-full px-8 py-2 mt-4 font-bold ${
                    checkoutDisabled
                      ? "opacity-[0.6] bg-[#3E7B27]"
                      : "bg-[#3E7B27]"
                  } text-white rounded-xl`}
                  disabled={checkoutDisabled || isCreateOrderLoading || isCreatePaymentLinkLoading}
                >
                  {isCreateOrderLoading || isCreatePaymentLinkLoading ? (<Bounce />) : "Checkout"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <div style={{ opacity: 0.5 }}>
                  <div>
                  <div className="my-2 font-bold text-[20px] text-left">
                  User Details
                </div>
                    <div className="flex flex-col gap-2">
                  {/* <img src={
                      userDetails.profilePicture == ""
                        ? "/avatar.png"
                        : userDetails.profilePicture
                    } className="ml-0 md:ml-auto h-[80px] w-[80px] rounded-full" /> */}
                  <div className="flex justify-between items-end">
                    <div className="text-[#aaa] text-[14px]">Full name</div>
                    <div className="font-medium text-[18px]">
                      --
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-[#aaa] text-[14px]">Email</div>
                    <div className="font-medium text-[18px]">
                      --
                    </div>
                  </div>
                </div>
                  </div>

                  <div>
                  <div className="my-2 font-bold text-[20px] text-left">
                  Shipping Details
                </div>
                    <div className="flex flex-col gap-2">
                  {/* <img src={
                      userDetails.profilePicture == ""
                        ? "/avatar.png"
                        : userDetails.profilePicture
                    } className="ml-0 md:ml-auto h-[80px] w-[80px] rounded-full" /> */}
                  <div className="flex justify-between items-end">
                    <div className="text-[#aaa] text-[14px]">State</div>
                    <div className="font-medium text-[18px]">
                      --
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-[#aaa] text-[14px]">City</div>
                    <div className="font-medium text-[18px]">
                      --
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-[#aaa] text-[14px]">Address</div>
                    <div className="font-medium text-[18px]">
                      --
                    </div>
                  </div>
                </div>
                  </div>
                </div>
                <div className="mt-4">
                <div className="mb-2 text-left font-medium">Login to see details</div>
                <button onClick={() => {navigate("/login")}} className="border border-primary text-primary font-medium py-2 px-4 w-full rounded-md">Log In</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full">
          {
            cart.length > 0 && (
              <div className="my-4 flex justify-end">
                <button onClick={emptyCart} className="px-4 border border-2 border-primary text-primary rounded-xl">Clear cart</button>
              </div>
            )
          }
          {cart.length > 0 ? (
            <div className=" flex flex-col gap-8">
              {cart.map((cartItem) => (
                <CartItem cart={cartItem} key={cartItem._id} />
              ))}
            </div>
          ) : (
            <div className="h-[70vh] w-full flex justify-center items-center">
              <div className="font-bold text-[40px]">No product in cart</div>
            </div>
          )}
        </div>
      </section>
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
                        Apply code
                      </div>
                      <button onClick={closeModal}>
                        <CgClose size={25} />
                      </button>
                    </div>
                    <div className='flex flex-col gap-4'>
                      <div>
                        <small>Code</small>
                        <div>
                          <input className={inputStyle} placeholder="E.g 50kdiscount" value={code} onChange={(e) => {setCode(e.target.value)}} />
                        </div>
                      </div>
                      <div className='mb-4'>
                        <small>Code type</small>
                        <select className={inputStyle} value={codeType} onChange={(e) => {setCodeType(e.target.value)}}>
                          <option value="">Select code type...</option>
                          <option value={"discount"}>Discount code</option>
                          <option value={"affiliate"}>Affiliate code</option>
                        </select>
                      </div>
                      <button className='bg-primary rounded-md text-white py-2' onClick={applyCode}>{isCheckingCode ? <Bounce /> : "Apply Code"}</button>
                    </div>
                  </Typography>
                </Box>
              </Modal>
    </DefaultLayout>
  );
}
