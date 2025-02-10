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

export const envelopeColorsApi = {
  getEnvelopeColors: async () => {
    const response = await axios.get(`${BASE_URL}/envelope_colors`, getAuthHeader())
    return response.data
  },

  createEnvelopeColor: async (colorData) => {
    const response = await axios.post(`${BASE_URL}/envelope_colors`, colorData, getAuthHeader())
    return response.data
  },

  updateEnvelopeColor: async (colorId, colorData) => {
    const response = await axios.put(
      `${BASE_URL}/envelope_colors/${colorId}`,
      colorData,
      getAuthHeader(),
    )
    return response.data
  },

  deleteEnvelopeColor: async (colorId) => {
    const response = await axios.delete(`${BASE_URL}/envelope_colors/${colorId}`, getAuthHeader())
    return response.data
  },
}
