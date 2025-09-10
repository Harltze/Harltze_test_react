import { Link } from "react-router";
import { GalleryPremiumBanner } from "../pages/adminpages/cms-settings";
import { authStore } from "../../store/authStore";

export default function PremiumEditionBanner({premiumBanner}: {premiumBanner: GalleryPremiumBanner}) {

  const isLoggedInStore = authStore((state) => state.isLoggedIn);

  return (
    <div className="flex justify-between items-center px-10 xl:px-[140px] py-8" style={{backgroundImage: `url("banner-image-rectangle.png")`, backgroundSize: "cover"}}>
        <div className='text-left'>
            <div className="font-bold text-white text-[16px] md:text-[25px]">{premiumBanner?.title}</div>
            <div className="text-white text-[12px] md:text-[18px]">{premiumBanner?.description}</div>
            <Link to={isLoggedInStore ? premiumBanner?.buttonLink : "/login"} className="bg-white py-2 px-4 mt-4 inline-block text-[16px] md:text-[20px] rounded-lg">{premiumBanner?.buttonTitle}</Link>
        </div>
        <img src={premiumBanner?.pictureUrl} className="w-[120px] md:w-[180px] xl:w-[300px] block rounded-md" />
    </div>
  )
}
