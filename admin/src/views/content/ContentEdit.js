import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { contentApi } from './FetchContent'

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#ffffff')};
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
`

const FormGroup = styled.div`
  margin-bottom: 1rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  resize: vertical;
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: ${(props) => (props.primary ? '#3498db' : '#e0e0e0')};
  color: ${(props) => (props.primary ? '#ffffff' : '#2c3e50')};
`

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const PhotoPreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
`

const DeleteButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`
const QuillWrapper = styled.div`
  .ql-container {
    min-height: 200px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  }

  .ql-toolbar {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    background: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#f7f7f7')};
  }

  .ql-stroke {
    stroke: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  }

  .ql-fill {
    fill: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  }

  .ql-picker {
    color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  }

  .ql-editor {
    color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
    min-height: 200px;
  }
`

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
}

const ContentEdit = ({ theme, content, onClose, onSave }) => {
  const BASE_URL = process.env.REACT_APP_API_URL

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    mainPhotos: [],
    otherPhotos: [],
    existingMainPhoto: null, // Changed from array to single value
    existingOtherPhotos: [],
    mainPhotoToDelete: null, // Changed from array to single value
    otherPhotosToDelete: [],
  })
  const [mainPreview, setMainPreview] = useState(null) // Single preview for main photo
  const [otherPreviews, setOtherPreviews] = useState([])

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        text: content.text || '',
        mainPhotos: [],
        otherPhotos: [],
        existingMainPhoto: content.main_photo || null, // Single main photo
        existingOtherPhotos: content.other_photos || [],
        mainPhotoToDelete: null,
        otherPhotosToDelete: [],
      })
    }
  }, [content])

  const handleMainPhoto = (e) => {
    const file = e.target.files[0] // Only take first file
    if (file) {
      setFormData({ ...formData, mainPhotos: [file] })

      const reader = new FileReader()
      reader.onloadend = () => {
        setMainPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOtherPhotos = (e) => {
    const files = Array.from(e.target.files)
    setFormData({ ...formData, otherPhotos: [...formData.otherPhotos, ...files] })

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setOtherPreviews((prev) => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeMainPhoto = (isExisting = false) => {
    if (isExisting && formData.existingMainPhoto) {
      contentApi
        .deleteMedia('content', 'main_photo', content.id, [formData.existingMainPhoto])
        .then(() => {
          setFormData({
            ...formData,
            existingMainPhoto: null,
          })
        })
        .catch((error) => {
          console.error('Error:', error)
          alert('Fotoğraf silinirken hata oluştu')
        })
    } else {
      setFormData({
        ...formData,
        mainPhotos: [],
      })
      setMainPreview(null)
    }
  }

  const removeOtherPhoto = (index, isExisting = false) => {
    if (isExisting) {
      const photoUrl = formData.existingOtherPhotos[index]
      contentApi
        .deleteMedia('content', 'other_photos', content.id, [photoUrl])
        .then(() => {
          const updatedPhotos = [...formData.existingOtherPhotos]
          updatedPhotos.splice(index, 1)
          setFormData({
            ...formData,
            existingOtherPhotos: updatedPhotos,
          })
        })
        .catch((error) => {
          console.error('Error deleting photo:', error)
          alert('Fotoğraf silinirken hata oluştu')
        })
    } else {
      const newOtherPhotos = [...formData.otherPhotos]
      newOtherPhotos.splice(index, 1)
      const newPreviews = [...otherPreviews]
      newPreviews.splice(index, 1)

      setFormData({
        ...formData,
        otherPhotos: newOtherPhotos,
      })
      setOtherPreviews(newPreviews)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.text) {
      alert('Lütfen zorunlu alanları doldurun')
      return
    }

    const updateData = {
      title: formData.title,
      text: formData.text,
      mainPhotos: formData.mainPhotos,
      otherPhotos: formData.otherPhotos,
    }

    onSave(content.id, updateData)
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>İçerik Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Ana Fotoğraf</Label>
            <Input theme={theme} type="file" accept="image/*" onChange={handleMainPhoto} />
            <PhotoGrid>
              {formData.existingMainPhoto && (
                <PhotoPreview>
                  <PreviewImage
                    src={`${BASE_URL}/${formData.existingMainPhoto}`}
                    alt="Main Photo"
                  />
                  <DeleteButton onClick={() => removeMainPhoto(true)}>×</DeleteButton>
                </PhotoPreview>
              )}
              {mainPreview && (
                <PhotoPreview>
                  <PreviewImage src={mainPreview} alt="New Main Photo" />
                  <DeleteButton onClick={() => removeMainPhoto(false)}>×</DeleteButton>
                </PhotoPreview>
              )}
            </PhotoGrid>
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Diğer Fotoğraflar</Label>
            <Input
              theme={theme}
              type="file"
              accept="image/*"
              multiple
              onChange={handleOtherPhotos}
            />
            <PhotoGrid>
              {formData.existingOtherPhotos.map((photo, index) => (
                <PhotoPreview key={`existing-${index}`}>
                  <PreviewImage
                    src={`${BASE_URL}/${photo}`}
                    alt={`Existing Other ${index + 1}`}
                  />
                  <DeleteButton onClick={() => removeOtherPhoto(index, true)}>×</DeleteButton>
                </PhotoPreview>
              ))}
              {otherPreviews.map((preview, index) => (
                <PhotoPreview key={`new-${index}`}>
                  <PreviewImage src={preview} alt={`New Other ${index + 1}`} />
                  <DeleteButton onClick={() => removeOtherPhoto(index)}>×</DeleteButton>
                </PhotoPreview>
              ))}
            </PhotoGrid>
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Başlık</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>İçerik</Label>
            <TextArea
              theme={theme}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
            />
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" primary>
              Kaydet
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default ContentEdit
