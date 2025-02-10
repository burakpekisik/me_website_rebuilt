import React, { useState, useEffect } from 'react'
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
  width: 500px;
`

const FormGroup = styled.div`
  margin-bottom: 1rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  text-align: center;
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
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  min-height: 100px;
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

const FeatureEdit = ({ theme, feature, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    feature_name: '',
    feature_description: '',
    feature_logo: '',
  })
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (feature) {
      setFormData({
        feature_name: feature.feature_name || '',
        feature_description: feature.feature_description || '',
        feature_logo: feature.feature_logo || '',
      })
      setPreviewUrl(feature.feature_logo)
    }
  }, [feature])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, feature_logo: file })
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.feature_name) {
      alert('Lütfen zorunlu alanları doldurun')
      return
    }

    onSave(formData)
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>Özellik Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Özellik Adı</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.feature_name}
              onChange={(e) => setFormData({ ...formData, feature_name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>İkon Class</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.feature_logo}
              onChange={(e) => setFormData({ ...formData, feature_logo: e.target.value })}
              placeholder="örn: fa-solid fa-headset"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Açıklama</Label>
            <TextArea
              theme={theme}
              value={formData.feature_description}
              onChange={(e) => setFormData({ ...formData, feature_description: e.target.value })}
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

export default FeatureEdit
