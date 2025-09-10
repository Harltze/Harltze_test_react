import { useEffect, useState } from 'react'
import { CMSInterface, HeroInterface } from '../../pages/adminpages/cms-settings';
import { CgClose } from 'react-icons/cg';
import { Box, Modal, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { errorHandler } from '../../../utils/errorHandler';
import { UpdateRecordType } from '../../../hooks/useCMS';
import { useFileUpload } from '../../../hooks/useFileUploads';
import Joi from 'joi';
import { Bounce } from 'react-activity';
import { v4 } from 'uuid';

interface Props {
  refreshCMS: () => Promise<void>;
  cmsData: CMSInterface | null;
  updateCMSRecord: (updateType: UpdateRecordType, payload: any) => Promise<any>;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AdminHeroCMS({refreshCMS, cmsData, updateCMSRecord}: Props) {

  const [hero, setHero] = useState<HeroInterface[]>([]);
  
  const [idToEdit, setIdToEdit] = useState("");
  const[pictureURL, setPictureURL] = useState("");
  const[header, setHeader] = useState("");
  const[description, setDescription] = useState("");
  const[linkButtonTitle, setLinkButtonTitle] = useState("");
  const[linkButtonUrl, setLinkButtonUrl] = useState("");
  const [anyUnsavedChanges, setAnyUnsavedChanges] = useState(false);

  const [isSaving, setSaving] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);


  const {uploadFile, isFileUploadLoading} = useFileUpload();

  const openModal = (id?: string) => {
    if(id) handleEdit(id);
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
    setIdToEdit("");
    setPictureURL("");
    setHeader("");
    setDescription("");
    setLinkButtonTitle("");
    setLinkButtonUrl("");
  }

  const handleEdit = (id: string) => {
    const findValue = hero.find(v => v._id == id);

    if(!findValue) return;

    setIdToEdit(findValue._id!!);
    setPictureURL(findValue.pictureURL);
    setHeader(findValue.header);
    setDescription(findValue.description);
    setLinkButtonTitle(findValue.linkButtonTitle);
    setLinkButtonUrl(findValue.linkButtonUrl);
    
  }


  const removeFromList = (id: string) => {
    const value = hero.filter(h => h._id != id);
    setHero(value);
    setAnyUnsavedChanges(true);
  }

  const addOrUpdateButton = () => {

    const {error} = Joi.object({
      pictureURL: Joi.string().required(),
      header: Joi.string().required(),
      description: Joi.string().required(),
      linkButtonTitle: Joi.string().required(),
      linkButtonUrl: Joi.string().required(),
    }).validate({
      pictureURL,
      header,
      description,
      linkButtonTitle,
      linkButtonUrl,
    });

    if(error) {
      toast.error(error.message);
      return;
    }

    if(idToEdit) {
      const value = hero.map((heroData: HeroInterface) => {
        if(heroData._id == idToEdit) {
          heroData.pictureURL = pictureURL;
          heroData.header = header;
          heroData.description = description;
          heroData.linkButtonTitle = linkButtonTitle;
          heroData.linkButtonUrl = linkButtonUrl;
        }
        return heroData;
      });
      setHero(value);
      setIdToEdit("");
    } else {
      setHero([{
        _id: "temp" + v4(),
        pictureURL,
        header,
        description,
        linkButtonTitle,
        linkButtonUrl
      }, ...hero]);
    }

    closeModal();
    setIdToEdit("");
    setPictureURL("");
    setHeader("");
    setDescription("");
    setLinkButtonTitle("");
    setLinkButtonUrl("");
    setAnyUnsavedChanges(true);
  }

  const saveButton = async () => {
    try {
      
      setSaving(true);

      const h = hero.map(value => {
        if(value._id?.startsWith("temp")) {
          delete value._id;
        }
        return value
      });

      await updateCMSRecord("hero", {hero: h});

      await refreshCMS();

      toast.success("Hero updated succesfully");

      setAnyUnsavedChanges(false);

    } catch (error) {
      toast.error(errorHandler(error, "An error occurred while saving, kindly try again later."));
    } finally {
      setSaving(false);
    }
  }

  const handleFileUpload = async (e: any) => {
    try {
      if((e.target.files).length == 0) return;
      const res = await uploadFile(e.target.files[0]);
      setPictureURL(res.data.result.fileUrl);
    } catch (error) {
      toast.error(errorHandler(error, "An error occurred while uploading file, kindly try again later."));
    }
  }

  useEffect(() => {
    if(!cmsData) return;
    setHero(cmsData?.hero!!);
  }, [cmsData]);

  const inputStyle =
    "py-2 px-2 w-full border border-1 border-[#333] rounded-md";

  return (
    <div className='p-4 h-[95%]'>
      <div className='flex flex-col md:flex-row gap-2 md:justify-between items-center mb-2 w-full'>
        <button className='w-full md:w-fit px-8 py-1 border text-primary border-2 rounded-md border-primary' onClick={() => {openModal("")}}>Create</button>
        <div className='flex flex-col md:flex-row gap-2 items-center w-full md:w-fit'>
          {
           anyUnsavedChanges && <div className='text-[#aaa]'>Unsaved changes</div>
          }
        <button className='w-full md:w-fit px-8 py-1 border text-primary border-2 rounded-md border-primary inline-block' onClick={() => {
          refreshCMS();
          setAnyUnsavedChanges(false);
          }}>Refresh List</button>
        <button className='w-full md:w-fit px-8 py-1 border text-[white] bg-primary border-2 rounded-md border-primary' onClick={saveButton}> {isSaving ? <Bounce /> : "Save"}</button>

        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full overflow-y-auto'>
        {
          hero?.map((heroData) => {
            return (
              <div className='flex flex-col gap-4 border border-2 w-full rounded-md p-2'>
                <div><img src={heroData?.pictureURL} className='h-[240px] rounded-md' /></div>
                <div>
                  <small>Title</small>
                  <div>{heroData?.header}</div>
                </div>
                <div>
                  <small>Description</small>
                  <div>{heroData?.description}</div>
                </div>
                <div>
                  <small>Action Button Title</small>
                  <div>{heroData?.linkButtonTitle}</div>
                </div>
                <div>
                  <small>Action Button Link</small>
                  <div>{heroData?.linkButtonUrl}</div>
                </div>
                <div className='mt-4 flex gap-4'>
                  <button className='px-8 py-1 w-1/2 border text-primary border-2 rounded-md border-primary' onClick={() => {openModal(heroData?._id)}}>Edit</button>
                  <button className='px-8 py-1 w-1/2 text-[red] border-2 rounded-md border-[red]' onClick={() => {removeFromList(heroData._id!!)}}>Remove</button>
                </div>
              </div>
            );
          })
        }
      </div>
      <Modal
                open={isModalOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                // contentLabel="Example Modal"
              >
                <Box sx={style}>
                  <Typography>
                    <div className="flex justify-between items-center mb-8">
                      <div className="font-bold text-[20px]">
                        {idToEdit ? "Update" : "Create New"} Hero Section
                      </div>
                      <button onClick={closeModal}>
                        <CgClose size={25} />
                      </button>
                    </div>
                    <div className='flex flex-col gap-4'>
                      <div>
                  <div className='flex flex-col justify-center items-center h-[160px] border border-2 border-dashed border-[#ccc] text-center'>
                    {
                      pictureURL ? (
                        <img src={pictureURL} className='h-[110px] mx-auto' />
                      ) : (
                        <div>{isFileUploadLoading ? "Uploading file... Please wait." : "No picture chosen"}</div>
                      )
                    }
                    
                    <label htmlFor='file' className='border border-primary rext-primary rounded-md px-8 py-1 mt-2 inline-block'>Change image</label>
                    <input id='file' type='file' onChange={handleFileUpload} className='hidden' />
                  </div>
                </div>
                      <div>
                        <small>Header</small>
                        <div>
                          <input className={inputStyle} value={header} onChange={(e) => {setHeader(e.target.value)}} />
                        </div>
                      </div>
                      <div>
                        <small>Description</small>
                        <div>
                          <input className={inputStyle} value={description} onChange={(e) => {setDescription(e.target.value)}} />
                        </div>
                      </div>
                      <div>
                        <small>Button title</small>
                        <div>
                          <input className={inputStyle} value={linkButtonTitle} onChange={(e) => {setLinkButtonTitle(e.target.value)}} />
                        </div>
                      </div>
                      {/* <div>
                        <small>Button Link</small>
                        <div>
                          <input className={inputStyle} value={linkButtonUrl} onChange={(e) => {setLinkButtonUrl(e.target.value)}} />
                        </div>
                      </div> */}
                      
                      <div>
                        <small>Button Link URL</small>
                        <div>
                          <input className={inputStyle} value={linkButtonUrl} onChange={(e) => {setLinkButtonUrl(e.target.value)}} />
                        </div>
                      </div>
                      <button className='bg-primary rounded-md text-white py-2' onClick={addOrUpdateButton}>{idToEdit ? "Update" : "Create"}</button>
                    </div>
                  </Typography>
                </Box>
              </Modal>
    </div>
  )
}
