import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export const priceApi = {
  getPrices: async () => {
    const response = await axios.get(`${BASE_URL}/prices`, getAuthHeader())
    return response.data
  },

  createPrice: async (data) => {
    const response = await axios.post(`${BASE_URL}/prices`, data, getAuthHeader())
    return response.data
  },

  updatePrice: async (id, data) => {
    const response = await axios.put(`${BASE_URL}/prices/${id}`, data, getAuthHeader())
    return response.data
  },

  deletePrice: async (id) => {
    await axios.delete(`${BASE_URL}/prices/${id}`, getAuthHeader())
  },
}
