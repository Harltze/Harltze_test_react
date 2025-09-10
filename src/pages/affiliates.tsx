import { useEffect, useState } from "react";
// import OtherPageHeader from "../components/OtherPageHeader";
import DefaultLayout from "../components/layout/DefaultLayout";
// import Marquee from "react-fast-marquee";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler";
import { useCMS } from "../../hooks/useCMS";
import { CMSInterface } from "./adminpages/cms-settings";
import "../About.css";
import OtherPageHeader from "../components/OtherPageHeader";
// import { Link } from "react-router";

export default function Affiliates() {
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
      <OtherPageHeader header="Affiliates" />

      <section className="py-10 px-10 xl:px-[140px]">
        {/* <div className="text-center font-bold text-[35px] text-primary mb-10">
          Affiliates
        </div> */}
        <div dangerouslySetInnerHTML={{__html: cms?.affiliate?.content!!}} />
        <div className="mt-4">
          <a href={cms?.affiliate.link} target="_blank" rel="noopener noreferrer" className="px-4 py-1 rounded-md bg-primary text-white">Apply Now</a>
        </div>
      </section>
    </DefaultLayout>
  );
}
