import { securedApi } from "../utils/axiosRequestInstances";
import { urlMaker } from "../utils/urlMaker";
import { authStore } from "../store/authStore";

interface DiscountInterface {
    discountCode: string;
    discountAmountOrPercent: number;
    discountForProductsAbove: number;
    expiryDate: string;
}

export const useDiscount = () => {

    const jwt = authStore((state) => state.userDetails.jwt);

    const createDiscount = async (payload: DiscountInterface) => {
        const response = await securedApi.post(urlMaker(`/shop/discount-codes`), payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    const listDiscount = async () => {
        const response = await securedApi.get(urlMaker(`/shop/discount-codes`), {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        });

        return response;
       
    }

    return {
        createDiscount,
        listDiscount
    }

}