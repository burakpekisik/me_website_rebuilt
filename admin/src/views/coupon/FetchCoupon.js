import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export const couponApi = {
  getCoupons: async () => {
    const response = await axios.get(`${BASE_URL}/coupons/all`, getAuthHeader())
    return response.data
  },

  createCoupon: async (data) => {
    const response = await axios.post(
      `${BASE_URL}/coupons`,
      {
        coupon: {
          ...data.coupon,
        },
        user_ids: data.user_ids,
      },
      getAuthHeader(),
    )
    return response.data
  },

  deleteCoupon: async (couponCode) => {
    const response = await axios.delete(`${BASE_URL}/coupons/${couponCode}`, getAuthHeader())
    return response.data
  },

  updateCoupon: async (couponCode, data) => {
    const response = await axios.put(
      `${BASE_URL}/coupons/${couponCode}`,
      {
        coupon: {
          ...data.coupon,
        },
        user_ids: data.user_ids,
      },
      getAuthHeader(),
    )
    return response.data
  },

  getUsers: async () => {
    const response = await axios.get(`${BASE_URL}/admin/users`, getAuthHeader())
    return response.data
  },
}
