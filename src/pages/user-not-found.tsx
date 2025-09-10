import { useNavigate } from "react-router";
import DefaultLayout from "../components/layout/DefaultLayout";
import { useEffect, useState } from "react";
import { errorHandler } from "../../utils/errorHandler";
import { toast } from "react-toastify";
import { useCMS } from "../../hooks/useCMS";
import { CMSInterface } from "./adminpages/cms-settings";

export default function UserNotFound() {
  
  const navigate = useNavigate();

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
    <DefaultLayout withFooter={true} socialMediaLinks={cms?.socialMedia} footerLinks={cms?.footer} footerCopyright={cms?.copyrightFooter}>
      <div className="flex flex-col gap-2 justify0center items-center h-[400px]">
        <div className="text-[200px]">404</div>
        <div>The page you've requested for is not found</div>
        <div>
          <button className="px-8 py-1 rounded-md border border-primary text-primary" onClick={() => {navigate(-1)}}>Go back</button>
        </div>
      </div>
    </DefaultLayout>
  );
}
