import { securedApi } from "../utils/axiosRequestInstances";
import { urlMaker } from "../utils/urlMaker";
import { authStore } from "../store/authStore";

interface marketersInterface {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role?: string;
}

export const useMarketer = () => {
 
    const jwt = authStore((state) => state.userDetails.jwt);

    const registerNewMarketer = async (payload: marketersInterface) => {
        payload.role = "marketer";
        const response = await securedApi.post(urlMaker(`/admin/workers`), payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    const updateUser = async (id: string, payload: marketersInterface) => {
        const response = await securedApi.put(urlMaker(`/admin/workers/${id}`), payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    const marketerList = async (page: number, limit: number) => {
        const response = await securedApi.get(urlMaker(`/admin/workers/marketer/${page}/${limit}`), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    const singleMarketer = async (id: string) => {
        const response = await securedApi.get(urlMaker(`/admin/worker/${id}`), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    return {
        registerNewMarketer,
        marketerList,
        singleMarketer,
        updateUser
    };

}