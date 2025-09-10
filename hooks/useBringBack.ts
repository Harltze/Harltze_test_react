import { securedApi } from "../utils/axiosRequestInstances";
import { urlMaker } from "../utils/urlMaker";
import { authStore } from "../store/authStore";

// interface Params1 {
//   productId?: string;
//   categories?: string;
//   clothesCollections?: string;
//   page: string;
//   limit: string;
// }

interface Params2 {
  productId: string;
  color: string;
  colorCode: string;
  size: string;
}

export const useBringBack = () => {
  const jwt = authStore((state) => state.userDetails.jwt);

  // const getBringBackHistory = async (params: Params1) => {
  //   const response = await securedApi.get(urlMaker(`/shop/bring-back-history`), {
  //     params: params,
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `Bearer ${jwt}`
  //     },
  //   });
  //   return response;
  // };

  const createBringBack = async (
    payload: Params2
  ) => {
    const response = await securedApi.post(
      urlMaker(`/customer/bring-back`),
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

  const bringBackProductHistory = async (page: number, limit: number, productId: string, categoryId: string, collectionId: string) => {
    const response = await securedApi.get(urlMaker(`/shop/product-bring-back-history`), {
      params: {
        productId,
        categoryId,
        collectionId,
        page, limit
      },
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      },
    });
    return response;
  };

  const bringBackAllProductHistory = async (productId: string) => {
    const response = await securedApi.get(urlMaker(`/shop/product-bring-back-history/all`), {
      params: {
        productId,
        // categoryId,
        // collectionId,
      },
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      },
    });
    return response;
  };

  return {
    // getBringBackHistory,
    createBringBack,
    bringBackProductHistory,
    bringBackAllProductHistory
  };
};
