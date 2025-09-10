import { useEffect, useState } from 'react'
import { CMSInterface, SocialMediaInterface } from '../../pages/adminpages/cms-settings';
import { CgClose } from 'react-icons/cg';
import { Box, Modal, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { errorHandler } from '../../../utils/errorHandler';
import { UpdateRecordType } from '../../../hooks/useCMS';
import Joi from 'joi';
import { Bounce } from 'react-activity';
import { v4 } from 'uuid';
import { useFileUpload } from '../../../hooks/useFileUploads';
// import ReactQuill from 'react-quill';

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

export default function SocialMediaHandlesCMS({refreshCMS, cmsData, updateCMSRecord}: Props) {

  const [socialMedia, setSocialMedia] = useState<SocialMediaInterface[]>([]);

  const [anyUnsavedChanges, setAnyUnsavedChanges] = useState(false);

  const {uploadFile, isFileUploadLoading} = useFileUpload();

  const [isSaving, setSaving] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  
  const [idToEdit, setIdToEdit] = useState("");
  const[title, setTitle] = useState("");
  const[link, setLink] = useState("");
  const[iconLink, setIconLink] = useState("");

  const openModal = (id?: string) => {
    if(id) handleEdit(id);
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
    setTitle("");
    setLink("");
    setIconLink("");
  }

  const handleEdit = (id: string) => {
    const findValue = socialMedia.find(v => v._id == id);

    if(!findValue) return;

    setIdToEdit(findValue._id!!);
    setTitle(findValue.title);
    setLink(findValue.link);
    setIconLink(findValue.iconLink);
    
  }


  const removeFromList = (id: string) => {
    const value = socialMedia.filter(h => h._id != id);
    setSocialMedia(value);
    setAnyUnsavedChanges(true);
  }

  const addOrUpdateButton = () => {

    const {error} = Joi.object({
      title: Joi.string().required(),
      link: Joi.string().required(),
      iconLink: Joi.string().required(),
    }).validate({
      title,
      link,
      iconLink
    });

    if(error) {
      toast.error(error.message);
      return;
    }

    if(idToEdit) {
      const value = socialMedia.map((heroData: SocialMediaInterface) => {
        if(heroData._id == idToEdit) {
          heroData.title = title;
          heroData.link = link;
          heroData.iconLink = iconLink;
        }
        return heroData;
      });
      setSocialMedia(value);
      setIdToEdit("");
    } else {
      setSocialMedia([{
        _id: "temp" + v4(),
        title,
        link,
        iconLink
      }, ...socialMedia]);
    }

    closeModal();
    setTitle("");
    setLink("");
    setIconLink("");
    setAnyUnsavedChanges(true);
  }

  const saveButton = async () => {
    try {
      
      setSaving(true);

      const h = socialMedia.map(value => {
        if(value._id?.startsWith("temp")) {
          delete value._id;
        }
        return value
      });

      await updateCMSRecord("social-media-handles", {socialMedia: h});

      await refreshCMS();

      setAnyUnsavedChanges(false);

      toast.success("Social media handles updated succesfully");

    } catch (error) {
      toast.error(errorHandler(error, "An error occurred while saving, kindly try again later."));
    } finally {
      setSaving(false);
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {

      if(!e.target.files || e.target.files?.length == 0) return;

      const file = e.target.files[0];

      const fileUrl = (await uploadFile(file)).data.result.fileUrl;
      
      setIconLink(fileUrl); // Create preview URLs for selected images
    } catch (error) {
      toast.error("An error occurred while trying to upload pictures");
    }
  };

  useEffect(() => {
    if(!cmsData) return;
    setSocialMedia(cmsData?.socialMedia!!);
  }, [cmsData]);

  const inputStyle =
    "py-2 px-2 w-full border border-1 border-[#333] rounded-md";

  return (
    <div className='p-4 h-[95%]'>
      <div className='flex justify-between items-center mb-2'>
        <button className='px-8 py-1 border text-primary border-2 rounded-md border-primary' onClick={() => {openModal("")}}>Create</button>
        <div className='flex items-center gap-4'>
          {
           anyUnsavedChanges && <div className='text-[#aaa]'>Unsaved changes</div>
          }
        <button className='px-8 py-1 border text-primary border-2 rounded-md border-primary' onClick={() => {
          refreshCMS();
          setAnyUnsavedChanges(false);
          }}>Refresh List</button>
        <button className='px-8 py-1 border text-[white] bg-primary border-2 rounded-md border-primary' onClick={saveButton}> {isSaving ? <Bounce /> : "Save"}</button>

        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 h-full overflow-y-auto'>
        {
          socialMedia?.map((tacData) => {
            return (
              <div className='border border-2 rounded-md h-fit p-2'>
                <div className='flex justify-between items-center gap-4'>
                  <div>
                    <div>
                        <small>Title</small>
                        <div>{tacData?.title}</div>
                      </div>
                      <div>
                        <small>Link</small>
                        <div>{tacData?.link}</div>
                      </div>
                    </div>

                  <div>
                    <div>
                      <img src={tacData?.iconLink} className='h-[100px] w-[100px] rounded-full' />
                    </div>
                  </div>
                </div>
                  <div className='mt-4 flex gap-4'>
                    <button className='px-8 py-1 w-1/2 border text-primary border-2 rounded-md border-primary' onClick={() => {openModal(tacData?._id)}}>Edit</button>
                    <button className='px-8 py-1 w-1/2 text-[red] border-2 rounded-md border-[red]' onClick={() => {removeFromList(tacData._id!!)}}>Remove</button>
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
                        {idToEdit ? "Update" : "Create New"} Social Media Handles
                      </div>
                      <button onClick={closeModal}>
                        <CgClose size={25} />
                      </button>
                    </div>
                    <div className='flex flex-col gap-4'>
                      <div>
                        <small>Title</small>
                        <div>
                          <input className={inputStyle} value={title} onChange={(e) => {setTitle(e.target.value)}} />
                        </div>
                      </div>
                      <div>
                        <small>Link</small>
                        <div>
                          <input className={inputStyle} value={link} onChange={(e) => {setLink(e.target.value)}} />
                        </div>
                      </div>
                      <div>
                        <small>Icon Link</small>
                        <div className='text-center border border-dashed rounded-md py-4'>
                          {
                          (iconLink && !isFileUploadLoading) && <img src={iconLink} className='h-[100px] w-fit mx-auto rounded-full' />
                        }
                          <label htmlFor='fileinput' className='border border-primary text-primary inline-block py-1 px-4 rounded-md my-2'>{iconLink ? "Change": "Upload"} image</label>
                          <input id='fileinput' type='file' className="hidden" onChange={handleImageChange} />
                          { isFileUploadLoading && (
                            <div>
                              <Bounce color='black' />
                            </div>
                            )
                        }
                        </div>
                      </div>
                      <div className='text-center'>
                        

                        
                      </div>
                      <button className='bg-primary rounded-md text-white py-2' onClick={addOrUpdateButton}>{idToEdit ? "Update" : "Create"}</button>
                    </div>
                  </Typography>
                </Box>
              </Modal>
    </div>
  )
}
