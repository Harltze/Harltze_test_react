import { useEffect, useState } from 'react'
import { CMSInterface, FAQInterface } from '../../pages/adminpages/cms-settings';
import { CgClose } from 'react-icons/cg';
import { Box, Modal, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { errorHandler } from '../../../utils/errorHandler';
import { UpdateRecordType } from '../../../hooks/useCMS';
import Joi from 'joi';
import { Bounce } from 'react-activity';
import { v4 } from 'uuid';
import DOMPurify from 'dompurify';
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

export default function FAQsCMS({refreshCMS, cmsData, updateCMSRecord}: Props) {

  const [faqs, setFAQs] = useState<FAQInterface[]>([]);

  const [anyUnsavedChanges, setAnyUnsavedChanges] = useState(false);

  const [isSaving, setSaving] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  // const quillRef = useRef(null);

  // const modules = useMemo(() => ({
  //   toolbar: [
  //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Headers
  //     ['bold', 'italic', 'underline', 'strike'], // Inline formatting
  //     ['blockquote', 'code-block'], // Block formatting
  //     [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Lists
  //     [{ 'script': 'sub'}, { 'script': 'super' }], // Subscript/Superscript
  //     [{ 'indent': '-1'}, { 'indent': '+1' }], // Indentation
  //     [{ 'direction': 'rtl' }], // Text direction
  //     [{ 'size': ['small', false, 'large', 'huge'] }], // Font size
  //     [{ 'color': [] }, { 'background': [] }], // Text color and background
  //     [{ 'font': [] }], // Font family
  //     [{ 'align': [] }], // Text alignment
  //     // ['link', 'image', 'video'], // Embeds
  //     ['clean'] // Remove formatting
  //   ],
  //   // You can add other modules like 'syntax' for code highlighting, etc.
  // }), []);

  // Define the formats that the editor will support
  // This should match the formats enabled by your modules
  // const formats = [
  //   'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
  //   'list', 'bullet', 'indent', 'link', 'image', 'video', 'code-block',
  //   'script', 'direction', 'size', 'color', 'background', 'font', 'align', 'clean'
  // ];

  const openModal = (id?: string) => {
    if(id) handleEdit(id);
    setModalOpen(true);
  }

  const closeModal = () => {
    setModalOpen(false);
    setQuestion("");
    setAnswer("");
  }

  const handleEdit = (id: string) => {
    const findValue = faqs.find(v => v._id == id);

    if(!findValue) return;

    setIdToEdit(findValue._id!!);
    setQuestion(findValue.question);
    setAnswer(findValue.answer);
    
  }

  const [idToEdit, setIdToEdit] = useState("");
  const[question, setQuestion] = useState("");
  const[answer, setAnswer] = useState("");

  const removeFromList = (id: string) => {
    const value = faqs.filter(h => h._id != id);
    setFAQs(value);
    setAnyUnsavedChanges(true);
  }

  const addOrUpdateButton = () => {

    const {error} = Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
    }).validate({
      question,
      answer
    });

    if(error) {
      toast.error(error.message);
      return;
    }

    if(idToEdit) {
      const value = faqs.map((heroData: FAQInterface) => {
        if(heroData._id == idToEdit) {
          heroData.question = question;
          heroData.answer = answer;
        }
        return heroData;
      });
      setFAQs(value);
      setIdToEdit("");
    } else {
      setFAQs([{
        _id: "temp" + v4(),
        question,
        answer,
      }, ...faqs]);
    }

    closeModal();
    setQuestion("");
    setAnswer("");
    setAnyUnsavedChanges(true);
  }

  const saveButton = async () => {
    try {
      
      setSaving(true);

      const h = faqs.map(value => {
        if(value._id?.startsWith("temp")) {
          delete value._id;
        }
        return value
      });

      await updateCMSRecord("faqs", {faqs: h});

      await refreshCMS();

      setAnyUnsavedChanges(false);

      toast.success("Frequently asked questions updated succesfully");

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
    setFAQs(cmsData?.faqs!!);
  }, [cmsData]);

  const inputStyle =
    "py-2 px-2 w-full border border-1 border-[#333] rounded-md";

  return (
    <div className='p-4 h-[95%]'>
      <div className='flex justify-between items-center mb-2'>
        <button className='px-8 py-1 border text-primary border-2 rounded-md border-primary' onClick={() => {openModal("")}}>Create</button>
        <div className='flex gap-4'>
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
          faqs?.map((tacData) => {
            return (
              <div className='flex flex-col gap-4 border border-2 rounded-md p-2 h-fit'>
                <div>
                  <small>Question</small>
                  <div>{tacData?.question}</div>
                </div>
                <div>
                  <small>Answer</small>
                  <div className="prose" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(tacData?.answer)}} />
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
                        {idToEdit ? "Update" : "Create New"} Frequestly asked questions
                      </div>
                      <button onClick={closeModal}>
                        <CgClose size={25} />
                      </button>
                    </div>
                    <div className='flex flex-col gap-4'>
                      <div>
                        <small>Question</small>
                        <div>
                          <input className={inputStyle} value={question} onChange={(e) => {setQuestion(e.target.value)}} />
                        </div>
                      </div>
                      <div className='mb-4'>
                        <small>Answer</small>
                        <div>
                          {/* <ReactQuill
                            ref={quillRef}
                            theme="snow" // 'snow' is a clean, modern theme, 'bubble' is another option
                            value={description} // The HTML content to display in the editor
                            onChange={setDescription} // Callback for content changes
                            modules={modules} // Toolbar and other functionality
                            formats={formats} // Allowed content formats
                            placeholder="Start typing your content here..."
                            className={"h-64 mb-10 rounded-md"} // Set a height for the editor and add margin-bottom
                          /> */}
                          <textarea className={inputStyle} value={answer} onChange={(e) => {setAnswer(e.target.value)}} />
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
