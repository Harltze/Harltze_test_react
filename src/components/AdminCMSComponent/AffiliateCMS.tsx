import { useEffect, useMemo, useRef, useState } from "react";
import {
  CMSInterface
} from "../../pages/adminpages/cms-settings";
import { toast } from "react-toastify";
import { errorHandler } from "../../../utils/errorHandler";
import { UpdateRecordType } from "../../../hooks/useCMS";
import Joi from "joi";
import { Bounce } from "react-activity";
import ReactQuill from "react-quill";

interface Props {
  refreshCMS: () => Promise<void>;
  cmsData: CMSInterface | null;
  updateCMSRecord: (updateType: UpdateRecordType, payload: any) => Promise<any>;
}


export default function AffiliateCMS({
  refreshCMS,
  cmsData,
  updateCMSRecord,
}: Props) {
  const [isUploading, setIsUpoading] = useState(false);

  const [content, setContent] = useState("");
  const [link, setLink] = useState("");

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
        content: Joi.string().required(),
        link: Joi.string().required(),
      }).validate({
        content,
        link,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsUpoading(true);

      await updateCMSRecord("affiliate", {
        affiliate: {
          content,
          link,
        },
      });

      await refreshCMS();

      toast.success("Affiliate saved succesfully");
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

  useEffect(() => {
    if (!cmsData) return;
    console.log(cmsData.affiliate);
    setContent(cmsData?.affiliate?.content);
    setLink(cmsData?.affiliate?.link);
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
            {isUploading ? <Bounce /> : "Update Affiliate"}
          </button>
        </div>
        <div className="border border-2 border-[#ccc] rounded-md p-4">
          <div className="font-bold">Affiliates</div>
          <div>
            <small>Content</small>
            <ReactQuill
              ref={quillRef}
              theme="snow" // 'snow' is a clean, modern theme, 'bubble' is another option
              value={content} // The HTML content to display in the editor
              onChange={setContent} // Callback for content changes
              modules={modules} // Toolbar and other functionality
              formats={formats} // Allowed content formats
              placeholder="Start typing your content here..."
              className={"h-40 mb-10 rounded-md"} // Set a height for the editor and add margin-bottom
            />
          </div>
          <div className="mt-[110px]">
            <small>Link</small>
            <input
              className={inputStyle}
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
