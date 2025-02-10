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

export const fetchCustomers = async () => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const token = localStorage.getItem('token')

  try {
    const response = await axios.get(`${BASE_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw error
  }
}


export const createCustomer = async (customerData) => {
  const token = localStorage.getItem('token')

  try {
    const response = await axios.post(`${BASE_URL}/admin/users`, customerData, {
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

export const updateCustomer = async (customerId, customerData) => {
  const token = localStorage.getItem('token')

  try {
    const response = await axios.put(`${BASE_URL}/admin/users/${customerId}`, customerData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error updating order:', error)
    throw error
  }
}

export const deleteCustomer = async (customerId) => {
  const token = localStorage.getItem('token')

  try {
    const response = await axios.delete(`${BASE_URL}/admin/users/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error deleting order:', error)
    throw error
  }
}