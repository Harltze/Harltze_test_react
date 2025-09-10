import { securedApi } from "../utils/axiosRequestInstances";
import { urlMaker } from "../utils/urlMaker";
import { authStore } from "../store/authStore";

interface AffiliateInterface {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;}

export const useAffiliate = () => {
 
    const jwt = authStore((state) => state.userDetails.jwt);

    const registerNewAffiliate = async (payload: AffiliateInterface) => {
        const response = await securedApi.post(urlMaker(`/admin/affiliate/register`), payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    const updateUser = async (id: string, payload: AffiliateInterface) => {
        const response = await securedApi.put(urlMaker(`/admin/workers/${id}`), payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    const affiliateList = async (page: number, limit: number) => {
        const response = await securedApi.get(urlMaker(`/admin/workers/affiliate/${page}/${limit}`), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    const singleAffiliate = async (id: string) => {
        const response = await securedApi.get(urlMaker(`/admin/worker/${id}`), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    const affiliateOrders = async (paymentStatus: string, page:number, limit: number) => {
        const response = await securedApi.get(urlMaker(`/shop/affiliate-orders`), {
            params: {
                paymentStatus,
                page,
                limit
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    const cashOut = async () => {
        const response = await securedApi.get(urlMaker(`/shop/cashout`), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }


    // For shops
    const markAsPaid = async (historyId: string) => {
        const response = await securedApi.post(urlMaker(`/shop/mark-as-paid/${historyId}`), {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    const cashOutHistory = async (page: number, limit: number, paymentStatus: string) => {
        const response = await securedApi.get(urlMaker(`/shop/cashout-history`), {
            params: {
                page, limit, paymentStatus
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    return {
        registerNewAffiliate,
        affiliateList,
        singleAffiliate,
        updateUser,
        affiliateOrders,
        cashOut,
        markAsPaid,
        cashOutHistory
    };

}