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

const Select = styled.select`
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

const JailEdit = ({ theme, data, cities, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    city_id: '',
    name: '',
    address: '',
    type: 1,
  })

  useEffect(() => {
    if (data) {
      setFormData({
        city_id: data.city_id || '',
        name: data.name || '',
        address: data.address || '',
        type: data.type || 1,
      })
    }
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      city_id: parseInt(formData.city_id),
      type: parseInt(formData.type),
    })
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>Cezaevi Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>İl</Label>
            <Select
              theme={theme}
              value={formData.city_id}
              onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
              required
            >
              {cities.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Cezaevi Adı</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Adres</Label>
            <TextArea
              theme={theme}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Tip</Label>
            <Input
              theme={theme}
              type="number"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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

export default JailEdit
