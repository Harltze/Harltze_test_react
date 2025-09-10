import { useRef } from "react";
import { useNavigate } from "react-router";
import Slider from "react-slick";
import { HeroInterface } from "../pages/adminpages/cms-settings";

interface Props {
  hero?: HeroInterface[];
}

export default function HeroComponent({hero}: Props) {
  let sliderRef = useRef<any>(null);

  const navigate = useNavigate();

  const swiperSlideStyle =
    "h-[580px] md:h-[720px] lg:h-[620px] xl:h-[650px] bg-transparent flex justify-center lg:justify-between flex-col-reverse lg:flex-row items-center text-center lg:text-left px-10 xl:px-[140px] gap-2 lg:gap-10 py-4";

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    dotsClass: 'flex justify-center !text-white absolute !bottom-[5px] w-full !z-[200] slick-dots',
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "linear",
    autoplay: true,
    nextArrow: <></>,
    prevArrow: <></>,
  };

  return (
    <div className="relative">
      <Slider ref={sliderRef} {...settings}>
        {
          hero?.map((h) => (
            <div>
          <section id="home" style={{backgroundColor: "rgba(0,0,255,0.2)"}} className={swiperSlideStyle}>
            <div>
              <div>
                <div className="flex flex-col gap-4 lg:gap-20 text-center items-center lg:items-start md:text-left">
                  <div className="text-[25px] lg:text-[40px] font-bold text-primary mt-4 lg:mt-2">
                  {h.header}
                  </div>
                  <div className="text-[18px] lg:text-[30px] text-center lg:text-left font-bold text-primary">
                  {h.description}
                  </div>
                </div>
                  <div className="w-full mt-2 lg:t-8">
                    <button
                      className="text-white bg-primary mx-auto lg:mr-auto font-bold px-10 py-4 rounded-xl"
                      onClick={() => {
                        navigate(h.linkButtonUrl);
                      }}
                    >
                      {h.linkButtonTitle}
                    </button>
                  </div>
              </div>
            </div>
            <img src={h.pictureURL} className="rounded-xl h-fit max-h-[240px] md:max-h-[400px] lg:max-h-[550px]" />
          </section>
        </div>
          ))
        }
        {/* <div>
          <section id="home" className={swiperSlideStyle}>
            <div>
              <div>
                <div className="flex flex-col gap-20 items-start">
                  <div className="text-[25px] lg:text-[40px] font-bold text-primary mt-20 lg:mt-0">
                  Inspired by legacy, built for the future.
                  </div>
                  <div className="text-[18px] lg:text-[30px] font-bold text-primary">
                  Welcome to HARLTZE.
                  </div>
                </div>
                  <div className="w-full mt-8">
                    <button
                      className="text-white bg-primary mx-auto lg:mr-auto font-bold px-10 py-4 rounded-xl"
                      onClick={() => {
                        navigate("/products");
                      }}
                    >
                      SHOP COLLECTIONS
                    </button>
                  </div>
              </div>
            </div>
            <img src="/1752304191798.png" className="rounded-xl h-full" />
          </section>
        </div>

        <div>
          <section id="home" className={swiperSlideStyle}>
            <div>
              <div className="flex flex-col gap-20 items-start">
                <div className="text-[25px] lg:text-[40px] font-bold text-primary mt-20 lg:mt-0">
                  Inspired by legacy, built for the future.
                </div>
                <div className="text-[18px] lg:text-[30px] text-primary">
                  Welcome to HARLTZE.
                </div>
                <button
                  className="text-white bg-primary font-bold px-10 py-4 rounded-xl"
                  onClick={() => {
                    navigate("/products");
                  }}
                >
                  SHOP COLLECTIONS
                </button>
              </div>
            </div>
            <img src="/1752304191777.png" className="rounded-xl h-full" />
          </section>
        </div> */}
      </Slider>
    </div>
  );
}
