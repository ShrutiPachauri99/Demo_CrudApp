// src/services/contactAPI.ts

import axios from 'axios';
import Swal from 'sweetalert2';
import { IContact } from '../types/global.typing';
import { baseUrl } from '../constants/url.constant';

export const contactAPI = {
  
  fetchContactsList(url = baseUrl + "/List") {
    return {
        fetchAll: () => axios.get(url)
    }
},
  createContact: async (contact: IContact) => {
    try {
      const response = await axios.post<IContact>(`${baseUrl}/Create`, contact);
      return response.data;
    } catch (error) {
      console.error("Error creating contact:", error);
      let errorMessage = "An unexpected error occurred.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`;
        } else if (error.request) {
          errorMessage = "No response received from the server.";
        } else {
          errorMessage = `Axios error: ${error.message}`;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });

      throw new Error(errorMessage);
    }
  },

};
