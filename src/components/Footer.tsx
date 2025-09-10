import { Link } from "react-router";
import { CMSInterface, CopyrightFooterInterface, FooterInterface, SocialMediaInterface } from "../pages/adminpages/cms-settings";
import { useEffect, useState } from "react";
import { errorHandler } from "../../utils/errorHandler";
import { toast } from "react-toastify";
import { useCMS } from "../../hooks/useCMS";

interface Props {
  socialMediaLinks?: SocialMediaInterface[];
  footerLinks?: FooterInterface[];
  footerCopyright?: CopyrightFooterInterface;
}

export default function Footer({socialMediaLinks, footerLinks, footerCopyright}: Props) {

  const {getCMSRecord} = useCMS();

  const [cms, setCMS] = useState<CMSInterface | null>(null);
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

  const iconLinksStyle = "h-[40px] w-[40px] rounded-full";

  const footerGridHeaders = "font-bold text-[28px]"

  return (
    <footer className="w-full bg-[white]">
      <section className="flex gap-4 justify-between items-center w-full bg-[black] px-10 xl:px-[140px] py-4">
              <div className="text-left">
                <div className="text-[25px] md:text-[40px] font-bold text-white">{cms?.galleryBanner?.title}</div>
                <div className="text-[14px] md:text-[22px] text-white">
                  {cms?.galleryBanner?.description}
                </div>
                <Link to={cms?.galleryBanner?.buttonLink!!} className="text-[14px] md:text-[20px] text-[black] bg-[white] px-2 md:px-8 py-2 inline-block mt-4 rounded-md">{cms?.galleryBanner?.buttonTitle}</Link>
              </div>
                <img src={cms?.galleryBanner?.pictureUrl} className="w-[120px] md:w-[180px] xl:w-[300px] block rounded-md" />
              {/* <div className="w-1/2 flex justify-end">
              </div> */}
          </section>
      <div className="flex items-center justify-center bg-primary gap-4 py-4 py-[2rem] px-[100px]">
        {
          socialMediaLinks?.map((s) => (
            <a href={s.link} target="_blank" rel="noopener noreferrer">
              <img src={s.iconLink} alt={s.title} className={iconLinksStyle} />
            </a>
          ))
        }
        {/* <a href="#">
          <img src="/TIKTOK.png" alt="tiktok icon" className={iconLinksStyle} />
        </a>
        <a href="#">
          <img src="/FACE.png" alt="facebook icon" className={iconLinksStyle} />
        </a>
        <a href="#">
          <img src="/X.png" alt="x icon" className={iconLinksStyle} />
        </a>
        <a href="#">
          <img src="/INSTA.png" alt="instagram icon" className={iconLinksStyle} />
        </a>
        <a href="#">
          <img src="/YOUTUBE.png" alt="youtube icon" className={iconLinksStyle} />
        </a> */}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-8 px-10 xl:px-[140px]">
        {
          footerLinks?.map((f) => (
            <div>
              <div className={footerGridHeaders}>{f.title}</div>
              {
                f.links.map((fLink) => (
                  <div>{(fLink.link).startsWith("http") ? <a href={fLink.link} target="_blank" rel="noopener noreferrer">{fLink.title}</a> : <Link to={fLink.link}>{fLink.title}</Link>}</div>
                ))
              }
            </div>
          ))
        }
        {/* <div>
          <div className={footerGridHeaders}>Account</div>
          <div>Account</div>
          <div>Order History</div>
          <div>Become an Affiliate</div>
        </div>
        <div>
          <div className={footerGridHeaders}>Assistance</div>
          <div>Return Policy</div>
          <div>Cancellation Policy</div>
          <div>Terms & Conditions</div>
          <div>Privacy Policy</div>
          <div>FAQs</div>
        </div>
        <div>
          <div className={footerGridHeaders}>Have a question or want to collaborate</div>
          <div>Tiktok</div>
          <div>Facebook</div>
          <div>X</div>
          <div>Instagram</div>
          <div>Youtube</div>
        </div> */}
      </div>
      <div className="bg-primary py-8">
        <div className='text-white text-center'>
            <p>&copy; {new Date().getFullYear()} {footerCopyright?.title}</p>
        </div>
        <div className='text-white text-center'>
            <p>{footerCopyright?.description}</p>
        </div>
      </div>
</footer>
  )
}
