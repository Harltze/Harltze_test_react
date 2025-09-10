// import { ApiResponseInterface } from "@/interfaces/apiInterface";
// import axios from "axios";

import { authStore } from "../store/authStore";
import { ApiResponseInterface } from "../utils/apiInterface";
import { urlMaker } from "../utils/urlMaker";
import axios from "axios";
import { useState } from "react";

export const usePaystack = () => {

    const jwt = authStore((state) => state.userDetails.jwt);

    const [isGetBanksLoading, setGetBanksLoading] = useState(false);
    const [isVerifyAccountLoading, setVerifyAccountLoading] = useState(false);

    const getBanks = async () => {

        try {

            setGetBanksLoading(true);
            
            const response = await axios.get(urlMaker("/paystack/bank-list"), {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            });

            return {
                status: response.status,
                data: response.data,
                error: null
            }
    
        } catch (error) {
            return {
                data: null,
                error,
                successful: false,
              };
        } finally {
            setGetBanksLoading(false);
        }
    }

    const verifyAccount = async (accountNumber: number, bankCode: number) => {

        try {

            setVerifyAccountLoading(true);
            
            const response = await axios.post(urlMaker("/paystack/verify-account"), {
                accountNumber, bankCode
            }, {
                headers: {
                    "Authorization": `Bearer ${jwt}`
                }
            });

            return {
                status: response.status,
                data: response.data,
                error: null
            }
    
        } catch (error) {
            return {
                data: null,
                error,
                successful: false,
              };
        } finally {
            setVerifyAccountLoading(false);
        }
    }

    return {
        getBanks,
        verifyAccount,
        isGetBanksLoading,
        isVerifyAccountLoading
    };

} 