export const baseUrl = import.meta.env.VITE_BACKEND_URL;

type Versions = "v1" | "v2" | "v3";

export const urlMaker = (val: string, apiVersion: Versions = "v1"): string => {
    return baseUrl + "/" + apiVersion + val;
}

