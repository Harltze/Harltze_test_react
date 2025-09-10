import { securedApi } from "../utils/axiosRequestInstances";
import { authStore } from "../store/authStore";
import { urlMaker } from "../utils/urlMaker";

export const useAdminProfile = () => {
  const jwt = authStore((state) => state.userDetails.jwt);

  const getProfile = async () => {
    const result = await securedApi.get(urlMaker(`/shop/profile`), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    return result;
  };

  const updateProfile = async (payload: any) => {
    delete payload?.email;
    const result = await securedApi.put(
      urlMaker(`/shop/update-shop-profile`),
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return result;
  };

  return {
    getProfile,
    updateProfile,
  };
};
