import { useEffect, useMemo, useRef, useState } from "react";
import {
  CMSInterface,
  MeetOurTeam,
  MissionAndCustomersInterface,
} from "../../pages/adminpages/cms-settings";
import { toast } from "react-toastify";
import { errorHandler } from "../../../utils/errorHandler";
import { UpdateRecordType } from "../../../hooks/useCMS";
import Joi from "joi";
import { Bounce } from "react-activity";
import { useFileUpload } from "../../../hooks/useFileUploads";
import { Box, Modal, Typography } from "@mui/material";
import { CgClose } from "react-icons/cg";
import ReactQuill from "react-quill";
import { v4 } from "uuid";

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

export default function AboutUsCMS({
  refreshCMS,
  cmsData,
  updateCMSRecord,
}: Props) {
  const { uploadFile } = useFileUpload();
  const [isImageUploading, setIsImageUpoading] = useState(false);
  const [isUploading, setIsUpoading] = useState(false);

  const [isMissionAndValuesOpen, setMissionAndValuesOpen] = useState(false);
  const [isWhatCustomersSayOpen, setWhatCustomersSayOpen] = useState(false);

  const [missionIdToEdit, setMissionIdToEdit] = useState("");
  const [missionValue, setMissionValue] = useState("");
  const [whatCSayIdToEdit, setWhatCSayIdToEdit] = useState("");
  const [whatCSayValue, setWhatCSayValue] = useState("");

  const openMissionAndValuesModal = (id: string, value: string) => {
    setMissionIdToEdit(id);
    setMissionValue(value);
    setMissionAndValuesOpen(true);
  };

  const removeMissionAndValue = (id: string) => {
    const filteredValue = ourMissionAndValuesArray.filter(
      (v: any) => v?._id != id
    );
    setOurMissionAndVAluesArray(filteredValue);
  };

  const openWhatCustomersSay = (id: string, value: string) => {
    setMissionIdToEdit(id);
    setMissionValue(value);
    setWhatCustomersSayOpen(true);
  };

  const removeWhatCustomersSay = (id: string) => {
    const filteredValue = whatOurCustomersSayArray.filter(
      (v: any) => v?._id != id
    );
    setWhatOurCustomersSayArray(filteredValue);
  };

  const closeMissionAndValuesModal = () => {
    setMissionAndValuesOpen(false);
    setMissionIdToEdit("");
    setMissionValue("");
  };

  const closeWhatCustomersSayModal = () => {
    setWhatCustomersSayOpen(false);
    setWhatCSayIdToEdit("");
    setWhatCSayValue("");
  };

  const [headerTitle, setHeaderTitle] = useState("");
  const [headerDescription, setHeaderDescription] = useState("");
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [pictureURL, setPictureURL] = useState("");
  // const [aboutPictureLink, aboutPictureLink] = useState("");
  const [whyWeExistTitle, setWhyWeExistTitle] = useState("");
  const [whyWeExistDescription, setWhyWeExistDescription] = useState("");
  const [joinTheBuildTitle, setJoinTheBuildTitle] = useState("");
  const [joinTheBuildDescription, setJoinTheBuildDescription] = useState("");
  const [ourJourneyTitle, setOurJourneyTitle] = useState("");
  const [ourJourneyDescription, setOurJourneyDescription] = useState("");
  const [meetOurTeam, setMeetOurTeam] = useState<MeetOurTeam[]>([]);
  const [ourMissionAndValuesArray, setOurMissionAndVAluesArray] = useState<
    MissionAndCustomersInterface[]
  >([]);
  const [whatOurCustomersSayArray, setWhatOurCustomersSayArray] = useState<
    MissionAndCustomersInterface[]
  >([]);

  const [ourTeamIdToEdit, _setOurTeamIdToEdit] = useState("");
  const [ourTeamMemberName, setOurTeamMemberName] = useState("");
  const [ourTeamMemberPicture, setOurTeamMemberPicture] = useState("");
  const [ourTeamMemberRole, setOurTeamMemberRole] = useState("");
  const [isTeamImageUpoading, setIsTeamImageUpoading] = useState(false);
  const [isTeamModalOpen, _setIsTeamModalOpen] = useState(false);

  const handleOurTeamFileUpload = async (e: any) => {
    try {
      if (e.target.files.length == 0) return;
      setIsTeamImageUpoading(true);
      const res = await uploadFile(e.target.files[0]);
      setOurTeamMemberPicture(res.data.result.fileUrl);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while uploading file, kindly try again later."
        )
      );
    } finally {
      setIsTeamImageUpoading(false);
    }
  };

  // const openOurTeamModal = (id: string, name: string, picture: string, role: string) => {
  //   console.log(id, name, picture, role);
  //   setOurTeamIdToEdit(id);
  //   setOurTeamMemberName(name);
  //   setOurTeamMemberPicture(picture);
  //   setOurTeamMemberRole(role);
  //   setIsTeamModalOpen(true);
  // }

  const closeOurTeamModal = () => {
    // setOurTeamIdToEdit("");
    setOurTeamMemberName("");
    setOurTeamMemberPicture("");
    setOurTeamMemberRole("");
    // setIsTeamModalOpen(false);
  }

  // const addOrEditTeamMember = () => {
  //   if(ourTeamIdToEdit) {
  //     const updatedTeam = meetOurTeam.map(t => {
  //       if(t._id == ourTeamIdToEdit) {
  //         return {
  //           _id: ourTeamIdToEdit,
  //           name: ourTeamMemberName,
  //           picture: ourTeamMemberPicture,
  //           role: ourTeamMemberRole
  //         } as MeetOurTeam;
  //       }
  //       return t;
  //     });
  //     setMeetOurTeam(updatedTeam);
  //   } else {
  //     const updatedTeam = [...meetOurTeam, {
  //           _id: `temp-${v4()}`,
  //           name: ourTeamMemberName,
  //           picture: ourTeamMemberPicture,
  //           role: ourTeamMemberRole
  //         }]
  //         setMeetOurTeam(updatedTeam);
  //   }
  //   closeOurTeamModal();
  // }

  // const removeOurTeamMember = (id: string) => {
  //   const updatedTeamMembers = meetOurTeam.filter(v => v._id != id);
  //   setMeetOurTeam(updatedTeamMembers);
  // }

  const quillRef = useRef(null);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers
        ["bold", "italic", "underline", "strike"], // Inline formatting
        ["blockquote", "code-block"], // Block formatting
        [{ list: "ordered" }, { list: "bullet" }], // Lists
        [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
        [{ indent: "-1" }, { indent: "+1" }], // Indentation
        [{ direction: "rtl" }], // Text direction
        [{ size: ["small", false, "large", "huge"] }], // Font size
        [{ color: [] }, { background: [] }], // Text color and background
        [{ font: [] }], // Font family
        [{ align: [] }], // Text alignment
        // ['link', 'image', 'video'], // Embeds
        ["clean"], // Remove formatting
      ],
      // You can add other modules like 'syntax' for code highlighting, etc.
    }),
    []
  );

  // Define the formats that the editor will support
  // This should match the formats enabled by your modules
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
    "script",
    "direction",
    "size",
    "color",
    "background",
    "font",
    "align",
    "clean",
  ];

  const saveAboutUsButton = async () => {
    try {
      const { error } = Joi.object({
        headerTitle: Joi.string().required(),
        headerDescription: Joi.string().required(),
        aboutTitle: Joi.string().required(),
        aboutDescription: Joi.string().required(),
        pictureURL: Joi.string().required(),
        ourJourneyTitle: Joi.string().required(),
        ourJourneyDescription: Joi.string().required(),
        whyWeExistTitle: Joi.string().required(),
        whyWeExistDescription: Joi.string().required(),
        joinTheBuildTitle: Joi.string().required(),
        joinTheBuildDescription: Joi.string().required(),
        meetOurTeam: Joi.array().required(),
        ourMissionAndValuesArray: Joi.array().required(),
        whatOurCustomersSayArray: Joi.array().required(),
      }).validate({
        headerTitle,
        headerDescription,
        aboutTitle,
        aboutDescription,
        pictureURL,
        whyWeExistTitle,
        whyWeExistDescription,
        joinTheBuildTitle,
        joinTheBuildDescription,
        ourJourneyTitle,
        ourJourneyDescription,
        meetOurTeam,
        ourMissionAndValuesArray,
        whatOurCustomersSayArray,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsUpoading(true);

      await updateCMSRecord("about-us", {
        aboutUs: {
          aboutUs: {
            title: headerTitle,
            description: headerDescription,
          },
          aboutSection: {
            title: aboutTitle,
            description: aboutDescription,
            imageUrl: pictureURL,
          },
          ourJourney: {
            title: ourJourneyTitle,
            description: ourJourneyDescription
          },
          whyWeExist: {
            title: whyWeExistTitle,
            description: whyWeExistDescription,
          },
          joinTheBuild: {
            title: joinTheBuildTitle,
            description: joinTheBuildDescription,
          },
          // meetOurTeam: meetOurTeam.map(v => {
          //   return {
          //     name: v.name,
          //     picture: v.picture,
          //     role: v.role,
          //   }
          // }),
          meetOurTeam: [],
          ourMissionAndValues: ourMissionAndValuesArray.map((v) => ({
            value: v.value,
          })),
          whatOurCustomersSay: whatOurCustomersSayArray.map((v) => ({
            value: v.value,
          })),
        },
      });

      await refreshCMS();

      toast.success("About us saved succesfully");
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while saving, kindly try again later."
        )
      );
    } finally {
      setIsUpoading(false);
    }
  };

  const addOrUpdateMissionAndValueButton = () => {
    if (missionIdToEdit) {
      const updated = ourMissionAndValuesArray.map((v: any) => {
        if (v?._id == missionIdToEdit) {
          return { value: missionValue, _id: v?._id };
        }
        return v;
      });
      setOurMissionAndVAluesArray(updated);
    } else {
      const v = [
        ...ourMissionAndValuesArray,
        { value: missionValue, _id: `temp-${v4()}` },
      ];
      setOurMissionAndVAluesArray(v);
    }
    closeMissionAndValuesModal();
  };

  const addOrUpdateWhatCustomersSayButton = () => {
    if (whatCSayIdToEdit) {
      const updated = whatOurCustomersSayArray.map((v: any) => {
        if (v?._id == missionIdToEdit) {
          return { value: whatCSayValue, _id: v?._id };
        }
        return v;
      });
      setWhatOurCustomersSayArray(updated);
    } else {
      const v = [
        ...whatOurCustomersSayArray,
        { value: whatCSayValue, _id: `temp-${v4()}` },
      ];
      setWhatOurCustomersSayArray(v);
    }
    closeWhatCustomersSayModal();
  };

  const handleFileUpload = async (e: any) => {
    try {
      if (e.target.files.length == 0) return;
      setIsImageUpoading(true);
      const res = await uploadFile(e.target.files[0]);
      setPictureURL(res.data.result.fileUrl);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while uploading file, kindly try again later."
        )
      );
    } finally {
      setIsImageUpoading(false);
    }
  };

  useEffect(() => {
    if (!cmsData) return;
    console.log(cmsData.aboutUs);
    setHeaderTitle(cmsData?.aboutUs?.aboutUs?.title);
    setHeaderDescription(cmsData?.aboutUs?.aboutUs?.description);
    setAboutTitle(cmsData?.aboutUs?.aboutSection?.title);
    setAboutDescription(cmsData?.aboutUs?.aboutSection?.description);
    setPictureURL(cmsData?.aboutUs?.aboutSection?.imageUrl);
    setWhyWeExistTitle(cmsData?.aboutUs?.whyWeExist?.title);
    setWhyWeExistDescription(cmsData?.aboutUs?.whyWeExist?.description);
    setOurJourneyTitle(cmsData.aboutUs?.ourJourney?.title);
    setOurJourneyDescription(cmsData.aboutUs?.ourJourney?.description);
    setJoinTheBuildTitle(cmsData?.aboutUs?.joinTheBuild?.title);
    setJoinTheBuildDescription(cmsData?.aboutUs?.joinTheBuild?.description);
    setMeetOurTeam(cmsData?.aboutUs?.meetOurTeam);
    setOurMissionAndVAluesArray(cmsData?.aboutUs?.ourMissionAndValues);
    setWhatOurCustomersSayArray(cmsData?.aboutUs?.whatOurCustomersSay);
  }, [cmsData]);

  const inputStyle =
    "py-2 px-2 w-full border border-1 border-[#333] rounded-md";

  return (
    <div>
      <div className="flex flex-col gap-4 p-4 h-[95%] overflow-y-auto">
        <div className="flex justify-end">
          <button
            className="bg-primary text-white rounded py-1 px-4"
            disabled={isUploading}
            onClick={saveAboutUsButton}
          >
            {isUploading ? <Bounce /> : "Update About"}
          </button>
        </div>
        <Modal
          open={isMissionAndValuesOpen}
          onClose={closeMissionAndValuesModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          // contentLabel="Example Modal"
        >
          <Box sx={style}>
            <Typography>
              <div className="flex justify-between items-center mb-8">
                <div className="font-bold text-[20px]">
                  {missionIdToEdit ? "Update" : "Create New"} Mission and Values
                </div>
                <button onClick={closeMissionAndValuesModal}>
                  <CgClose size={25} />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <div>
                    <ReactQuill
                      ref={quillRef}
                      theme="snow" // 'snow' is a clean, modern theme, 'bubble' is another option
                      value={missionValue} // The HTML content to display in the editor
                      onChange={setMissionValue} // Callback for content changes
                      modules={modules} // Toolbar and other functionality
                      formats={formats} // Allowed content formats
                      placeholder="Start typing your content here..."
                      className={"h-40 mb-10 rounded-md"} // Set a height for the editor and add margin-bottom
                    />
                  </div>
                </div>
                <button
                  className="bg-primary rounded-md text-white py-2 mt-20"
                  onClick={addOrUpdateMissionAndValueButton}
                >
                  {missionIdToEdit ? "Update" : "Create"}
                </button>
              </div>
            </Typography>
          </Box>
        </Modal>

        <Modal
          open={isWhatCustomersSayOpen}
          onClose={closeWhatCustomersSayModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          // contentLabel="Example Modal"
        >
          <Box sx={style}>
            <Typography>
              <div className="flex justify-between items-center mb-8">
                <div className="font-bold text-[20px]">
                  {whatCSayIdToEdit ? "Update" : "Create New"} What Customers
                  say
                </div>
                <button onClick={closeWhatCustomersSayModal}>
                  <CgClose size={25} />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <div>
                    <ReactQuill
                      ref={quillRef}
                      theme="snow" // 'snow' is a clean, modern theme, 'bubble' is another option
                      value={whatCSayValue} // The HTML content to display in the editor
                      onChange={setWhatCSayValue} // Callback for content changes
                      modules={modules} // Toolbar and other functionality
                      formats={formats} // Allowed content formats
                      placeholder="Start typing your content here..."
                      className={"h-40 mb-10 rounded-md"} // Set a height for the editor and add margin-bottom
                    />
                  </div>
                </div>
                <button
                  className="bg-primary rounded-md text-white py-2 mt-20"
                  onClick={addOrUpdateWhatCustomersSayButton}
                >
                  {whatCSayIdToEdit ? "Update" : "Create"}
                </button>
              </div>
            </Typography>
          </Box>
        </Modal>

        <Modal
          open={isTeamModalOpen}
          onClose={closeOurTeamModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          // contentLabel="Example Modal"
        >
          <Box sx={style}>
            <Typography>
              <div className="flex justify-between items-center mb-8">
                <div className="font-bold text-[20px]">
                  {ourTeamIdToEdit ? "Update" : "Add"} Team Member
                  say
                </div>
                <button onClick={closeOurTeamModal}>
                  <CgClose size={25} />
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                  {ourTeamMemberPicture && (
                    <div className="mt-4">
                      <img src={ourTeamMemberPicture} className="h-[140px] rounded-md mx-auto" />
                    </div>
                )}
                <div className="text-center">
                    <label htmlFor="teampicture" className="border border-2 border-primary rounded-md text-primary px-4 py-1 inline-block mt-4">{isTeamImageUpoading ? <Bounce /> : "Update Picture"}</label>
                    <input type="file" id="teampicture" className={"hidden"} onChange={handleOurTeamFileUpload} />
                  </div>
                  <div>
                    <small>Full Name</small>
                    <input className={inputStyle} value={ourTeamMemberName} onChange={(e) => {setOurTeamMemberName(e.target.value)}} />
                  </div>
                  <div>
                    <small>Set role</small>
                    <input className={inputStyle} value={ourTeamMemberRole} onChange={(e) => {setOurTeamMemberRole(e.target.value)}} />
                  </div>
                </div>
                <button
                  className="bg-primary rounded-md text-white py-2"
                  onClick={() => {}}
                  // onClick={addOrEditTeamMember}
                >
                  {ourTeamIdToEdit ? "Update" : "Create"}
                </button>
              </div>
            </Typography>
          </Box>
        </Modal>
        <div className="flex flex-col gap-2 border border-2 border-[#ccc] rounded-md p-4">
          <div className="font-bold">About Header</div>
          <div>
            <small>Title</small>
            <input
              className={inputStyle}
              value={headerTitle}
              onChange={(e) => {
                setHeaderTitle(e.target.value);
              }}
            />
          </div>
          <div>
            <small>Description </small>
            <input
              className={inputStyle}
              value={headerDescription}
              onChange={(e) => {
                setHeaderDescription(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 border border-2 border-[#ccc] rounded-md p-4">
          <div className="font-bold">Our Journey</div>
          <div>
            <small>Description</small>
            <textarea
              className={inputStyle}
              value={ourJourneyTitle}
              onChange={(e) => {
                setOurJourneyTitle(e.target.value);
              }}
            />
          </div>
          <div>
            <small>Footer</small>
            <input
              className={inputStyle}
              value={ourJourneyDescription}
              onChange={(e) => {
                setOurJourneyDescription(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="border border-2 border-[#ccc] rounded-md p-4">
          <div className="font-bold">About Section</div>
          <div>
            <small>Title</small>
            <input
              className={inputStyle}
              value={aboutTitle}
              onChange={(e) => {
                setAboutTitle(e.target.value);
              }}
            />
          </div>
          <div>
            <small>Description </small>
            <input
              className={inputStyle}
              value={aboutDescription}
              onChange={(e) => {
                setAboutDescription(e.target.value);
              }}
            />
          </div>
          <div>
            {pictureURL && (
              <div className="mt-4">
                <img
                  src={pictureURL}
                  className="h-[100px] w-fit rounded-md mx-auto"
                />
              </div>
            )}
          </div>
          <div className="text-center">
            <label
              htmlFor="fileuploadtwo"
              className="px-4 py-1 rounded-md border border-2 text-primary border-primary inline-block mt-4"
            >
              {isImageUploading ? <Bounce /> : "Upload Picture"}
            </label>
            <input
              id="fileuploadtwo"
              type="file"
              className={`hidden`}
              onChange={handleFileUpload}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 border border-2 border-[#ccc] rounded-md p-4">
          <div className="font-bold">Why We Exist</div>
          <div>
            <small>Title</small>
            <input
              className={inputStyle}
              value={whyWeExistTitle}
              onChange={(e) => {
                setWhyWeExistTitle(e.target.value);
              }}
            />
          </div>
          <div>
            <small>Description </small>
            <input
              className={inputStyle}
              value={whyWeExistDescription}
              onChange={(e) => {
                setWhyWeExistDescription(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 border border-2 border-[#ccc] rounded-md p-4">
          <div className="font-bold">Join the build</div>
          <div>
            <small>Title</small>
            <input
              className={inputStyle}
              value={joinTheBuildTitle}
              onChange={(e) => {
                setJoinTheBuildTitle(e.target.value);
              }}
            />
          </div>
          <div>
            <small>Description </small>
            <input
              className={inputStyle}
              value={joinTheBuildDescription}
              onChange={(e) => {
                setJoinTheBuildDescription(e.target.value);
              }}
            />
          </div>
        </div>
        {/* <div className="flex flex-col gap-2 border border-2 border-[#ccc] rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="font-bold">Meat Our Team</div>
            <button
              className="bg-primary text-white rounded-md px-4 py-1"
              onClick={() => {
                openOurTeamModal("", "", "", "");
              }}
            >
              Meet Our Team
            </button>
          </div>
          {ourMissionAndValuesArray?.length > 0 ? (
            <div className="my-4">
              {meetOurTeam?.map((mav) => (
                <div className="border border-1 border-[#aaa] rounded-md p-4">
                  <div>
                    <img src={mav.picture} className="h-[120px] w-[120px] rounded-full mx-auto" />
                  </div>
                  <div>
                    <small>Name</small>
                    <div>{mav.name}</div>
                  </div>
                  <div>
                    <small>Role</small>
                    <div>{mav.role}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="w-1/2 py-2 rounded-md bg-primary text-white"
                      onClick={() => {
                        openOurTeamModal(mav?._id, mav?.name, mav?.picture, mav?.role);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="w-1/2 py-2 rounded-md bg-[red] text-white"
                      onClick={() => {
                        removeOurTeamMember(mav?._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Not added</div>
          )}
        </div> */}
        <div className="flex flex-col gap-2 border border-2 border-[#ccc] rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="font-bold">Our Mission And Values</div>
            <button
              className="bg-primary text-white rounded-md px-4 py-1"
              onClick={() => {
                openMissionAndValuesModal("", "");
              }}
            >
              Add Mission and Values
            </button>
          </div>
          {ourMissionAndValuesArray?.length > 0 ? (
            <div className="my-4">
              {ourMissionAndValuesArray?.map((mav: any) => (
                <div className="border border-1 border-[#aaa] rounded-md p-4">
                  <div>
                    <div>{mav.value}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="w-1/2 py-2 rounded-md bg-primary text-white"
                      onClick={() => {
                        openMissionAndValuesModal(mav?._id, mav?.value);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="w-1/2 py-2 rounded-md bg-[red] text-white"
                      onClick={() => {
                        removeMissionAndValue(mav?._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Not added</div>
          )}
        </div>
        <div className="flex flex-col gap-2 border border-2 border-[#ccc] rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="font-bold">What Our Customers Say</div>
            <button
              className="bg-primary text-white rounded-md px-4 py-1"
              onClick={() => {
                openWhatCustomersSay("", "");
              }}
            >
              Add Mission and Values
            </button>
          </div>
          {whatOurCustomersSayArray?.length > 0 ? (
            <div className="my-4">
              {whatOurCustomersSayArray?.map((v: any) => (
                <div className="border border-1 border-[#aaa] rounded-md p-4">
                  <div>
                    <div>{v.value}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="w-1/2 py-2 rounded-md bg-primary text-white"
                      onClick={() => {
                        openWhatCustomersSay(v?._id, v?.value);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="w-1/2 py-2 rounded-md bg-[red] text-white"
                      onClick={() => {
                        removeWhatCustomersSay(v?._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>Not added</div>
          )}
        </div>
      </div>
    </div>
  );
}
