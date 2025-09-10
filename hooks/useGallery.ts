import axios, { AxiosError } from "axios";
import { securedApi } from "../utils/axiosRequestInstances";
import { useState } from "react";
import { authStore } from "../store/authStore";
import { ApiResponseInterface } from "../utils/apiInterface";
import { urlMaker } from "../utils/urlMaker";

export const useGallery = () => {

    const [isCreateGalleryLoading, setCreateGalleryLoading] = useState(false);
    const [isUpdateGalleryLoading, setUpdateGalleryLoading] = useState(false);
    const [isGetGalleryLoading, setGetGalleryLoading] = useState(false);
    const [isDeleteGalleryLoading, setDeleteGalleryLoading] = useState(false);

    const jwt = authStore((state) => state.userDetails.jwt);

    const getGalleryPictures = async (page: number, limit: number): Promise<ApiResponseInterface> => {
        try {
            setGetGalleryLoading(true);
            const result = await axios.get(urlMaker(`/shared/gallery/${page}/${limit}`));

            return {
                data: result.data,
                error: null,
                successful: true,
            };

        } catch (error) {
            const axiosError = error as AxiosError;
            return {
                data: {
                    status: axiosError.response?.status
                },
                error: axiosError.response?.status,
                successful: false,
            };
        } finally {
            setGetGalleryLoading(false);
        }
    }

    const createGalleryPicture = async (pictureURL: string[], title?: string, description?: string): Promise<ApiResponseInterface> => {
        try {
            setCreateGalleryLoading(true);
            const result = await securedApi.post(urlMaker(`/admin/gallery`), {
                pictureURL,
                title,
                description
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            });

            return {
                data: result.data,
                error: null,
                successful: true,
            };

        } catch (error) {
            const axiosError = error as AxiosError;
            return {
                data: {
                    status: axiosError.response?.status
                },
                error: axiosError.response?.status,
                successful: false,
            };
        } finally {
            setCreateGalleryLoading(false);
        }
    }

    const updateGalleryPicture = async (id: string, pictureURL: string, title?: string, description?: string) => {
        try {
            setUpdateGalleryLoading(true);
            const result = await axios.put(urlMaker(`/shared/gallery/${id}`), {
                pictureURL,
                title,
                description
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            });

            return {
                data: result.data,
                error: null,
                successful: true,
            };
        } catch (error: any) {
            const axiosError = error as AxiosError;
            return {
                data: {
                    status: axiosError.response?.status
                },
                error: axiosError.response?.status,
                successful: false,
            };
        } finally {
            setUpdateGalleryLoading(false);
        }
    }

    const deleteGalleryPicture = async (id: string) => {
        try {
            setDeleteGalleryLoading(true);
            const result = await axios.delete(urlMaker(`/shared/gallery/${id}`), {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`,
                },
            });

            return {
                data: result.data,
                error: null,
                successful: true,
            };
        } catch (error) {
            const axiosError = error as AxiosError;
            return {
                data: {
                    status: axiosError.response?.status
                },
                error: axiosError.response?.status,
                successful: false,
            };
        } finally {
            setDeleteGalleryLoading(false);
        }
    }

    return {
        getGalleryPictures,
        createGalleryPicture,
        updateGalleryPicture,
        deleteGalleryPicture,
        isCreateGalleryLoading,
        isUpdateGalleryLoading,
        isGetGalleryLoading,
        isDeleteGalleryLoading,
    };

}
