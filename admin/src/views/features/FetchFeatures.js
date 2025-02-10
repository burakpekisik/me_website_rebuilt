import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export const featureApi = {
  getFeatures: async () => {
    const response = await axios.get(`${BASE_URL}/features`, getAuthHeader())
    return response.data
  },

  createFeature: async (data) => {
    const response = await axios.post(`${BASE_URL}/features`, data, getAuthHeader())
    return response.data
  },

  updateFeature: async (id, data) => {
    const response = await axios.put(`${BASE_URL}/feature/${id}`, data, getAuthHeader())
    return response.data
  },

  deleteFeature: async (id) => {
    await axios.delete(`${BASE_URL}/feature/${id}`, getAuthHeader())
  },
}
