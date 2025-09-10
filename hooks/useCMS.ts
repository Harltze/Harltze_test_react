import axios from "axios";
import { securedApi } from "../utils/axiosRequestInstances";
import { urlMaker } from "../utils/urlMaker";
import { authStore } from "../store/authStore";

export type UpdateRecordType =
  | "hero"
  | "terms-and-conditions"
  | "social-media-handles"
  | "privacy-policy"
  | "cancellation-policy"
  | "faqs"
  | "footer"
  | "promotion-banner"
  | "premium-banner"
  | "gallery-banner"
  | "about-us"
  | "contact-us"
  | "affiliate"
  | "affiliate-percentage"
  | "copyright-footer";

export const useCMS = () => {
  const jwt = authStore((state) => state.userDetails.jwt);

  const getCMSRecord = async () => {
    const response = await axios.get(urlMaker(`/shop/cms`), {
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${jwt}`
      },
    });
    return response;
  };

  const updateCMSRecord = async (
    updateRecordType: UpdateRecordType,
    payload: any
  ) => {
    const response = await securedApi.put(
      urlMaker(`/shop/cms/${updateRecordType}`),
      payload,
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
    getCMSRecord,
    updateCMSRecord,
  };
};
