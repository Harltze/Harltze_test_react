import axios, { AxiosError } from "axios";
import { useState } from "react";
import { ApiResponseInterface } from "../utils/apiInterface";
import { urlMaker } from "../utils/urlMaker";
import { authStore } from "../store/authStore";

export const useSku = () => {


    const jwt = authStore((state) => state.userDetails.jwt);

    const findVariationBySKU = async (skuValue: string)=> {

            
            const response = await axios.get(urlMaker(`/shared/sku/${skuValue}`), {
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${jwt}`
                }
            });

            return response;
    }

    

    return {
        findVariationBySKU
    };

}