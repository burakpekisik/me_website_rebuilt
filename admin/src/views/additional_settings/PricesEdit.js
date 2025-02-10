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

const ModalContent = styled.div`
  background: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#ffffff')};
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  text-align: center;
`

const PriceEdit = ({ theme, price, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    price_name: '',
    price_value: '',
    price_description: '',
  })

  useEffect(() => {
    if (price) {
      setFormData({
        price_name: price.price_name || '',
        price_value: price.price_value || '',
        price_description: price.price_description || '',
      })
    }
  }, [price])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.price_name || !formData.price_value) {
      alert('Lütfen zorunlu alanları doldurun')
      return
    }
    onSave(formData)
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>Fiyat Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Fiyat Adı</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.price_name}
              onChange={(e) => setFormData({ ...formData, price_name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Fiyat Değeri (₺)</Label>
            <Input
              theme={theme}
              type="number"
              step="0.01"
              value={formData.price_value}
              onChange={(e) =>
                setFormData({ ...formData, price_value: parseFloat(e.target.value) })
              }
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Açıklama</Label>
            <TextArea
              theme={theme}
              value={formData.price_description}
              onChange={(e) => setFormData({ ...formData, price_description: e.target.value })}
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

export default PriceEdit
