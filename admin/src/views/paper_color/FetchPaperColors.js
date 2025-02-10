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

export const paperColorsApi = {
  getPaperColors: async () => {
    const response = await axios.get(`${BASE_URL}/paper_colors`, getAuthHeader())
    return response.data
  },

  createPaperColor: async (colorData) => {
    const response = await axios.post(`${BASE_URL}/paper_colors`, colorData, getAuthHeader())
    return response.data
  },

  updatePaperColor: async (colorId, colorData) => {
    const response = await axios.put(
      `${BASE_URL}/paper_colors/${colorId}`,
      colorData,
      getAuthHeader(),
    )
    return response.data
  },

  deletePaperColor: async (colorId) => {
    const response = await axios.delete(`${BASE_URL}/paper_colors/${colorId}`, getAuthHeader())
    return response.data
  },
}
