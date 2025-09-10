import { useEffect, useState } from 'react'
import DefaultLayout from '../components/layout/DefaultLayout'
import {useProfile} from "../../hooks/useProfile";
import { Dots } from 'react-activity';
import { useFileUpload } from '../../hooks/useFileUploads';
import { toast } from 'react-toastify';
import { errorHandler } from '../../utils/errorHandler';
import { authStore } from '../../store/authStore';
import { useCMS } from '../../hooks/useCMS';
import { CMSInterface } from './adminpages/cms-settings';
import { useNavigate } from 'react-router';

export default function Profile() {

  const [cms, setCMS] = useState<CMSInterface | null>(null);
  const {getCMSRecord} = useCMS();

  const navigate = useNavigate();
  
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

  const {getProfile, isGetProfileLoading, updateProfilePic, isUpdateProfilePictureLoading, updateProfile, isUpdateProfileLoading} = useProfile();

  const [profilePic, setProfilePic] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const { uploadFile, isFileUploadLoading } = useFileUpload();

  const setUserDetails = authStore(state => state.setUser);
  const userDetails = authStore(state => state.userDetails);

  const fetchProfile = async () => {
    const result = await getProfile();
    // console.log("Profile result", result.data.result);
    const res = result.data.result;
    setFirstName(res?.firstName);
    setLastName(res?.lastName);
    setPhoneNumber(res?.phoneNumber);
    setEmail(res?.email);
    setProfilePic(res?.profilePic);
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const uploadImage = async (file: File) => {
    if(!file) return;
    const response = await uploadFile(file);
    if(response.data.status == 200) {
      // console.log(response.data.result.fileUrl);
      const profileUpdate = await updateProfilePic(response.data.result.fileUrl);
      if(profileUpdate.data.status == 200) {

        setProfilePic(response.data.result.fileUrl);

        setUserDetails({
          ...userDetails,
          profilePicture: response.data.result.fileUrl
        });
        toast.success("Profile picture updated successfully");
      } else {
        toast.error(errorHandler(response.data.error));
      }
    } else {
      toast.error(errorHandler(response.data.error));
    }
  }

  const updateProfileButton = async () => {
    const response = await updateProfile(firstName, lastName, phoneNumber);
    // console.log(response.data.result);
    await fetchProfile();

    if(response.data.status == 200) {
      const res = response.data.result;

      setFirstName(res?.firstName);
      setLastName(res?.lastName);
      setPhoneNumber(res?.phoneNumber);
      setEmail(res?.email);
      setProfilePic(res?.profilePic);

      setUserDetails({
        ...userDetails,
        fullName: `${res?.firstName} ${res?.lastName}`,
        email: res?.email,
      });
      toast.success("Profile updated successfully");
    }

  }

  const inputStyle = "border border-2 border-solid border-primary py-2 px-4 rounded-md w-full";

  return (
    <DefaultLayout socialMediaLinks={cms?.socialMedia} footerLinks={cms?.footer} footerCopyright={cms?.copyrightFooter}>
      <div>
        {isGetProfileLoading && <Dots size={25} />}
        <div className='text-center p-2 flex flex-col gap-4'>
          <img src={profilePic ? profilePic : "/avatar.png"} className='rounded-full w-[200px] h-[200px] mx-auto' />
          <div className='flex justify-center items-center'>
            <label htmlFor='profile-pic' className="border border-2 border-primary text-primary font-medium px-4 py-1 rounded-md block hover:cursor-pointer" aria-disabled={isFileUploadLoading || isUpdateProfilePictureLoading}>{isFileUploadLoading || isUpdateProfilePictureLoading ? <Dots size={25} /> : "Change Profile Picture"}</label>
            <input id='profile-pic' className='hidden' type='file' accept='image/*' onChange={(e) => {uploadImage(e.target.files!![0])}} />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 px-8 pb-4 pt-4 md:p-14'>
          <div>
            <div>First Name</div>
            <div><input value={firstName} onChange={(e) => {setFirstName(e.target.value)}}  className={inputStyle} /></div>
          </div>

          <div>
            <div>Last Name</div>
            <div><input value={lastName} onChange={(e) => {setLastName(e.target.value)}}  className={inputStyle} /></div>
          </div>

          <div>
            <div>Phone Number</div>
            <div><input value={phoneNumber} onChange={(e) => {setPhoneNumber(e.target.value)}} className={inputStyle}  /></div>
          </div>

          <div>
            <div>Email (Not editable)</div>
            <div><input value={email} disabled className={inputStyle} /></div>
          </div>
        </div>
        <div className='flex flex-col md:flex-row gap-4 justify-center px-8 pb-8 md:px-14 md:pb-14 text-center'>
          <button className="bg-primary text-white font-medium px-4 py-1 rounded-md mb-10 md:mb-0" disabled={isUpdateProfileLoading} onClick={updateProfileButton}>{isUpdateProfileLoading ? <Dots size={25} /> : "Update Profile"}</button>
          <button className="text-primary font-medium px-4 py-1 rounded-md" onClick={() => {navigate("/shippingaddress")}}>Update Shipping Address</button>
          <button className="text-primary font-medium px-4 py-1 rounded-md" onClick={() => {navigate("/orderhistory")}}>View Order History</button>
        </div>
      </div>
    </DefaultLayout>
  )
}
