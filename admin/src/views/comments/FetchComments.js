import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export const commentApi = {
  getComments: async () => {
    const response = await axios.get(`${BASE_URL}/comments`, getAuthHeader())
    return response.data
  },

  createComment: async (data) => {
    const response = await axios.post(`${BASE_URL}/admin/comments`, data, getAuthHeader())
    return response.data
  },

  updateComment: async (id, data) => {
    const response = await axios.put(`${BASE_URL}/admin/comments/${id}`, data, getAuthHeader())
    return response.data
  },

  deleteComment: async (id) => {
    const response = await axios.delete(`${BASE_URL}/admin/comments/${id}`, getAuthHeader())
    return response.data
  },

  getUsers: async () => {
    const response = await axios.get(`${BASE_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return response.data
  },
}
