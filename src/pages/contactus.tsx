import OtherPageHeader from '../components/OtherPageHeader'
import ContactComponent from '../components/Contact'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useEffect, useState } from 'react';
import { errorHandler } from '../../utils/errorHandler';
import { toast } from 'react-toastify';
import { useCMS } from '../../hooks/useCMS';
import { CMSInterface } from './adminpages/cms-settings';

export default function ContactUs() {
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
        <OtherPageHeader header='Contact Us' />
        <ContactComponent socialMedia={cms?.socialMedia!!} contactUs={cms?.contactUs!!} />
    </DefaultLayout>
  )
}
