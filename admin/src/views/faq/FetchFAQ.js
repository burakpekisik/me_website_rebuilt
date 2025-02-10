import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export const faqApi = {
  getFaqs: async () => {
    const response = await axios.get(`${BASE_URL}/sss`, getAuthHeader())
    return response.data
  },

  createFaq: async (faqData) => {
    const response = await axios.post(`${BASE_URL}/sss`, faqData, getAuthHeader())
    return response.data
  },

  updateFaq: async (faqId, faqData) => {
    const response = await axios.put(`${BASE_URL}/sss/${faqId}`, faqData, getAuthHeader())
    return response.data
  },

  deleteFaq: async (faqId) => {
    const response = await axios.delete(`${BASE_URL}/sss/${faqId}`, getAuthHeader())
    return response.data
  },
}
