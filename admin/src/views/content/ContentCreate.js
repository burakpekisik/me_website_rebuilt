import React, { useState } from 'react'
import styled from 'styled-components'

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

const ContentCreate = ({ theme, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    mainPhotos: [],
    otherPhotos: [],
  })
  const [mainPreviews, setMainPreviews] = useState([])
  const [otherPreviews, setOtherPreviews] = useState([])

  const handleMainPhotos = (e) => {
    const files = Array.from(e.target.files)
    setFormData({ ...formData, mainPhotos: [...formData.mainPhotos, ...files] })

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainPreviews((prev) => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
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

  const removeMainPhoto = (index) => {
    setFormData({
      ...formData,
      mainPhotos: formData.mainPhotos.filter((_, i) => i !== index),
    })
    setMainPreviews(mainPreviews.filter((_, i) => i !== index))
  }

  const removeOtherPhoto = (index) => {
    setFormData({
      ...formData,
      otherPhotos: formData.otherPhotos.filter((_, i) => i !== index),
    })
    setOtherPreviews(otherPreviews.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.text) {
      alert('Lütfen zorunlu alanları doldurun')
      return
    }

    const submitData = {
      title: formData.title,
      text: formData.text,
      mainPhotos: formData.mainPhotos,
      otherPhotos: formData.otherPhotos,
    }

    onAdd(submitData)
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>Yeni İçerik Ekle</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Ana Fotoğraflar</Label>
            <Input
              theme={theme}
              type="file"
              accept="image/*"
              multiple
              onChange={handleMainPhotos}
            />
            <PhotoGrid>
              {mainPreviews.map((preview, index) => (
                <PhotoPreview key={index}>
                  <PreviewImage src={preview} alt={`Main ${index + 1}`} />
                  <DeleteButton onClick={() => removeMainPhoto(index)}>×</DeleteButton>
                </PhotoPreview>
              ))}
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
              {otherPreviews.map((preview, index) => (
                <PhotoPreview key={index}>
                  <PreviewImage src={preview} alt={`Other ${index + 1}`} />
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
              Ekle
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default ContentCreate
