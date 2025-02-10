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

export const menuLinksApi = {
  getMenuLinks: async () => {
    const response = await axios.get(`${BASE_URL}/menu_links`, getAuthHeader())
    return response.data
  },

  createMenuLink: async (menuLinkData) => {
    const response = await axios.post(`${BASE_URL}/menu_links`, menuLinkData, getAuthHeader())
    return response.data
  },

  updateMenuLink: async (menuLinkId, menuLinkData) => {
    const response = await axios.put(
      `${BASE_URL}/menu_links/${menuLinkId}`,
      menuLinkData,
      getAuthHeader(),
    )
    return response.data
  },

  deleteMenuLink: async (menuLinkId) => {
    const response = await axios.delete(`${BASE_URL}/menu_links/${menuLinkId}`, getAuthHeader())
    return response.data
  },
}
