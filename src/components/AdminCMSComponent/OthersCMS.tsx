import { useEffect, useState } from "react";
import { CMSInterface } from "../../pages/adminpages/cms-settings";
import { toast } from "react-toastify";
import { errorHandler } from "../../../utils/errorHandler";
import { UpdateRecordType } from "../../../hooks/useCMS";
import Joi from "joi";
import { Bounce } from "react-activity";
import { useFileUpload } from "../../../hooks/useFileUploads";
// import ReactQuill from 'react-quill';

interface Props {
  refreshCMS: () => Promise<void>;
  cmsData: CMSInterface | null;
  updateCMSRecord: (updateType: UpdateRecordType, payload: any) => Promise<any>;
}

export default function OthersCMS({
  refreshCMS,
  cmsData,
  updateCMSRecord,
}: Props) {
  const [anyUnsavedPremiumChanges, setAnyUnsavedPremiumChanges] =
    useState(false);
  const [anyUnsavedGalleryChanges, setAnyUnsavedGalleryChanges] =
    useState(false);

  const { uploadFile } = useFileUpload();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [isContactUsLoading, setIsContactUsLoading] = useState(false);

  const [premiumTitle, setPremiumTitle] = useState("");
  const [premiumDescription, setPremiumDescription] = useState("");
  const [premiumButtonTitle, setPremiumButtonTitle] = useState("");
  const [premiumButtonLink, setPremiumButtonLink] = useState("");
  const [premiumPictureUrl, setPremiumPictureURL] = useState("");
  const [isPremiumImageUpoading, setIsPremiumImageUpoading] = useState(false);
  const [isPremiumLoading, setIsPremiumLoading] = useState(false);

  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryDescription, setGalleryDescription] = useState("");
  const [galleryButtonTitle, setGalleryButtonTitle] = useState("");
  const [galleryButtonLink, setGalleryButtonLink] = useState("");
  const [galleryPictureUrl, setGalleryPictureURL] = useState("");
  const [isGalleryImageUpoading, setIsGalleryImageUpoading] = useState(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);

  const savePremiumBanner = async () => {
    try {
      const { error } = Joi.object({
        premiumTitle: Joi.string().required(),
        premiumDescription: Joi.string().required(),
        premiumButtonTitle: Joi.string().required(),
        premiumButtonLink: Joi.string().required(),
        premiumPictureUrl: Joi.string().required(),
      }).validate({
        premiumTitle,
        premiumDescription,
        premiumButtonTitle,
        premiumButtonLink,
        premiumPictureUrl,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsPremiumLoading(true);

      await updateCMSRecord("premium-banner", {
        premiumBanner: {
          title: premiumTitle,
          description: premiumDescription,
          buttonTitle: premiumButtonTitle,
          buttonLink: premiumButtonLink,
          pictureUrl: premiumPictureUrl,
        },
      });

      await refreshCMS();

      setAnyUnsavedPremiumChanges(false);

      toast.success("Premium banner saved succesfully");
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while saving, kindly try again later."
        )
      );
    } finally {
      setIsPremiumLoading(false);
    }
  };

  const saveGalleryBannerButton = async () => {
    try {
      const { error } = Joi.object({
        galleryTitle: Joi.string().required(),
        galleryDescription: Joi.string().required(),
        galleryButtonTitle: Joi.string().required(),
        galleryButtonLink: Joi.string().required(),
        galleryPictureUrl: Joi.string().required(),
      }).validate({
        galleryTitle,
        galleryDescription,
        galleryButtonTitle,
        galleryButtonLink,
        galleryPictureUrl,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsGalleryLoading(true);

      await updateCMSRecord("gallery-banner", {
        galleryBanner: {
          title: galleryTitle,
          description: galleryDescription,
          buttonTitle: galleryButtonTitle,
          buttonLink: galleryButtonLink,
          pictureUrl: galleryPictureUrl,
        },
      });

      await refreshCMS();

      setAnyUnsavedGalleryChanges(false);

      toast.success("Gallery banner saved succesfully");
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while saving, kindly try again later."
        )
      );
    } finally {
      setIsGalleryLoading(false);
    }
  };

  const saveContactUsButton = async () => {
    try {
      const { error } = Joi.object({
        phoneNumber: Joi.string().required(),
        email: Joi.string().required(),
        address: Joi.string().required(),
      }).validate({
        phoneNumber,
        email,
        address,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsContactUsLoading(true);

      await updateCMSRecord("contact-us", {
        contactUs: {
          phoneNumber,
          email,
          address,
        },
      });

      await refreshCMS();

      toast.success("Gallery banner saved succesfully");
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while saving, kindly try again later."
        )
      );
    } finally {
      setIsContactUsLoading(false);
    }
  };

  const handlePremiumFileUpload = async (e: any) => {
    try {
      if (e.target.files.length == 0) return;
      setIsPremiumImageUpoading(true);
      const res = await uploadFile(e.target.files[0]);
      setPremiumPictureURL(res.data.result.fileUrl);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while uploading file, kindly try again later."
        )
      );
    } finally {
      setIsPremiumImageUpoading(false);
    }
  };

  const handleGalleryFileUpload = async (e: any) => {
    try {
      if (e.target.files.length == 0) return;
      setIsGalleryImageUpoading(true);
      const res = await uploadFile(e.target.files[0]);
      setGalleryPictureURL(res.data.result.fileUrl);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while uploading file, kindly try again later."
        )
      );
    } finally {
      setIsGalleryImageUpoading(false);
    }
  };

  useEffect(() => {
    if (!cmsData) return;
    setPremiumTitle(cmsData?.premiumBanner?.title);
    setPremiumDescription(cmsData?.premiumBanner?.description);
    setPremiumButtonTitle(cmsData?.premiumBanner?.buttonTitle);
    setPremiumButtonLink(cmsData?.premiumBanner?.buttonLink);
    setPremiumPictureURL(cmsData?.premiumBanner?.pictureUrl);

    setGalleryTitle(cmsData?.galleryBanner?.title);
    setGalleryDescription(cmsData?.galleryBanner?.description);
    setGalleryButtonTitle(cmsData?.galleryBanner?.buttonTitle);
    setGalleryButtonLink(cmsData?.galleryBanner?.buttonLink);
    setGalleryPictureURL(cmsData?.galleryBanner?.pictureUrl);

    setPhoneNumber(cmsData?.contactUs?.phoneNumber);
    setAddress(cmsData?.contactUs?.address);
    setEmail(cmsData?.contactUs?.email);
    
  }, [cmsData]);

  const inputStyle =
    "py-2 px-2 w-full border border-1 border-[#333] rounded-md";

  return (
    <div className="flex flex-col gap-4 p-4 h-[95%]">
      <div className="flex flex-col gap-4 p-4 border border-2 border-[#ccc] rounded-md">
        <div className="flex justify-between items-center">
          <div className="font-bold text-[20px]">Premium Banner</div>
          {anyUnsavedPremiumChanges && (
            <div className="text-[#aaa]">Unsaved changes</div>
          )}
        </div>
        <div>
          <small>Title</small>
          <input
            className={inputStyle}
            value={premiumTitle}
            onChange={(e) => {
              setPremiumTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <small>Description</small>
          <textarea
            className={inputStyle}
            value={premiumDescription}
            onChange={(e) => {
              setPremiumDescription(e.target.value);
            }}
          />
        </div>
        <div>
          <small>Button Title</small>
          <input
            className={inputStyle}
            value={premiumButtonTitle}
            onChange={(e) => {
              setPremiumButtonTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <small>Button Link</small>
          <input
            className={inputStyle}
            value={premiumButtonLink}
            onChange={(e) => {
              setPremiumButtonLink(e.target.value);
            }}
          />
        </div>

        {premiumPictureUrl && (
          <div>
            <img className="h-[140px] w-fit mx-auto" src={premiumPictureUrl} />
          </div>
        )}
        <div className="text-center">
          <label
            htmlFor="fileupload"
            className="px-4 py-1 rounded-md border border-2 text-primary border-primary"
          >
            {isPremiumImageUpoading ? <Bounce /> : "Upload Picture"}
          </label>
          <input
            id="fileupload"
            type="file"
            className={`hidden`}
            onChange={handlePremiumFileUpload}
          />
        </div>
        <div>
          <button
            className="w-full py-2 rounded bg-primary text-white"
            disabled={isPremiumLoading}
            onClick={savePremiumBanner}
          >
            {isPremiumLoading ? <Bounce /> : "Update Premium Banner"}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 border border-2 border-[#ccc] rounded-md">
        <div className="flex justify-between items-center">
          <div className="font-bold text-[20px]">Gallery Banner</div>
          {anyUnsavedGalleryChanges && (
            <div className="text-[#aaa]">Unsaved changes</div>
          )}
        </div>
        <div>
          <small>Title</small>
          <input
            className={inputStyle}
            value={galleryTitle}
            onChange={(e) => {
              setGalleryTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <small>Description</small>
          <textarea
            className={inputStyle}
            value={galleryDescription}
            onChange={(e) => {
              setGalleryDescription(e.target.value);
            }}
          />
        </div>
        <div>
          <small>Button Title</small>
          <input
            className={inputStyle}
            value={galleryButtonTitle}
            onChange={(e) => {
              setGalleryButtonTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <small>Button Link</small>
          <input
            className={inputStyle}
            value={galleryButtonLink}
            onChange={(e) => {
              setGalleryButtonLink(e.target.value);
            }}
          />
        </div>
        {galleryPictureUrl && (
          <div>
            <img className="h-[140px] w-fit mx-auto" src={galleryPictureUrl} />
          </div>
        )}
        <div className="text-center">
          <label
            htmlFor="fileuploadtwo"
            className="px-4 py-1 rounded-md border border-2 text-primary border-primary"
          >
            {isGalleryImageUpoading ? <Bounce /> : "Upload Picture"}
          </label>
          <input
            id="fileuploadtwo"
            type="file"
            className={`hidden`}
            onChange={handleGalleryFileUpload}
          />
        </div>
        <div>
          <button
            className="w-full py-2 rounded bg-primary text-white"
            disabled={isGalleryLoading}
            onClick={saveGalleryBannerButton}
          >
            {isGalleryLoading ? <Bounce /> : "Update Gallery Banner"}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-4 border border-2 border-[#ccc] rounded-md">
        <div className="flex justify-between items-center">
          <div className="font-bold text-[20px]">Contact Us Details</div>
        </div>
        <div>
          <small>Phone Number</small>
          <input className={inputStyle} value={phoneNumber} onChange={(e) => {setPhoneNumber(e.target.value)}} />
        </div>
        <div>
          <small>Address</small>
          <input className={inputStyle} value={address} onChange={(e) => {setAddress(e.target.value)}} />
        </div>
        <div>
          <small>Email</small>
          <input className={inputStyle} value={email} onChange={(e) => {setEmail(e.target.value)}} />
        </div>
        <div>
          <button
            className="w-full py-2 rounded bg-primary text-white"
            disabled={isGalleryLoading}
            onClick={saveContactUsButton}
          >
            {isContactUsLoading ? <Bounce /> : "Update Contact Us Details"}
          </button>
        </div>
      </div>
    </div>
  );
}
