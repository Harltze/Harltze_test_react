import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "animate.css/animate.compat.css"
import "react-activity/dist/library.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/home.tsx';
import AboutUs from './pages/aboutus.tsx';
import OurProducts from './pages/products.tsx';
import SingleProduct from './pages/singleproduct.tsx';
import ContactUs from './pages/contactus.tsx';
import Gallery from './pages/gallery.tsx';
import Register from './pages/register.tsx';
import Login from './pages/login.tsx';
import AdminHome from './pages/adminpages/home.tsx';
import AdminProducts from './pages/adminpages/products.tsx';
import AdminProduct from './pages/adminpages/categories.tsx';
import AdminOrders from './pages/adminpages/orders.tsx';
import AdminOrder from './pages/adminpages/gallery.tsx';
import AdminAddOrEdit from './pages/adminpages/addoreditproduct.tsx';
import AdminLogin from './pages/adminpages/login.tsx';
import { ToastContainer } from 'react-toastify';
import Cart from './pages/cart.tsx';
import ShippingAddressPage from './pages/shippingaddress.tsx';
import OrderHistory from './pages/orderhistory.tsx';
import AdminCategories from './pages/adminpages/categories.tsx';
import ForgetPassword from './pages/forget-password.tsx';
import ConfirmOTP from './pages/confirm-otp.tsx';
import ResetPassword from './pages/reset-password.tsx';
import AdminGallery from './pages/adminpages/gallery.tsx';
import Profile from './pages/profile.tsx';
import AffiliatesList from './pages/adminpages/affiliates/affiliates.tsx';
import AddAffiliate from './pages/adminpages/affiliates/add-affiliates.tsx';
import DiscountList from './pages/adminpages/discount-manager/discount-list.tsx';
import CreateDiscount from './pages/adminpages/discount-manager/create-discount.tsx';
import AdminCMS from './pages/adminpages/cms-settings.tsx';
import 'react-quill/dist/quill.snow.css';
import MarketersList from './pages/adminpages/marketers/marketers.tsx';
import AddMarketer from './pages/adminpages/marketers/add-marketer.tsx';
import AdminProfile from './pages/adminpages/adminProfile.tsx';
import AffiliateEarning from './pages/adminpages/affiliates/affiliate-earning.tsx';
import FAQs from './pages/faqs.tsx';
// import CancellationPolicy from './pages/cancellation-policy.tsx';
import TermsAndConditions from './pages/terms-and-conditions.tsx';
import PrivacyPolicy from './pages/privacy-policy.tsx';
import AdminNotFound from './pages/adminpages/admin-not-found.tsx';
import HarltzeStudio from './pages/studio.tsx';
import AdminStudioList from './pages/adminpages/studio.tsx';
import UserNotFound from './pages/user-not-found.tsx';
import SingleStudioProduct from './pages/singlestudio.tsx';
import Affiliates from './pages/affiliates.tsx';
import AdminClothesCollections from './pages/adminpages/clothesCollections.tsx';
import AdminAffiliatePendingCashOut from './pages/adminpages/affiliate-pending-cashout.tsx';
import PaymentSuccessful from './pages/payment-successful.tsx';
import AdminStudioVote from './pages/adminpages/studio-vote-dashboard.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer />
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/products" element={<OurProducts />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/payment-successful" element={<PaymentSuccessful />} />
      {/* <Route path="/cancellation-policy" element={<CancellationPolicy />} /> */}
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/orderhistory" element={<OrderHistory />} />
      <Route path="/affiliates" element={<Affiliates />} />
      <Route path="/shippingaddress" element={<ShippingAddressPage />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="/register" element={<Register />} />
      <Route path="/studio" element={<HarltzeStudio />} />
      <Route path="/studio/:id" element={<SingleStudioProduct />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/confirm-otp" element={<ConfirmOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminHome />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/admin/collections" element={<AdminClothesCollections />} />
      <Route path="/admin/product" element={<AdminProduct />} />
      <Route path="/admin/affiliates-cashouts" element={<AdminAffiliatePendingCashOut />} />
      <Route path="/admin/studio" element={<AdminStudioList />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/affiliates" element={<AffiliatesList />} />
      <Route path="/admin/affiliate/new" element={<AddAffiliate />} />
      <Route path="/admin/marketers" element={<MarketersList />} />
      <Route path="/admin/marketer/new" element={<AddMarketer />} />
      <Route path="/admin/affiliate-earnings" element={<AffiliateEarning />} />
      <Route path="/admin/discounts" element={<DiscountList />} />
      <Route path="/admin/cms" element={<AdminCMS />} />
      <Route path="/admin/discounts/new" element={<CreateDiscount />} />
      <Route path="/admin/cravings-summary" element={<AdminStudioVote />} />
      <Route path="/admin/order" element={<AdminOrder showPageControl={true} />} />
      <Route path="/admin/addoredit" element={<AdminAddOrEdit />} />
      <Route path="/admin/gallery" element={<AdminGallery showPageControl={true} />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/*" element={<AdminNotFound />} />
      <Route path="/*" element={<UserNotFound />} />
    </Routes>
  </BrowserRouter>
  </StrictMode>,
)
