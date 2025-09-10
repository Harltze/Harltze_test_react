import { useEffect, useState } from 'react'
import { CMSInterface } from '../../pages/adminpages/cms-settings';

import { toast } from 'react-toastify';
import { errorHandler } from '../../../utils/errorHandler';
import { UpdateRecordType } from '../../../hooks/useCMS';
import Joi from 'joi';
import { Bounce } from 'react-activity';

interface Props {
  refreshCMS: () => Promise<void>;
  cmsData: CMSInterface | null;
  updateCMSRecord: (updateType: UpdateRecordType, payload: any) => Promise<any>;
}

export default function CopyrightFooterCMS({refreshCMS, cmsData, updateCMSRecord}: Props) {

  const [anyUnsavedChanges, setAnyUnsavedChanges] = useState(false);

  const [isSaving, setSaving] = useState(false);
  
  const[title, setTitle] = useState("");
  const[description, setDescription] = useState("");
  

  const saveButton = async () => {
    try {
      
      const {error} = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
      }).validate({title, description});

      if(error) {
        toast.error(error.message);
        return;
      }

      setSaving(true);


      await updateCMSRecord("copyright-footer", {copyrightFooter: {title, description}});

      await refreshCMS();

      setAnyUnsavedChanges(false);

      toast.success("Copyright footer updated succesfully");

    } catch (error) {
      toast.error(errorHandler(error, "An error occurred while saving, kindly try again later."));
    } finally {
      setSaving(false);
    }
  }


  useEffect(() => {
    if(!cmsData) return;
    setTitle(cmsData?.copyrightFooter!!.title);
    setDescription(cmsData?.copyrightFooter!!.description);
  }, [cmsData]);

  useEffect(() => {
    console.log("title != cmsData?.copyrightFooter!!.title", title != cmsData?.copyrightFooter!!.title, "description != cmsData?.copyrightFooter!!.description", description != cmsData?.copyrightFooter!!.description);
    console.log(title, cmsData?.copyrightFooter!!.title);
    console.log(description, cmsData?.copyrightFooter!!.description);
    if(title != cmsData?.copyrightFooter!!.title || description != cmsData?.copyrightFooter!!.description) {
      setAnyUnsavedChanges(true);
    } else {
      setAnyUnsavedChanges(false);
    }
  }, [title, description]);

  const inputStyle =
    "py-2 px-2 w-full border border-1 border-[#333] rounded-md";

  return (
    <div className='p-4 h-[95%]'>
      <div className='flex justify-end items-center mb-2'>
        <div className='flex gap-4 items-center'>
          {
           anyUnsavedChanges && <div className='text-[#aaa]'>Unsaved changes</div>
          }
        <button className='px-8 py-1 border text-primary border-2 rounded-md border-primary' onClick={() => {
          refreshCMS();
          setAnyUnsavedChanges(false);
          }}>Refresh</button>
        <button className='px-8 py-1 border text-[white] bg-primary border-2 rounded-md border-primary' onClick={saveButton}> {isSaving ? <Bounce /> : "Save"}</button>

        </div>
      </div>
      <div className='flex flex-col gap-4'>
          <div>
            <small>Title</small>
            <div><input className={inputStyle} value={title} onChange={(e) => {setTitle(e.target.value)}} /></div>
          </div>
          <div>
            <small>Description</small>
            <div><input className={inputStyle} value={description} onChange={(e) => {setDescription(e.target.value)}} /></div>
          </div>
      </div>
    </div>
  )
}
