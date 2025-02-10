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

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
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

const DistrictCityEdit = ({ theme, data, cities, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    city_id: '',
    city_name: '',
    plate_no: '',
    phone_code: '',
    town_name: '',
    town_id: '',
  })

  useEffect(() => {
    if (data) {
      setFormData({
        city_id: data.city_id || '',
        city_name: data.city_name || '',
        plate_no: data.plate_no || '',
        phone_code: data.phone_code || '',
        town_name: data.town_name || '',
        town_id: data.town_id || '',
      })
    }
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>{data.town_id ? 'İlçe Düzenle' : 'İl Düzenle'}</h2>
        <form onSubmit={handleSubmit}>
          {!data.town_id ? (
            // City edit form
            <FormGroup>
              <Label theme={theme}>İl Adı</Label>
              <Input
                theme={theme}
                type="text"
                value={formData.city_name}
                onChange={(e) => setFormData({ ...formData, city_name: e.target.value })}
              />
            </FormGroup>
          ) : (
            // Town edit form
            <>
              <FormGroup>
                <Label theme={theme}>İl</Label>
                <Select
                  theme={theme}
                  value={formData.city_id}
                  onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                >
                  {cities.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>İlçe Adı</Label>
                <Input
                  theme={theme}
                  type="text"
                  value={formData.town_name}
                  onChange={(e) => setFormData({ ...formData, town_name: e.target.value })}
                />
              </FormGroup>
            </>
          )}
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

export default DistrictCityEdit
