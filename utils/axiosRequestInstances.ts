import { urlMaker } from "../utils/urlMaker";
import axios from 'axios';
import {authStore} from "../store/authStore";



// Create the Axios instance that will be used for all secure API calls.
const securedApi = axios.create();

const refreshToken = async () => {
  const value = await axios.post(urlMaker("/shared/refresh-token"), {
    refreshToken: authStore.getState().userDetails.refreshToken
  });
  // A real implementation would validate the token with the backend.
  return {
    accessToken: value.data.accessToken,
    refreshToken: value.data.newRefreshToken
  };
}

// Add a response interceptor to handle expired tokens.
securedApi.interceptors.response.use(
  (response) => {
    // Return a successful response as-is.
    return response;
  },
  async (error) => {
    let originalRequest = error.config;
    // Check for a 401 error (Unauthorized) and a flag to prevent infinite loops.
    if (error.response?.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Set the retry flag

      try {
        const {accessToken, refreshToken: tk} = await refreshToken();
        const userDetails = authStore.getState().userDetails;
        authStore.getState().setUser({
            ...userDetails, jwt: accessToken, refreshToken: tk
        });
        // Update the header of the original request with the new token.
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        // Re-run the original request with the new token.
        return await securedApi(originalRequest);
      } catch (refreshError) {
        // If the refresh token fails, we can't recover.
        // Redirect to the login page or handle the error gracefully.
        // console.error('Failed to refresh token after 401, redirecting to login...');
        // console.error(refreshError);
        // Example: window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    // For all other errors, just pass them through.
    return Promise.reject(error);
  }
);

export {securedApi}