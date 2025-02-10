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

export const districtCityApi = {
  getCities: async () => {
    const response = await axios.get(`${BASE_URL}/cities`, getAuthHeader())
    return response.data
  },

  getTowns: async (cityId) => {
    const response = await axios.get(`${BASE_URL}/towns/city/${cityId}`, getAuthHeader())
    return response.data
  },

  getCity: async (cityId) => {
    const response = await axios.get(`${BASE_URL}/cities/${cityId}`, getAuthHeader())
    return response.data
  },

  getTown: async (townId) => {
    const response = await axios.get(`${BASE_URL}/towns/${townId}`, getAuthHeader())
    return response.data
  },

  updateCity: async (cityId, cityData) => {
    const response = await axios.put(`${BASE_URL}/cities/${cityId}`, cityData, getAuthHeader())
    return response.data
  },

  updateTown: async (townId, townData) => {
    const response = await axios.put(`${BASE_URL}/towns/${townId}`, townData, getAuthHeader())
    return response.data
  },

  createCity: async (cityData) => {
    const response = await axios.post(`${BASE_URL}/cities`, cityData, getAuthHeader())
    return response.data
  },

  createTown: async (townData) => {
    const response = await axios.post(`${BASE_URL}/towns`, townData, getAuthHeader())
    return response.data
  },

  deleteCity: async (cityId) => {
    const response = await axios.delete(`${BASE_URL}/cities/${cityId}`, getAuthHeader())
    return response.data
  },

  deleteTown: async (townId) => {
    const response = await axios.delete(`${BASE_URL}/towns/${townId}`, getAuthHeader())
    return response.data
  },
}
