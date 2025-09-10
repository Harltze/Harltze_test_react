import { useEffect, useState } from "react";
import AdminDasboardLayout from "../../components/layout/AdminDasboardLayout";
import { useCMS } from "../../../hooks/useCMS";
import { toast } from "react-toastify";
import { errorHandler } from "../../../utils/errorHandler";
import { Link, useSearchParams } from "react-router";
import AdminHeroCMS from "../../components/AdminCMSComponent/AdminHeroCMS";
import TermsAndConditionsCMS from "../../components/AdminCMSComponent/TermsAndConditionsCMS";
import PrivacyPolicyCMS from "../../components/AdminCMSComponent/PrivacyPolicyCMS";
// import CancellationPolicyCMS from "../../components/AdminCMSComponent/CancellationPolicyCMS";
import FAQsCMS from "../../components/AdminCMSComponent/FAQsCMS";
import PromotionBannerCMS from "../../components/AdminCMSComponent/PromotionBannerCMS";
import FooterCMS from "../../components/AdminCMSComponent/FooterCMS";
import CopyrightFooterCMS from "../../components/AdminCMSComponent/CopyrightFooterCMS";
import SocialMediaHandlesCMS from "../../components/AdminCMSComponent/SocialMediaHandles";
import OthersCMS from "../../components/AdminCMSComponent/OthersCMS";
import AboutUsCMS from "../../components/AdminCMSComponent/AboutUsCMS";
import AffiliateCMS from "../../components/AdminCMSComponent/AffiliateCMS";

export interface HeroInterface {
  _id?: string;
  pictureURL: string;
  header: string;
  description: string;
  linkButtonTitle: string;
  linkButtonUrl: string;
}

export interface TermsAndConditionsInterface {
  _id?: string;
  title: string;
  description: string;
}

export interface PrivacyPolicyInterface {
  _id?: string;
  title: string;
  description: string;
}

export interface CancellationPolicyInterface {
  _id?: string;
  title: string;
  description: string;
}

export interface FAQInterface {
  _id?: string;
  question: string;
  answer: string;
}

export interface FooterLinksInterface {
  _id?: string;
  title: string;
  link: string;
}

export interface FooterInterface {
  _id?: string;
  title: string;
  links: FooterLinksInterface[];
}

export interface PromotionBannerInterface {
  _id?: string;
  title: string;
  link?: string;
  show: boolean;
}

export interface CopyrightFooterInterface {
  _id?: string;
  title: string;
  description: string;
}

export interface GalleryPremiumBanner {
  title: string;
  description: string;
  buttonTitle: string;
  buttonLink: string;
  pictureUrl: string;
}

export interface ContactUsDetails {
  phoneNumber: string;
  address: string;
  email: string;
}

export interface SocialMediaInterface {
  _id?: string;
  title: string;
  link: string;
  iconLink: string;
}

export interface AboutUsInterfaceNestedObject {
  title: string;
  description: string;
}

export interface NestedWithImageUrl extends AboutUsInterfaceNestedObject {
  imageUrl: string;
}

export interface MissionAndCustomersInterface {
  _id: string;
  value: string;
}

export interface MeetOurTeam {
  _id: string;
  name: string;
  picture: string;
  role: string;
}

export interface AboutUsInterface {
  aboutUs: AboutUsInterfaceNestedObject;
  ourJourney: AboutUsInterfaceNestedObject;
  meetOurTeam: MeetOurTeam[];
  aboutSection: NestedWithImageUrl;
  whyWeExist: AboutUsInterfaceNestedObject;
  joinTheBuild: AboutUsInterfaceNestedObject;
  ourMissionAndValues: MissionAndCustomersInterface[];
  whatOurCustomersSay: MissionAndCustomersInterface[];
}

export interface AffiliateInterface {
  content: string;
  link: string;
}

export interface CMSInterface {
  hero: HeroInterface[];
  termsAndConditions: TermsAndConditionsInterface[];
  privacyPolicy: PrivacyPolicyInterface[];
  socialMedia: SocialMediaInterface[];
  cancellationPolicy: CancellationPolicyInterface[];
  faqs: FAQInterface[];
  affiliate: AffiliateInterface;
  premiumBanner: GalleryPremiumBanner;
  galleryBanner: GalleryPremiumBanner;
  aboutUs: AboutUsInterface;
  footer: FooterInterface[];
  contactUs: ContactUsDetails;
  promotionBanner: PromotionBannerInterface[];
  copyrightFooter: CopyrightFooterInterface;
}

