import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponseInterface } from "../utils/apiInterface";
import { urlMaker } from "../utils/urlMaker";

interface LoginInterface {
  email: string;
  password: string;
}

interface RegisterInterface extends LoginInterface {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const useAuth = () => {
  const [isRegisterLoading, setRegisterLoading] = useState(false);

  const [isForgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [isConfirmOTPLoading, setConfirmOTPLoading] = useState(false);
  const [isResetPasswordLoading, setResetPasswordLoading] = useState(false);

  const register = async ({
    firstName,
    lastName,
    phoneNumber,
    email,
    password
  }: RegisterInterface): Promise<ApiResponseInterface> => {
    try {
      setRegisterLoading(true);
      const response = await axios.post(
        urlMaker("/customer/register"),
        {
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        data: response.data,
        error: null,
        successful: true
      }

    } catch (error) {

      const axiosError = error as AxiosError;

      return {
        data: {
          status: axiosError.response?.status
        },
        error: axiosError.response?.data,
        successful: false
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  const login = async ({
    email,
    password,
  }: LoginInterface): Promise<ApiResponseInterface> => {
    return await axios.post(
      urlMaker("/customer/login"),
      {
        email,
        password
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const adminLogin = async ({
    email,
    password,
  }: LoginInterface) => {
    return await axios.post(
      urlMaker("/shop/login"),
      {
        email,
        password
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const forgotCustomerPassword = async (email: string): Promise<ApiResponseInterface> => {
    try {
      setForgotPasswordLoading(true);
      const response = await axios.post(
        urlMaker("/customer/forgot-password"),
        {
          email
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        data: response.data,
        error: null,
        successful: true
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        data: {
          status: axiosError.response?.status
        },
        error: axiosError.response?.data,
        successful: false
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  }

  const confirmCustomerOTP = async (uId: string, otp: string): Promise<ApiResponseInterface> => {
    try {
      setConfirmOTPLoading(true);
      const response = await axios.post(
        urlMaker("/customer/confirm-otp"),
        {
          uId, otp
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );

      return {
        data: response.data,
        error: null,
        successful: true
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        data: {
          status: axiosError.response?.status
        },
        error: axiosError.response?.data,
        successful: false
      }
    } finally {
      setConfirmOTPLoading(false);
    }
  }

  const resetCustomerPassword = async (encryptedResult: string, password: string): Promise<ApiResponseInterface> => {
    try {
      setResetPasswordLoading(true);
      const response = await axios.post(
        urlMaker("/customer/reset-password"),
        {
          encryptedResult, password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        data: response.data,
        error: null,
        successful: true
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        data: {
          status: axiosError.response?.status
        },
        error: axiosError.response?.data,
        successful: false
      }
    } finally {
      setResetPasswordLoading(false);
    }
  }

  const adminConfirmOTP = async (uId: string, otp: string) => {
      return await axios.post(
        urlMaker("/shop/confirm-otp"),
        {
          uId,
          otp
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  }

  return {
    register,
    login,
    adminLogin,
    forgotCustomerPassword,
    confirmCustomerOTP,
    resetCustomerPassword,
    adminConfirmOTP,
    isRegisterLoading,
    isForgotPasswordLoading,
    isConfirmOTPLoading,
    isResetPasswordLoading
  };
};
