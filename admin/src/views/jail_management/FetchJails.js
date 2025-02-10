import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export const jailApi = {
  getJails: async () => {
    const response = await axios.get(`${BASE_URL}/jails`, getAuthHeader())
    return response.data
  },

  getJailsByCity: async (cityId) => {
    const response = await axios.get(`${BASE_URL}/jails/city/${cityId}`, getAuthHeader())
    return response.data
  },

  getJail: async (jailId) => {
    const response = await axios.get(`${BASE_URL}/jails/${jailId}`, getAuthHeader())
    return response.data
  },

  createJail: async (jailData) => {
    const response = await axios.post(`${BASE_URL}/jails`, jailData, getAuthHeader())
    return response.data
  },

  updateJail: async (jailId, jailData) => {
    const response = await axios.put(`${BASE_URL}/jails/${jailId}`, jailData, getAuthHeader())
    return response.data
  },

  deleteJail: async (jailId) => {
    const response = await axios.delete(`${BASE_URL}/jails/${jailId}`, getAuthHeader())
    return response.data
  },

  getCities: async () => {
    const response = await axios.get(`${BASE_URL}/cities`, getAuthHeader())
    return response.data
  },
}