export default function AdminCMS() {

  const [searchParams, _setSearchParams] = useSearchParams();
  
  const [cms, setCMS] = useState<CMSInterface | null>(null);

  const {getCMSRecord, updateCMSRecord} = useCMS();

  const fetchCMS = async () => {
    try {
      const result = await getCMSRecord();

      setCMS(result.data.result);

    } catch (error) {
      toast.error(errorHandler(error, "Unable to fetch CMS data, kindy try again later."));
    }
  }

  const sidebarActiveLinkStyle = "px-4 py-2 rounded-md bg-primary text-[white]";
  const sidebarInctiveLinkStyle = "px-4 py-2 rounded-md text-primary";

  useEffect(() => {
    fetchCMS();
  }, []);

  return (
    <AdminDasboardLayout
      header="CMS Control"
      showSearch={false}
      // searchPlaceholder="Search Products"
      // searchValue={searchKeyword}
      // setSearchValue={setSearchKeyword}
      // searchAction={searchAction}
    >
      <div className="h-full">
        <div className="flex h-full">
          <div className="flex flex-col gap-4 w-[30%] h-full border-r border-r-2 border-r-primary pr-4 overflow-y-auto">
            <Link className={`${(!searchParams.get("page") || searchParams.get("page") == "hero") ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=hero"}>Hero</Link>
            <Link className={`${searchParams.get("page") == "about-us" ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=about-us"}>About Us</Link>
            <Link className={`${searchParams.get("page") == "affiliate" ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=affiliate"}>Affiliate</Link>
            <Link className={`${searchParams.get("page") == "terms-and-conditions" ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=terms-and-conditions"}>Terms And Conditions</Link>
            <Link className={`${searchParams.get("page") == "privacy-policy" ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=privacy-policy"}>Privacy Policy</Link>
            {/* <Link className={`${searchParams.get("page") == "cancellation-policy" ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=cancellation-policy"}>Cancellation Policy</Link> */}
            <Link className={`${searchParams.get("page") == "social-media-handles" ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=social-media-handles"}>Social Media Handles</Link>
            <Link className={`${searchParams.get("page") == "promotion-banner" ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=promotion-banner"}>Promotion Banner</Link>
            <Link className={`${searchParams.get("page") == "faqs" ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=faqs"}>FAQs</Link>
            <Link className={`${searchParams.get("page") == "footer" ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=footer"}>Footer</Link>
            <Link className={`${searchParams.get("page") == "copyright-footer" ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=copyright-footer"}>Footer Copyright</Link>
            <Link className={`${searchParams.get("page") == "others" ? sidebarActiveLinkStyle : sidebarInctiveLinkStyle}`} to={"/admin/cms?page=others"}>Others</Link>
          </div>
          <div className="w-[70%] h-full overflow-y-auto">

            {
              (!searchParams.get("page") || searchParams.get("page") == "" || searchParams.get("page") == "hero") && <AdminHeroCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            }

            {
              (searchParams.get("page") == "terms-and-conditions") && <TermsAndConditionsCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            }

            {
              (searchParams.get("page") == "privacy-policy") && <PrivacyPolicyCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            }

            {/* {
              (searchParams.get("page") == "cancellation-policy") && <CancellationPolicyCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            } */}

            {
              (searchParams.get("page") == "faqs") && <FAQsCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            }

            {
              (searchParams.get("page") == "promotion-banner") && <PromotionBannerCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            }

            {
              (searchParams.get("page") == "social-media-handles") && <SocialMediaHandlesCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            }

            {
              (searchParams.get("page") == "footer") && <FooterCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            }

            {
              (searchParams.get("page") == "copyright-footer") && <CopyrightFooterCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            }

            {
              (searchParams.get("page") == "others") && <OthersCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            }

            {
              (searchParams.get("page") == "about-us") && <AboutUsCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            }

            {
              (searchParams.get("page") == "affiliate") && <AffiliateCMS cmsData={cms} refreshCMS={fetchCMS} updateCMSRecord={updateCMSRecord} />
            }

          </div>
        </div>
      </div>
    </AdminDasboardLayout>
  );
}
