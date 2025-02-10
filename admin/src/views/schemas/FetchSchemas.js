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

export const schemasApi = {
  getSchemas: async () => {
    const response = await axios.get(`${BASE_URL}/schemas`, getAuthHeader())
    return response.data
  },

  createSchema: async (schemaData) => {
    const response = await axios.post(`${BASE_URL}/schemas`, schemaData, getAuthHeader())
    return response.data
  },

  updateSchema: async (schemaId, schemaData) => {
    const response = await axios.put(`${BASE_URL}/schemas/${schemaId}`, schemaData, getAuthHeader())
    return response.data
  },

  deleteSchema: async (schemaId) => {
    const response = await axios.delete(`${BASE_URL}/schemas/${schemaId}`, getAuthHeader())
    return response.data
  },
}
