import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

export const contentApi = {
  getContents: async () => {
    const response = await axios.get(`${BASE_URL}/content`, getAuthHeader())
    return response.data
  },

  createContent: async (data) => {
    try {
      // First create the content with basic data
      const response = await axios.post(
        `${BASE_URL}/content`,
        {
          title: data.title,
          text: data.text,
        },
        getAuthHeader(),
      )

      // Handle main photos upload
      if (data.mainPhotos?.length > 0) {
        const mainPhotosForm = new FormData()
        data.mainPhotos.forEach((file) => {
          mainPhotosForm.append('files', file)
        })
        await axios.post(
          `${BASE_URL}/upload/media?model_type=content&field_name=main_photo&record_id=${response.data.id}`,
          mainPhotosForm,
          {
            ...getAuthHeader(),
            headers: {
              ...getAuthHeader().headers,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
      }

      // Handle other photos upload
      if (data.otherPhotos?.length > 0) {
        const otherPhotosForm = new FormData()
        data.otherPhotos.forEach((file) => {
          otherPhotosForm.append('files', file)
        })
        await axios.post(
          `${BASE_URL}/upload/media?model_type=content&field_name=other_photos&record_id=${response.data.id}`,
          otherPhotosForm,
          {
            ...getAuthHeader(),
            headers: {
              ...getAuthHeader().headers,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
      }

      return response.data
    } catch (error) {
      throw error
    }
  },

  updateContent: async (id, data) => {
    try {
      // Update content basic data
      const response = await axios.put(
        `${BASE_URL}/content/${id}`,
        {
          title: data.title,
          text: data.text,
        },
        getAuthHeader(),
      )

      // Handle photo deletions if any
      if (data.mainPhotosToDelete?.length > 0) {
        await axios.delete(`${BASE_URL}/upload/media`, {
          ...getAuthHeader(),
          data: {
            model_type: 'content',
            field_name: 'main_photos',
            record_id: id,
            photos_to_delete: data.mainPhotosToDelete,
          },
        })
      }

      if (data.otherPhotosToDelete?.length > 0) {
        await axios.delete(`${BASE_URL}/upload/media`, {
          ...getAuthHeader(),
          data: {
            model_type: 'content',
            field_name: 'other_photos',
            record_id: id,
            photos_to_delete: data.otherPhotosToDelete,
          },
        })
      }

      // Handle new photo uploads if any
      if (data.mainPhotos?.length > 0) {
        const mainPhotosForm = new FormData()
        data.mainPhotos.forEach((file) => {
          mainPhotosForm.append('files', file)
        })
        await axios.post(
          `${BASE_URL}/upload/media?model_type=content&field_name=main_photos&record_id=${id}`,
          mainPhotosForm,
          {
            ...getAuthHeader(),
            headers: {
              ...getAuthHeader().headers,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
      }

      if (data.otherPhotos?.length > 0) {
        const otherPhotosForm = new FormData()
        data.otherPhotos.forEach((file) => {
          otherPhotosForm.append('files', file)
        })
        await axios.post(
          `${BASE_URL}/upload/media?model_type=content&field_name=other_photos&record_id=${id}`,
          otherPhotosForm,
          {
            ...getAuthHeader(),
            headers: {
              ...getAuthHeader().headers,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
      }

      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteMedia: async (modelType, fieldName, recordId, photos) => {
    try {
      const response = await axios.delete(`${BASE_URL}/upload/media`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        data: {
          model_type: modelType,
          field_name: fieldName,
          record_id: parseInt(recordId), // Ensure recordId is a number
          photos_to_delete: photos,
        },
      })
      return response.data
    } catch (error) {
      console.error('Delete Media Error:', error.response?.data || error)
      throw error
    }
  },
}
