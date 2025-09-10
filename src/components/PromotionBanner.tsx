// import { Link } from "react-router";
import {
  PromotionBannerInterface,
} from "../pages/adminpages/cms-settings";
import Marquee from "react-fast-marquee";

interface Props {
  promotionBanner?: PromotionBannerInterface[];
}

export default function PromotionBanner({ promotionBanner }: Props) {
  
  return (
    <Marquee className="bg-[black] py-2">
      <div className="flex items-center gap-20 text-[white]">
        {promotionBanner
          ?.filter((p) => p.show == true)
          ?.map((p) => (
            <div>
              {p.title}
              {/* <Link to={p.link}>{p.title}</Link> */}
            </div>
          ))}
      </div>
    </Marquee>
  );
}
