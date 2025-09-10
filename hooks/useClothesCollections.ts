import axios, { AxiosError } from "axios";
import { useState } from "react";
import { ApiResponseInterface } from "../utils/apiInterface";
import { urlMaker } from "../utils/urlMaker";
import { authStore } from "../store/authStore";

export const useClothesCollection = () => {

    const [isCollectionsLoading, setCollectionsLoading] = useState(false);
    const [isAddCollectionLoading, setAddCollectionLoading] = useState(false);
    const [isUpdateCollectionLoading, setUpdateCollectionLoading] = useState(false);
    const [isDeleteCollectionLoading, setDeleteCollectionLoading] = useState(false);

    const jwt = authStore((state) => state.userDetails.jwt);

    const getAllCollections = async (type?: string): Promise<ApiResponseInterface> => {
        try {
            setCollectionsLoading(true);
            // const jwt = authStore((state) => state.userDetails.jwt);
            
            const response = await axios.get(urlMaker(`/shared/collections`), {
                params:{
                    type
                },
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${jwt}`
                }
            });

            return {
                data: response.data,
                error: null,
                successful: true
            };

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
            setCollectionsLoading(false);
        }
    }

    const getAllCollectionsWithAtLeastOneProduct = async (type?: string): Promise<ApiResponseInterface> => {
        try {
            setCollectionsLoading(true);
            // const jwt = authStore((state) => state.userDetails.jwt);
            
            const response = await axios.get(urlMaker(`/shared/collections-with-products`), {
                params: {
                    type
                },
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${jwt}`
                }
            });

            return {
                data: response.data,
                error: null,
                successful: true
            };

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
            setCollectionsLoading(false);
        }
    }

    const addNewCollection = async (categoryName: string, type: string): Promise<ApiResponseInterface> => {
        try {
            setAddCollectionLoading(true);
            // const jwt = authStore((state) => state.userDetails.jwt);
            
            const response = await axios.post(urlMaker(`/admin/clothescollection`), {
                name: categoryName, type
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                }
            });

            return {
                data: response.data,
                error: null,
                successful: true
            };

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
            setAddCollectionLoading(false);
        }
    }

    const updateCollection = async (categoryName: string, type: string, categoryId: string): Promise<ApiResponseInterface> => {
        try {
            setUpdateCollectionLoading(true);
            // const jwt = authStore((state) => state.userDetails.jwt);
            
            const response = await axios.put(urlMaker(`/admin/clothescollection/${categoryId}`), {
                name: categoryName, type
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                }
            });

            return {
                data: response.data,
                error: null,
                successful: true
            };

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
            setUpdateCollectionLoading(false);
        }
    }

    const deleteCollection = async (categoryId: string): Promise<ApiResponseInterface> => {
        try {
            setDeleteCollectionLoading(true);
            // const jwt = authStore((state) => state.userDetails.jwt);
            
            const response = await axios.delete(urlMaker(`/admin/clothescollection/${categoryId}`), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${jwt}`
                }
            });

            return {
                data: response.data,
                error: null,
                successful: true
            };

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
            setDeleteCollectionLoading(false);
        }
    }

    return {
        getAllCollections,
        addNewCollection,
        updateCollection,
        deleteCollection,
        getAllCollectionsWithAtLeastOneProduct,
        isCollectionsLoading,
        isAddCollectionLoading,
        isUpdateCollectionLoading,
        isDeleteCollectionLoading
    };
}