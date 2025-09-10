import { useState } from "react";
import axios, { AxiosError } from "axios";
import { securedApi } from "../utils/axiosRequestInstances";
import { authStore } from "../store/authStore";
import { ApiResponseInterface } from "../utils/apiInterface";
import { urlMaker } from "../utils/urlMaker";

export const useProfile = () => {
  const [isGetProfileLoading, setGetProfileLoading] = useState(false);
  const [isUpdateProfilePictureLoading, setUpdateProfilePictureLoading] =
    useState(false);
  const [isUpdateProfileLoading, setUpdateProfileLoading] = useState(false);

  const jwt = authStore((state) => state.userDetails.jwt);

  const getProfile = async (): Promise<ApiResponseInterface> => {
    try {
      setGetProfileLoading(true);

      const result = await securedApi.get(urlMaker(`/customer/profile`), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      return {
        data: result.data,
        error: null,
        successful: true,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        data: {
          status: axiosError.response?.status,
        },
        error: axiosError.response?.status,
        successful: false,
      };
    } finally {
      setGetProfileLoading(false);
    }
  };

  const updateProfilePic = async (
    profilePic: string
  ): Promise<ApiResponseInterface> => {
    try {
      setUpdateProfilePictureLoading(true);

      const result = await securedApi.put(
        urlMaker(`/customer/profile-picture`),
        { profilePic },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      return {
        data: result.data,
        error: null,
        successful: true,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        data: {
          status: axiosError.response?.status,
        },
        error: axiosError.response?.status,
        successful: false,
      };
    } finally {
      setUpdateProfilePictureLoading(false);
    }
  };

  const updateProfile = async (
    firstName: string,
    lastName: string,
    phoneNumber: string
    // secondaryEmail: string,
    // country: string
  ): Promise<ApiResponseInterface> => {
    try {
      setUpdateProfileLoading(true);

      const result = await securedApi.put(
        urlMaker(`/customer/profile`),
        {
          profile: {
            firstName,
            lastName,
            phoneNumber,
            // secondaryEmail,
            // country
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      return {
        data: result.data,
        error: null,
        successful: true,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        data: {
          status: axiosError.response?.status,
        },
        error: axiosError.response?.status,
        successful: false,
      };
    } finally {
      setUpdateProfileLoading(false);
    }
  };

  const subscribeToNewsletters = async (
    subscribersName: string,
    subscribersEmail: string
  ) => {
    const response = await axios.post(urlMaker("/customer/subscribe", "v1"), {
      subscribersName,
      subscribersEmail,
    });
    return response;
  };

  const getNewsLetterSubscribers = async () => {
    const response = await securedApi.get(urlMaker("/shop/subscribers", "v1"), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          }
        });
    return response;
  };

  const sendContactUsMessage = async (
    fullName: string,
    email: string,
    message: string
  ) => {
    const response = await axios.post(
      urlMaker("/customer/send-message", "v1"),
      {
        fullName,
        email,
        message,
      }
    );
    return response;
  };

  const requestAutoPasswordReset = async (userId: string) => {
    const response = await securedApi.get(
      urlMaker(`/shop/auto-reset-password/${userId}`, "v1"),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response;
  };

  const deleteUser = async (userId: string) => {
    const response = await securedApi.delete(
      urlMaker(`/shop/delete-user/${userId}`, "v1"),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    return response;
  };

  return {
    isGetProfileLoading,
    isUpdateProfilePictureLoading,
    isUpdateProfileLoading,
    getProfile,
    updateProfilePic,
    updateProfile,
    subscribeToNewsletters,
    getNewsLetterSubscribers,
    sendContactUsMessage,
    requestAutoPasswordReset,
    deleteUser
  };
};
