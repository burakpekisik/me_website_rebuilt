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

const RadioGroup = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
`

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  cursor: pointer;
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

const DistrictCityCreate = ({ theme, cities, onClose, onAdd }) => {
  const [type, setType] = useState('city')
  const [formData, setFormData] = useState({
    city_name: '',
    plate_no: '',
    phone_code: '',
    town_name: '',
    city_id: '',
    country_id: 1, // Default for Turkey
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (type === 'city') {
      onAdd({
        type: 'city',
        data: {
          country_id: formData.country_id,
          city_name: formData.city_name,
          plate_no: parseInt(formData.plate_no),
          phone_code: formData.phone_code,
        },
      })
    } else {
      onAdd({
        type: 'town',
        data: {
          city_id: parseInt(formData.city_id),
          town_name: formData.town_name,
        },
      })
    }
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>{type === 'city' ? 'Yeni İl Ekle' : 'Yeni İlçe Ekle'}</h2>
        <form onSubmit={handleSubmit}>
          <RadioGroup>
            <RadioLabel theme={theme}>
              <input
                type="radio"
                value="city"
                checked={type === 'city'}
                onChange={(e) => setType(e.target.value)}
              />
              İl
            </RadioLabel>
            <RadioLabel theme={theme}>
              <input
                type="radio"
                value="town"
                checked={type === 'town'}
                onChange={(e) => setType(e.target.value)}
              />
              İlçe
            </RadioLabel>
          </RadioGroup>

          {type === 'city' ? (
            <>
              <FormGroup>
                <Label theme={theme}>İl Adı</Label>
                <Input
                  theme={theme}
                  type="text"
                  value={formData.city_name}
                  onChange={(e) => setFormData({ ...formData, city_name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Plaka Kodu</Label>
                <Input
                  theme={theme}
                  type="number"
                  value={formData.plate_no}
                  onChange={(e) => setFormData({ ...formData, plate_no: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Telefon Kodu</Label>
                <Input
                  theme={theme}
                  type="text"
                  value={formData.phone_code}
                  onChange={(e) => setFormData({ ...formData, phone_code: e.target.value })}
                  required
                />
              </FormGroup>
            </>
          ) : (
            <>
              <FormGroup>
                <Label theme={theme}>İl</Label>
                <Select
                  theme={theme}
                  value={formData.city_id}
                  onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                  required
                >
                  <option value="">İl Seçin</option>
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
                  required
                />
              </FormGroup>
            </>
          )}

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

export default DistrictCityCreate
