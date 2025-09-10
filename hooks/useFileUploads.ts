import axios, { AxiosError } from "axios";
import { useState } from "react";
import { urlMaker } from "../utils/urlMaker";
import { ApiResponseInterface } from "../utils/apiInterface";

export const useFileUpload = () => {

    const [isLoading, setIsLoading] = useState(false);

    const uploadFile = async (file: any):Promise<ApiResponseInterface> => {
    
        try {
            setIsLoading(true);

            const formData = new FormData();

            formData.append("file", file as File);

            // console.log("file", file, urlMaker("/file/upload"));

            const result = await axios.post(urlMaker("/file/upload"), formData, {
                headers: {
                    // Accept: "application/json",
                    "Content-Type": "multipart/form-data"
                }
            });

            return {
                data: result.data,
                error: null,
                successful: true,
                isLoading
            };
            
        } catch (error) {

            const axiosError = error as AxiosError;
            
            return {
                successful: false,
                data: {
                    status: axiosError.response?.status
                  },
                error: axiosError.response?.data,
                isLoading
            };
        } finally {
            setIsLoading(false);
        }
    }

    return {
        uploadFile, isFileUploadLoading: isLoading
    };

}
