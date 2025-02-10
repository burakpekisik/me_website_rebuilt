import React, { useState } from 'react'
import styled from 'styled-components'
import { HexColorPicker } from 'react-colorful'

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

const ErrorMessage = styled.span`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`

const EnvelopeColorCreate = ({ theme, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    color_name: '',
    color_code: '#000000',
    color_price: 0,
  })

  const [errors, setErrors] = useState({
    color_name: false,
    color_code: false,
    color_price: false,
  })

  const validateForm = () => {
    const newErrors = {
      color_name: !formData.color_name.trim(),
      color_code: !formData.color_code.trim(),
      color_price: !formData.color_price,
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)

    // Clear error for this field if value is valid
    setErrors((prev) => ({
      ...prev,
      [field]: field === 'color_price' ? !value : !value.trim(),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onAdd({
        ...formData,
        color_price: Number(formData.color_price),
      })
    }
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Renk Adı</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.color_name}
              onChange={(e) => handleInputChange('color_name', e.target.value)}
            />
            {errors.color_name && <ErrorMessage>Renk adı boş olamaz</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Renk Kodu</Label>
            <HexColorPicker
              color={formData.color_code}
              onChange={(color) => handleInputChange('color_code', color)}
            />
            <Input
              theme={theme}
              type="text"
              value={formData.color_code}
              onChange={(e) => handleInputChange('color_code', e.target.value)}
              style={{ marginTop: '1rem' }}
            />
            {errors.color_code && <ErrorMessage>Renk kodu boş olamaz</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Fiyat</Label>
            <Input
              theme={theme}
              type="number"
              step="0.01"
              min="0"
              value={formData.color_price}
              onChange={(e) => handleInputChange('color_price', Number(e.target.value))}
            />
            {errors.color_price && <ErrorMessage>Fiyat boş olamaz</ErrorMessage>}
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" primary disabled={Object.values(errors).some((error) => error)}>
              Ekle
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default EnvelopeColorCreate
