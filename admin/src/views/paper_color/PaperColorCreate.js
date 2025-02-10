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

const PaperColorCreate = ({ theme, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    color_name: '',
    color_code: '#000000',
    color_price: 0,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({
      ...formData,
      color_price: Number(formData.color_price),
    })
    console.log(formData)
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>Yeni Renk Ekle</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Renk Adı</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.color_name}
              onChange={(e) => setFormData({ ...formData, color_name: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Renk Kodu</Label>
            <HexColorPicker
              color={formData.color_code}
              onChange={(color) => setFormData({ ...formData, color_code: color })}
            />
            <Input
              theme={theme}
              type="text"
              value={formData.color_code}
              onChange={(e) => setFormData({ ...formData, color_code: e.target.value })}
              style={{ marginTop: '1rem' }}
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Fiyat</Label>
            <Input
              theme={theme}
              type="number"
              step="0.01"
              min="0"
              value={formData.color_price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  color_price: Number(e.target.value),
                })
              }
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

export default PaperColorCreate
