import { useEffect, useState } from "react";
import {
  CMSInterface,
  PromotionBannerInterface,
} from "../../pages/adminpages/cms-settings";
import { CgClose } from "react-icons/cg";
import { Box, Modal, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { errorHandler } from "../../../utils/errorHandler";
import { UpdateRecordType } from "../../../hooks/useCMS";
import Joi from "joi";
import { Bounce } from "react-activity";
import { v4 } from "uuid";
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

export default function PromotionBannerCMS({
  refreshCMS,
  cmsData,
  updateCMSRecord,
}: Props) {
  const [promotionBanner, setPromotionBanner] = useState<
    PromotionBannerInterface[]
  >([]);

  const [anyUnsavedChanges, setAnyUnsavedChanges] = useState(false);

  const [isSaving, setSaving] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [idToEdit, setIdToEdit] = useState("");
  const [title, setTitle] = useState("");
  // const [link, setLink] = useState("");
  const [show, setShow] = useState(false);

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
    if (id) handleEdit(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTitle("");
    // setLink("");
    setShow(false);
  };

  const handleEdit = (id: string) => {
    const findValue = promotionBanner.find((v) => v._id == id);

    if (!findValue) return;

    setIdToEdit(findValue._id!!);
    setTitle(findValue.title);
    // setLink(findValue.link);
    setShow(findValue.show);
  };

  const removeFromList = (id: string) => {
    const value = promotionBanner.filter((h) => h._id != id);
    setPromotionBanner(value);
    setAnyUnsavedChanges(true);
  };

  const addOrUpdateButton = () => {
    const { error } = Joi.object({
      title: Joi.string().required(),
      // link: Joi.string().required(),
      show: Joi.boolean().required(),
    }).validate({
      title,
      // link,
      show,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (idToEdit) {
      const value = promotionBanner.map(
        (heroData: PromotionBannerInterface) => {
          if (heroData._id == idToEdit) {
            heroData.title = title;
            // heroData.link = link;
            heroData.show = show;
          }
          return heroData;
        }
      );
      setPromotionBanner(value);
      setIdToEdit("");
    } else {
      setPromotionBanner([
        {
          _id: "temp" + v4(),
          title,
          // link,
          show,
        },
        ...promotionBanner,
      ]);
    }

    closeModal();
    setTitle("");
    // setLink("");
    setShow(false);
    setAnyUnsavedChanges(true);
  };

  const saveButton = async () => {
    try {
      setSaving(true);

      const h = promotionBanner.map((value) => {
        if (value._id?.startsWith("temp")) {
          delete value._id;
        }
        return value;
      });

      await updateCMSRecord("promotion-banner", { promotionBanner: h });

      await refreshCMS();

      setAnyUnsavedChanges(false);

      toast.success("Promotion banner updated succesfully");
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while saving, kindly try again later."
        )
      );
    } finally {
      setSaving(false);
    }
  };

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
    if (!cmsData) return;
    setPromotionBanner(cmsData?.promotionBanner!!);
  }, [cmsData]);

  const inputStyle =
    "py-2 px-2 w-full border border-1 border-[#333] rounded-md";

  return (
    <div className="p-4 h-[95%]">
      <div className="flex justify-between items-center mb-2">
        <button
          className="px-8 py-1 border text-primary border-2 rounded-md border-primary"
          onClick={() => {
            openModal("");
          }}
        >
          Create
        </button>
        <div className="flex gap-4">
          {anyUnsavedChanges && (
            <div className="text-[#aaa]">Unsaved changes</div>
          )}
          <button
            className="px-8 py-1 border text-primary border-2 rounded-md border-primary"
            onClick={() => {
              refreshCMS();
              setAnyUnsavedChanges(false);
            }}
          >
            Refresh List
          </button>
          <button
            className="px-8 py-1 border text-[white] bg-primary border-2 rounded-md border-primary"
            onClick={saveButton}
          >
            {" "}
            {isSaving ? <Bounce /> : "Save"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 h-full overflow-y-auto">
        {promotionBanner?.map((tacData) => {
          return (
            <div className="flex flex-col gap-4 border border-2 rounded-md p-2 h-fit">
              <div>
                <small>Title</small>
                <div>{tacData?.title}</div>
              </div>
              {/* <div>
                <small>Link</small>
                <div>{tacData?.link}</div>
              </div> */}

              <div>
                <div>
                  <input
                    type="checkbox"
                    checked={tacData.show}
                    onChange={() => {}}
                  />{" "}
                  Show on desktop
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <button
                  className="px-8 py-1 w-1/2 border text-primary border-2 rounded-md border-primary"
                  onClick={() => {
                    openModal(tacData?._id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-8 py-1 w-1/2 text-[red] border-2 rounded-md border-[red]"
                  onClick={() => {
                    removeFromList(tacData._id!!);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
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
                {idToEdit ? "Update" : "Create New"} Promotion banner
              </div>
              <button onClick={closeModal}>
                <CgClose size={25} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <small>Title</small>
                <div>
                  <input
                    className={inputStyle}
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
              </div>
              {/* <div>
                <small>Link</small>
                <div>
                  <input
                    className={inputStyle}
                    value={link}
                    onChange={(e) => {
                      setLink(e.target.value);
                    }}
                  />
                </div>
              </div> */}
              <div className="mb-4">
                <small>Answer</small>
                <div>
                  <div>
                    <input
                      type="checkbox"
                      checked={show}
                      onChange={() => {
                        setShow(!show);
                      }}
                    />{" "}
                    Show on desktop
                  </div>
                </div>
              </div>
              <button
                className="bg-primary rounded-md text-white py-2"
                onClick={addOrUpdateButton}
              >
                {idToEdit ? "Update" : "Create"}
              </button>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
