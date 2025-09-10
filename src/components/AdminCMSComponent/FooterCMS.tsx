import { useEffect, useState } from 'react'
import { CMSInterface, FooterInterface, FooterLinksInterface } from '../../pages/adminpages/cms-settings';
import { CgClose } from 'react-icons/cg';
import { Box, Modal, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { errorHandler } from '../../../utils/errorHandler';
import { UpdateRecordType } from '../../../hooks/useCMS';
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

export default function FooterCMS({refreshCMS, cmsData, updateCMSRecord}: Props) {

  const [footer, setFooter] = useState<FooterInterface[]>([]);

  const [anyUnsavedChanges, setAnyUnsavedChanges] = useState(false);

  const [isSaving, setSaving] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLinksModalOpen, setLinksModalOpen] = useState(false);

  
  const [idToEdit, setIdToEdit] = useState("");
  const[title, setTitle] = useState("");
  const[links, setLinks] = useState<FooterLinksInterface[]>([]);
  
  const [singleLinkTitle, setSingleLinkTitle] = useState("");
  const [singleLink, setSingleLink] = useState("");
  const [footerLinkIds, setFooterLinkIds] = useState("");
  
  const openLinksModal = (footerId?: string, linkToEdit?: string) => {

    if(!footerId) return;

    if(footerId && linkToEdit) {
      const value = footer.find(v1 => v1._id == footerId);
      const link = value?.links.find(v2 => v2._id == linkToEdit);
      setSingleLinkTitle(link?.title!!);
      setSingleLink(link?.link!!);
      setFooterLinkIds(`${footerId}----${linkToEdit}`);
      setLinksModalOpen(true);
      return;
    }

    if(footerId && !linkToEdit) {
      setSingleLinkTitle("");
      setSingleLink("");
      setFooterLinkIds(`${footerId}`);
      setLinksModalOpen(true);
      return;
    }
  }

  const removeLink = (footerId?: string, linkToEdit?: string) => {

    if(!footerId) return;

    if(footerId && linkToEdit) {
      let value = footer.find(v1 => v1._id == footerId);
      const links = value?.links.filter(v2 => v2._id != linkToEdit);
      if(value) value.links = links && links.length > 0 ? links : [];
      const updatedFooter = footer.map((v) => {
        if(v._id == value?._id) {
          v = value!!;
        }
        return v;
      });
      setFooter(updatedFooter);
      setFooterLinkIds("");
      return;
    }
  }

  const addOrUpdateLinkButton = () => {
    const [footerId, linkToEdit] = footerLinkIds.split("----");

    if(footerId && !linkToEdit) {
      let value = footer.find(v1 => v1._id == footerId);
      let updatedLinks = [{_id: "temp" + v4(), title: singleLinkTitle, link: singleLink}, ...value!!.links];
      
      value!!.links = updatedLinks;

      const updatedFooter = footer.map((v) => {
        if(v._id == value!!._id) {
          v = value!!;
        }
        return v;
      });
      setFooter(updatedFooter);
      setFooterLinkIds("");
      setLinksModalOpen(false);
    }

    if(footerId && linkToEdit) {
      let value = footer.find(v1 => v1._id == footerId);
      let links = value!!.links.map(v2 => {
        if(v2._id == linkToEdit) {
          v2.title = singleLinkTitle;
          v2.link = singleLink;
        }
        return v2;
      });
      if(value) {
        value.links = links;
      }
      const updatedFooter = footer.map((v) => {
        if(v._id == value!!._id) {
          v = value!!;
        }
        return v;
      });
      setFooter(updatedFooter);
      setFooterLinkIds("");
      setLinksModalOpen(false);
    }

  }

  const closeLinkModal = () => {
    setLinksModalOpen(false);
    setSingleLinkTitle("");
    setSingleLink("");
    setFooterLinkIds("");
  }

 

  const openModal = (id?: string) => {
    if(id) handleEdit(id);
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
    setTitle("");
    setLinks([]);
    setSingleLinkTitle("");
    setSingleLink("");
  }

  const handleEdit = (id: string) => {
    const findValue = footer.find(v => v._id == id);

    if(!findValue) return;

    setIdToEdit(findValue._id!!);
    setTitle(findValue.title);
    setLinks(findValue.links);
    setSingleLinkTitle("");
    setSingleLink("");
  }


  const removeFromList = (id: string) => {
    const value = footer.filter(h => h._id != id);
    setFooter(value);
    setAnyUnsavedChanges(true);
  }

  const addOrUpdateButton = () => {

    const {error} = Joi.object({
      title: Joi.string().required(),
      // singleLink: Joi.string().required(),
      // links: Joi.array().items({
      //   iconLink: Joi.string().required(),
      //   title: Joi.string().required(),
      //   link: Joi.string().required(),
      // }).min(1).required(),
    }).validate({
      title
    });

    if(error) {
      toast.error(error.message);
      return;
    }

    if(idToEdit) {
      const value = footer.map((heroData: FooterInterface) => {
        if(heroData._id == idToEdit) {
          heroData.title = title;
          heroData.links = links;
        }
        return heroData;
      });
      setFooter(value);
    } else {
      setFooter([{
        _id: "temp" + v4(),
        title,
        links: [],
      }, ...footer]);
    }

    closeModal();
    setSingleLinkTitle("");
    setSingleLink("");
    setLinks([]);
    setAnyUnsavedChanges(true);
  }

  const saveButton = async () => {
    try {
      
      setSaving(true);

      const f = [...footer];

      const h = f.map(value => {
        delete value._id;
        value.links = value.links.map(v => {
          return {
            link: v.link,
            title: v.title
          };
        });
        return value;
      });

      const {error} = Joi.array().items({
        title: Joi.string().required(),
        links: Joi.array().items({
          title: Joi.string().required(),
          link: Joi.string().required()
        }).min(1).required()
      }).required().validate(h);

      if(error) {
        toast.error(error.message);
        await refreshCMS();
        return;
      }

      


      await updateCMSRecord("footer", {footer: h});

      await refreshCMS();

      setAnyUnsavedChanges(false);

      toast.success("Footer updated succesfully");

    } catch (error) {
      toast.error(errorHandler(error, "An error occurred while saving, kindly try again later."));
    } finally {
      setSaving(false);
    }
  }

  // const handleFileUpload = async (e: any) => {
  //   try {
  //     if((e.target.files).length == 0) return;
  //     const res = await uploadFile(e.target.files[0]);
  //     setPictureURL(res.data.result.fileUrl);
  //   } catch (error) {
  //     toast.error(errorHandler(error, "An error occurred while uploading file, kindly try again later."));
  //   }
  // }

  useEffect(() => {
    if(!cmsData) return;
    setFooter(cmsData?.footer!!);
  }, [cmsData]);

  const inputStyle =
    "py-2 px-2 w-full border border-1 border-[#333] rounded-md";

  return (
    <div className='p-4 h-[95%]'>
      <div className='flex justify-between items-center mb-2'>
        <button className='px-8 py-1 border text-primary border-2 rounded-md border-primary' onClick={() => {openModal()}}>Create</button>
        <div className='flex gap-4 items-center'>
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
      <div className='grid grid-cols-1 gap-4 h-full overflow-y-auto'>
        {
          footer?.map((tacData) => {
            return (
              <div className='flex flex-col gap-4 border border-2 rounded-md p-2 h-fit'>
                <div>
                  <small>Title</small>
                  <div>{tacData?.title}</div>
                </div>
                <div>
                  <small>Links</small>
                  <div className='grid grid-cols-2 gap-4'>
                    { tacData.links.length > 0 ?
                      tacData.links.map((linkData) => {
                        return (
                          <div className='flex items-center gap-2 w-full justify-between border rounded-md py-2 px-4'>
                            <div>
                              <div>
                                <small>Icon Title</small>
                                <div>{linkData.title}</div>
                              </div>
                              <div>
                                <small>Icon Link</small>
                                <div>{linkData.link}</div>
                              </div>
                            </div>
                            <div className='flex flex-col gap-2'>
                              <button className='px-8 py-1 border text-primary border-2 rounded-md border-primary' onClick={() => {openLinksModal(tacData?._id, linkData._id)}}>Edit</button>
                              <button className='px-8 py-1 border text-primary border-2 rounded-md border-primary' onClick={() => {removeLink(tacData?._id, linkData._id)}}>Remove</button>
                            </div>
                          </div>
                        );
                      }) : (
                        <div className='text-center col-span-2'>
                          <div>No link added</div>
                        </div>
                      )
                    }
                  </div>
                </div>
                
                <div className='mt-4 flex gap-4'>
                  <button className='px-8 py-1 w-1/2 border text-primary border-2 rounded-md border-primary' onClick={() => {openLinksModal(tacData?._id, '')}}>Add Link</button>
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
                        {idToEdit ? "Update" : "Create New"} Footer
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
                      <button className='bg-primary rounded-md text-white py-2' onClick={addOrUpdateButton}>{idToEdit ? "Update" : "Create"}</button>
                    </div>
                  </Typography>
                </Box>
              </Modal>

              <Modal
                open={isLinksModalOpen}
                onClose={closeLinkModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                // contentLabel="Example Modal"
              >
                <Box sx={style}>
                  <Typography>
                    <div className="flex justify-between items-center mb-8">
                      <div className="font-bold text-[20px]">
                        {idToEdit ? "Update" : "Create New"} Links Modal
                      </div>
                      <button onClick={closeLinkModal}>
                        <CgClose size={25} />
                      </button>
                    </div>
                    <div className='flex flex-col gap-4'>
                      <div>
                        <small>Link Title</small>
                        <div>
                          <input className={inputStyle} value={singleLinkTitle} onChange={(e) => {setSingleLinkTitle(e.target.value)}} />
                        </div>
                      </div>
                      <div>
                        <small>Link</small>
                        <div>
                          <input className={inputStyle} value={singleLink} onChange={(e) => {setSingleLink(e.target.value)}} />
                        </div>
                      </div>
                      <button className='bg-primary rounded-md text-white py-2' onClick={addOrUpdateLinkButton}>{footerLinkIds.split("----").length == 1 ? "Create" : "Update"}</button>
                    </div>
                  </Typography>
                </Box>
              </Modal>
    </div>
  )
}
