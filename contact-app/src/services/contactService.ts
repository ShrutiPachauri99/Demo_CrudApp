// src/services/contactAPI.ts

import axios from 'axios';
import { baseUrl } from '../constants/url.constant';

export const contactAPI = {
  
  fetchContactsList(url = baseUrl + "/List") {
    return {
        fetchAll: () => axios.get(url)
    }
},
  createContact(url = baseUrl + "/Create") {
  return {
      create: (body: any, p0: { headers: { "Content-Type": string; }; }) => axios.post(url, body),
  };
  },

  updateContact(url = baseUrl + "/Update") {
    return {
        update: (body: any, p0: { headers: { "Content-Type": string; }; }) => axios.post(url, body),
    };
    },

  getContact(url = baseUrl + "/Get?") {
    return {
        fetchAll: (contactId: number) => axios.get(url + 'contactId=' + contactId)
    }
},

deleteContact(url = baseUrl + "/Delete") {
  return {
      delete: (body: any) =>
          axios.delete(url, {
              data: body, 
          }),
  };
}

};
