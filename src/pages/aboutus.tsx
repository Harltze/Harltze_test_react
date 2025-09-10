import { useEffect, useState } from "react";
// import OtherPageHeader from "../components/OtherPageHeader";
import DefaultLayout from "../components/layout/DefaultLayout";
// import Marquee from "react-fast-marquee";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler";
import { useCMS } from "../../hooks/useCMS";
import { CMSInterface } from "./adminpages/cms-settings";
import "../About.css";
import Marquee from "react-fast-marquee";
import DOMPurify from 'dompurify';

export default function AboutUs() {
  const [cms, setCMS] = useState<CMSInterface | null>(null);
  const { getCMSRecord } = useCMS();

  const fetchCMS = async () => {
    try {
      const cmsContent = await getCMSRecord();
      setCMS(cmsContent.data.result);
      console.log(cmsContent.data.result);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "Contents failed to load, kindly refresh this page..."
        )
      );
    }
  };
  useEffect(() => {
    fetchCMS();
  }, []);
  return (
    <DefaultLayout
      socialMediaLinks={cms?.socialMedia}
      footerLinks={cms?.footer}
      footerCopyright={cms?.copyrightFooter}
    >
      {/* <OtherPageHeader header="About Us" /> */}

      <section id="about" className="py-10 px-10 xl:px-[140px]">
        <section className="hero">
          <div className="text-md font-bold text-[24px] md:text-[30px]">{cms?.aboutUs.aboutUs.title}</div>
          <p>
            {cms?.aboutUs.aboutUs.description}
          </p>
        </section>

        <section className="section">
          <div className="about-columns">
            <div className="w-full md:w-1/2">
              <img src={cms?.aboutUs.aboutSection.imageUrl} className="mx-auto md:mx-0 mr-auto md:max-h-[480px] lg:max-h-[600px] max-w-fit" alt="Our design concept" />
            </div>
            <div className="about-text w-full md:w-1/2">
              <div className="font-bold text-[18px] md:text-[24px]">Our Journey</div>
              <p>
                {cms?.aboutUs?.ourJourney?.title}
              </p>
              <p>
                <strong>{cms?.aboutUs?.ourJourney?.description}</strong>
              </p>
            </div>
          </div>
        </section>

        <div className="sectiony">
          <h2 className="font-bold">Why We Exist</h2>
          <p className="mb-8">
            <span className="highlight">
              {cms?.aboutUs?.whyWeExist?.title}
            </span>
            {cms?.aboutUs?.whyWeExist?.description}
          </p>

          <h2 className="font-bold">Join The Build</h2>
          <p>
            {cms?.aboutUs?.joinTheBuild?.description}
          </p>
        </div>

        <section className="section">
          <h2 className="font-bold text-[18px]">Our Mission & Values</h2>
          <div className="mission-wrapper">
            <Marquee direction="left" speed={80} className="mission-track">
                {
                  cms?.aboutUs?.ourMissionAndValues.map(v => (
                      <div className="mission mx-[20px]">
                          <div className="prose" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(v?.value)}} />
                      </div>
                  ))
                }
            </Marquee>
          </div>
        </section>

        <section className="testimonials">
          <h2 className="text-center font-bold mb-4 !text-[32px]">What Our Customers Say</h2>
          <Marquee direction="left" speed={50} className="testimonial-track">
              {
                cms?.aboutUs.whatOurCustomersSay.map(v => (
                  <div className="testimonial mx-auto">
                  
                    <div className="prose" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(v?.value)}} />
                    {/* {v.value} */}
                  
                  </div>
                ))
              }
              {/* <span>— Ada, 🇳🇬 Nigeria</span>
            <div className="testimonial">
              <p>“Can’t wait for the next drop. This is top-tier branding.”</p>
              <span>— Jules, 🇫🇷 France</span>
            </div>
            <div className="testimonial">
              <p>“A brand I can flex and stand behind. Keep going Harltze.”</p>
              <span>— Malik, 🇺🇸 USA</span>
            </div>

            <div className="testimonial">
              <p>
                “Everything about the unboxing was premium. Harltze is the new
                wave.”
              </p>
              <span>— Ada, 🇳🇬 Nigeria</span>
            </div>
            <div className="testimonial">
              <p>“Can’t wait for the next drop. This is top-tier branding.”</p>
              <span>— Jules, 🇫🇷 France</span>
            </div>
            <div className="testimonial">
              <p>“A brand I can flex and stand behind. Keep going Harltze.”</p>
              <span>— Malik, 🇺🇸 USA</span>
            </div> */}
          </Marquee>
        </section>
      </section>

      {/* <section className="py-10 px-10 xl:px-[140px]">
        <div className="text-center font-bold text-[35px] text-primary mb-10">
          Meet Our Team
        </div>
        <div className="flex flex-col xl:flex-row text-center items-center justify-center gap-20">
          <div className="team-member">
            <img
              src="image1.jpg"
              className="h-[250px] w-[250px] rounded-full border border-4 border-dashed border-primary"
              alt="John Doe"
            />
            <div className="font-bold text-primary text-[25px]">John Doe</div>
            <p className="text-[14px] text-[#888]">CEO and Founder</p>
          </div>
          <div className="team-member">
            <img
              src="image2.jpg"
              className="h-[250px] w-[250px] rounded-full border border-4 border-dashed border-primary"
              alt="Jane Smith"
            />
            <div className="font-bold text-primary text-[25px]">Jane Smith</div>
            <p className="text-[14px] text-[#888]">CTO Co-Founder</p>
          </div>
        </div>
      </section>

      <section className="py-10 px-10 xl:px-[140px]">
        <div className="text-center font-bold text-[35px] text-primary mb-10">
          What Our Clients Say
        </div>
        <Marquee pauseOnHover={true}>
          <div className="bg-[#ccc] p-4 rounded-xl mx-20">
            <blockquote>
              <p>Harltze has been instrumental in our business growth...</p>
              <cite>— Client Name</cite>
            </blockquote>
          </div>

          <div className="bg-[#ccc] p-4 rounded-xl mx-20">
            <blockquote>
              <p>
                Harltze's innovative solutions have exceeded our expectations...
              </p>
              <cite>— Client Name</cite>
            </blockquote>
          </div>
        </Marquee>
      </section> */}
    </DefaultLayout>
  );
}
