import DefaultLayout from "../components/layout/DefaultLayout.tsx";
import { useEffect, useState } from "react";
import { CMSInterface } from "./adminpages/cms-settings.tsx";
import { useCMS } from "../../hooks/useCMS.ts";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler.ts";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails, {
} from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IoIosArrowDown } from "react-icons/io";

export default function FAQs() {
  const [cms, setCMS] = useState<CMSInterface | null>(null);
  // const [expanded, setExpanded] = useState(false);

  // const handleExpansion = () => {
  //   setExpanded((prevExpanded) => !prevExpanded);
  // };

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
      <div className="text-center py-8 font-bold text-[20px]">Frequently Asked Questions</div>
      <main className="flex flex-col gap-8 mx-8 md:mx-20 mb-10">
        {
          cms?.faqs.map((value) => (
            <Accordion>
        <AccordionSummary
          expandIcon={<IoIosArrowDown />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span" fontWeight={"bold"}>{value?.question}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {value?.answer}
          </Typography>
        </AccordionDetails>
      </Accordion>
          ))
        }
      </main>
    </DefaultLayout>
  );
}
