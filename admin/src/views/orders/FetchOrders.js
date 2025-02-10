import axios from 'axios'

export const buildPayload = (
  editableData,
  cities,
  towns,
  jails,
  envelopeColors,
  paperColors,
  orderData,
) => {
  return {
    sender_name: editableData.sender_name || '',
    sender_surname: editableData.sender_surname || '',
    sender_city:
      String(cities.find((city) => city.city_name === editableData.sender_city)?.city_id) || '',
    sender_district:
      String(towns.find((town) => town.town_name === editableData.sender_district)?.town_id) || '',
    sender_address: editableData.sender_address || '',

    receiver_name: editableData.receiver_name || '',
    receiver_surname: editableData.receiver_surname || '',
    receiver_city:
      String(cities.find((city) => city.city_name === editableData.receiver_city)?.city_id) || '',
    receiver_phone: editableData.receiver_phone || '',

    jail_name: String(jails.find((jail) => jail.name === editableData.jail_name)?.id) || '',
    jail_address: editableData.jail_address || '',
    father_name: editableData.father_name || '',
    ward_id: editableData.ward_id || '',

    letter_type: editableData.letter_type || '',
    order_price: editableData.order_price || '',
    status: editableData.status || '',
    envelope_text: editableData.envelope_text || '',

    envelope_color:
      envelopeColors.find((color) => color.color_name === editableData.envelope_color)
        ?.color_code ||
      editableData.envelope_color ||
      '',
    paper_color:
      paperColors.find((color) => color.color_name === editableData.paper_color)?.color_code ||
      editableData.paper_color ||
      '',
    track_id: editableData.track_id || '',
    track_link: editableData.track_link || '',

    // Default or unchanged fields
    cardpostals: orderData.cardpostals || [],
    photos: orderData.photos || [],
    files: orderData.files || [],
    smell: orderData.smell || '',
    shipment_type: orderData.shipment_type || '',
    tax: orderData.tax || 0,
    discount: orderData.discount || 0,
    shipment_date: orderData.shipment_date || '',
    add_date: orderData.add_date || 1,
  }
}

export const fetchOrders = async () => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const token = localStorage.getItem('token')

  try {
    const response = await axios.get(`${BASE_URL}/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`)
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export const fetchCardPostals = async (categoryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/cardpostals/${categoryId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching card postals:', error)
    throw error
  }
}

export const createOrder = async (orderData) => {
  const token = localStorage.getItem('token')

  try {
    const response = await axios.post(`${BASE_URL}/admin/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export const uploadPhotos = async (orderId, photos) => {
  const token = localStorage.getItem('token')

  try {
    const formData = new FormData()
    formData.append('order_id', orderId)

    photos.forEach((photo, index) => {
      formData.append('files', photo)
    })

    const response = await axios.post(`${BASE_URL}/photo/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      params: {
        order_id: orderId,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error uploading photos:', error)
    throw error
  }
}

export const fetchLetterTypes = () => {
  return ['Cezaevine Mektup', 'Sevgiliye Mektup', 'Askere Mektup', 'Normal Mektup', 'Gizli Mektup']
}

export const fetchOrderStatuses = () => {
  return [
    'Sipariş Oluşturuldu',
    'Sipariş Bekleniyor',
    'Ödeme Bekleniyor - Kredi Kartı',
    'Ödeme Bekleniyor - Transfer',
    'Gönderildi',
    'Teslim Edildi',
  ]
}

export const fetchEnvelopeColors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/envelope_colors`)
    return response.data
  } catch (error) {
    console.error('Error fetching envelope colors:', error)
    throw error
  }
}

export const fetchPaperColors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/paper_colors`)
    return response.data
  } catch (error) {
    console.error('Error fetching paper colors:', error)
    throw error
  }
}

export const fetchCities = async () => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(`${BASE_URL}/cities`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching cities:', error)
    throw error
  }
}

export const fetchCityById = async (cityId) => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(`${BASE_URL}/cities/${cityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching city details:', error)
    throw error
  }
}

export const fetchTowns = async () => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(`${BASE_URL}/towns`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching towns:', error)
    throw error
  }
}

export const fetchTownById = async (townId) => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(`${BASE_URL}/towns/${townId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching town details:', error)
    throw error
  }
}

export const fetchJails = async () => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(`${BASE_URL}/jails`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching jails:', error)
    throw error
  }
}

export const fetchJailById = async (jailId) => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(`${BASE_URL}/jail/${jailId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching jail details:', error)
    throw error
  }
}

export const fetchTownsByCity = async (cityId) => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(`${BASE_URL}/towns/city/${cityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching towns for city ${cityId}:`, error)
    throw error
  }
}

export const fetchJailsByCity = async (cityId) => {
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get(`${BASE_URL}/jails/city/${cityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching jails for city ${cityId}:`, error)
    throw error
  }
}