import DefaultLayout from "../components/layout/DefaultLayout.tsx";
import { useEffect, useState } from "react";
import { CMSInterface } from "./adminpages/cms-settings.tsx";
import { useCMS } from "../../hooks/useCMS.ts";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler.ts";
import DOMPurify from 'dompurify';

export default function TermsAndConditions() {
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

  return (
    <DefaultLayout socialMediaLinks={cms?.socialMedia} footerLinks={cms?.footer} footerCopyright={cms?.copyrightFooter}>
      <div className="text-center py-8 font-bold text-[20px]">Privacy Policy</div>
      <main className="flex flex-col gap-8 px-20 mb-10">
        {
          cms?.termsAndConditions.map((c) => (
            <div>
              <div className="font-bold text-[20px]">{c?.title}</div>
              <div className="prose" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(c?.description)}} />
            </div>
          ))
        }
      </main>
    </DefaultLayout>
  );
}
