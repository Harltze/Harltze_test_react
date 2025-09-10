import { useEffect, useState } from "react";
import AdminDasboardLayout from "../../components/layout/AdminDasboardLayout";
import { useAdminProfile } from "../../../hooks/useAdminProfile";
import { useFileUpload } from "../../../hooks/useFileUploads";
import { Bounce } from "react-activity";
import { toast } from "react-toastify";
import { errorHandler } from "../../../utils/errorHandler";
import { authStore } from "../../../store/authStore";

export default function AdminProfile() {
  const { getProfile, updateProfile } = useAdminProfile();

  const { uploadFile } = useFileUpload();

  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ref, setRef] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userDetails = authStore((state) => state.userDetails);
  const changeProfilePic = authStore((state) => state.changeUserProfilePic);

  const [isUploadingPic, setUploadingPic] = useState(false);
  const [isFetchingProfile, setFetchingProfile] = useState(false);

  const fetchProfile = async () => {
    try {
      setFetchingProfile(true);
      const result = await getProfile();
      console.log(result.data);
      setProfilePicture(result.data?.result?.profilePicture);
      changeProfilePic(result.data?.result?.profilePicture);
      setFirstName(result.data?.result?.firstName);
      setLastName(result.data?.result?.lastName);
      setEmail(result.data?.result?.email);
      setPhoneNumber(result.data?.result?.phoneNumber);
      setRef(result.data?.result?.ref);
    } catch (error) {
      toast.error(
        errorHandler(error, "An error ocurred while fetching profile")
      );
    } finally {
      setFetchingProfile(false);
    }
  };

  const uploadProfilePic = async (event: any) => {
    try {
      setUploadingPic(true);
      const res = await uploadFile(event.target.files[0]);
      console.log(res.data.result.fileUrl);
      await updateProfile({ profilePicture: res.data.result.fileUrl });
      await fetchProfile();
    } catch (error) {
      toast.error(
        errorHandler(error, "An error ocurred while uploading profile picture")
      );
    } finally {
      setUploadingPic(false);
    }
  };

  const updateProfileButton = async () => {
    try {
      setFetchingProfile(true);
      await updateProfile({ firstName, lastName, phoneNumber });
      await fetchProfile();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        errorHandler(error, "An error ocurred while updating profile")
      );
    } finally {
      setFetchingProfile(false);
    }
  };

  const updatePasswordButton = async () => {
    try {
      if (password.length < 6) {
        toast.error("Password should be at least 6 characters");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      setFetchingProfile(true);
      await updateProfile({ oldPassword, password });
      await fetchProfile();
      toast.success("Password updated successfully");
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        errorHandler(error, "An error ocurred while updating profile")
      );
    } finally {
      setFetchingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const inputStyle =
    "py-2 px-2 w-full border border-1 border-[#333] rounded-md";

  return (
    <AdminDasboardLayout header="Profile" showSearch={false}>
      <div>
        <div className="text-center">
          <img
            src={profilePicture ? profilePicture : "/avatar.png"}
            className="mx-auto h-[200px] w-[200px] rounded-full"
          />
          {isUploadingPic && (
            <div>
              <Bounce color="black" />
            </div>
          )}
          <label
            htmlFor="uploadpic"
            className="inline-block mt-4 border text-primary border-primary border-2 rounded-md px-4 py-1"
          >
            {profilePicture ? "Change" : "Upload"} Picture
          </label>
          <input
            id="uploadpic"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={uploadProfilePic}
          />
          {isFetchingProfile && (
            <div className="text-center">
              <Bounce color="black" />
            </div>
          )}
        </div>
        <div className="mt-8 flex flex-col md:flex-row gap-8">
          <div className="flex flex-col gap-4 w-full">
            <div>
              <small>First Name</small>
              <input
                className={inputStyle}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
            </div>
            <div>
              <small>Last Name</small>
              <input
                className={inputStyle}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
              <div>
                <small>Phone Number</small>
                <input
                  className={inputStyle}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                />
              </div>
                <div>
                <small>Email (Not editable)</small>
                <input className={inputStyle} value={email} disabled />
              </div>
              {userDetails.role == "affiliate" && (
              <div>
                <small>Affiliate code (Not editale)</small>
                <input className={inputStyle} value={ref} disabled />
              </div>
            )}
              <button
                className="bg-primary text-white w-full py-1 rounded-md inline-block"
                onClick={updateProfileButton}
              >
                Update Profile
              </button>
          </div>
          <div className="flex flex-col gap-8 border border-[#ccc] p-4 rounded-md w-full">
            <div>
              <small>Old Password</small>
              <input
                className={inputStyle}
                value={oldPassword}
                onChange={(e) => {
                  setOldPassword(e.target.value);
                }}
              />
            </div>
            <div>
              <small>New Password</small>
              <input
                className={inputStyle}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div>
              <small>Confirm Password</small>
              <input
                className={inputStyle}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
            <button
              className="bg-[#ccc] w-full py-1 rounded-md mt-[-20px] inline-block"
              onClick={updatePasswordButton}
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </AdminDasboardLayout>
  );
}
