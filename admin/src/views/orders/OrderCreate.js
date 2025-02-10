import { Check, Plus, Trash2, Upload, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import { createOrder, fetchCardPostals, fetchCategories, uploadPhotos } from './FetchOrders'

// Global Styles and Theme
const theme = {
  colors: {
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    secondary: '#6366F1',
    background: '#F3F4F6',
    text: '#1F2937',
    border: '#D1D5DB',
    white: '#FFFFFF',
    red: '#EF4444',
    redHover: '#DC2626',
  },
  borderRadius: '0.75rem',
  transition: 'all 0.3s ease',
}

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`

const ModalContainer = styled.div`
  background: ${theme.colors.white};
  border-radius: ${theme.borderRadius};
  width: 100%;
  max-width: 64rem;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`

const ModalHeader = styled.div`
  background: linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary});
  color: ${theme.colors.white};
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: ${theme.borderRadius};
  border-top-right-radius: ${theme.borderRadius};
`

const CloseButton = styled.button`
  background: transparent;
  color: ${theme.colors.white};
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  transition: ${theme.transition};
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const ModalContent = styled.div`
  padding: 1.5rem;
  display: grid;
  gap: 1.5rem;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  transition: ${theme.transition};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  transition: ${theme.transition};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
`

const CardPostalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const CardPostalItem = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: ${theme.transition};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`

const CardPostalImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
`

const CardPostalDetails = styled.div`
  padding: 0.75rem;
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: ${theme.borderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: ${theme.transition};
`

const PrimaryButton = styled(Button)`
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }
`

const SecondaryButton = styled(Button)`
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};

  &:hover {
    background-color: ${theme.colors.border};
  }
`

const RemoveButton = styled(Button)`
  background-color: ${theme.colors.red};
  color: ${theme.colors.white};
  border: none;

  &:hover {
    background-color: ${theme.colors.redHover};
  }
`

const DropzoneContainer = styled.div`
  border: 2px dashed ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: ${theme.transition};

  &:hover {
    border-color: ${theme.colors.primary};
    background-color: rgba(37, 99, 235, 0.05);
  }
`

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const PhotoThumbnail = styled.div`
  position: relative;
  border-radius: ${theme.borderRadius};
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`

const PhotoImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
`

const OrderCreate = ({ isOpen, onClose, theme }) => {
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_surname: '',
    letter_type: 'Cezaevine Mektup',
    status: 'Sipariş Bekleniyor',
  })

  const BASE_URL = process.env.REACT_APP_API_URL
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [cardPostals, setCardPostals] = useState([])
  const [selectedCardPostals, setSelectedCardPostals] = useState([])
  const [photos, setPhotos] = useState([])
  const [isWhatsAppOrder, setIsWhatsAppOrder] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setPhotos((prev) => [...prev, ...acceptedFiles])
    },
  })

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data)
      } catch (error) {
        console.error('Failed to load categories')
      }
    }
    loadCategories()
  }, [])

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId)
    try {
      const data = await fetchCardPostals(categoryId)
      setCardPostals(data)
    } catch (error) {
      console.error('Failed to load card postals')
    }
  }

  const handleSubmit = async () => {
    try {
      const orderData = {
        ...formData,
        cardpostals: selectedCardPostals.map((cp) => cp.id),
        photos: [], // Will be uploaded separately
        order_price: 0, // You might want to calculate this
        sender_city: '', // Add appropriate fields
        sender_district: '',
        sender_address: '',
        receiver_name: '',
        receiver_surname: '',
        receiver_city: '',
        receiver_phone: '',
        jail_name: '',
        jail_address: '',
        father_name: '',
        ward_id: '',
        envelope_text: '',
        envelope_color: '',
        paper_color: '',
        files: [],
        smell: '',
        shipment_type: '',
        discount: 0,
        shipment_date: '',
        add_date: 1,
        track_id: '',
        track_link: '',
      }

      console.log(formData)
      console.log(orderData)

      const createdOrder = await createOrder(orderData)

      if (photos.length > 0) {
        await uploadPhotos(createdOrder.id, photos)
      }

      onClose()
    } catch (error) {
      console.error('Order creation failed', error)
    }
  }

  if (!isOpen) return null

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>Sipariş Oluştur</h2>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <FormGrid>
            <Input
              placeholder="Ad"
              value={formData.sender_name}
              onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
            />
            <Input
              placeholder="Soyad"
              value={formData.sender_surname}
              onChange={(e) => setFormData({ ...formData, sender_surname: e.target.value })}
            />

            <Select
              value={formData.letter_type}
              onChange={(e) => setFormData({ ...formData, letter_type: e.target.value })}
            >
              {[
                'Cezaevine Mektup',
                'Sevgiliye Mektup',
                'Askere Mektup',
                'Normal Mektup',
                'Gizli Mektup',
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>

            <Input
              placeholder="Telefon Numarası"
              value={formData.phone}
              // onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Select
              value={selectedCategory || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Kategori Seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>

            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {[
                'Sipariş Oluşturuldu',
                'Sipariş Bekleniyor',
                'Hazırlanıyor',
                'Gönderildi',
                'Teslim Edildi',
              ].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </FormGrid>

          <CheckboxWrapper>
            <Checkbox
              type="checkbox"
              id="whatsapp-order"
              checked={isWhatsAppOrder}
              onChange={() => setIsWhatsAppOrder(!isWhatsAppOrder)}
            />
            <label htmlFor="whatsapp-order">WhatsApp Siparişi Mi?</label>
          </CheckboxWrapper>

          {selectedCategory && (
            <div>
              <h3>Kartpostallar</h3>
              <CardPostalGrid>
                {cardPostals.map((cardPostal) => (
                  <CardPostalItem key={cardPostal.id}>
                    <CardPostalImage
                      src={`${BASE_URL}${cardPostal.image_path}`}
                      alt={cardPostal.name}
                    />
                    <CardPostalDetails>
                      <p>{cardPostal.name}</p>
                      <PrimaryButton
                        onClick={() => {
                          const isAlreadySelected = selectedCardPostals.find(
                            (cp) => cp.id === cardPostal.id,
                          )
                          if (!isAlreadySelected) {
                            setSelectedCardPostals((prev) => [...prev, cardPostal])
                          }
                        }}
                      >
                        <Plus /> Ekle
                      </PrimaryButton>
                    </CardPostalDetails>
                  </CardPostalItem>
                ))}
              </CardPostalGrid>
            </div>
          )}

          {selectedCardPostals.length > 0 && (
            <div>
              <h3>Seçilen Kartpostallar</h3>
              <CardPostalGrid>
                {selectedCardPostals.map((cardPostal) => (
                  <CardPostalItem key={cardPostal.id}>
                    <CardPostalImage
                      src={`${BASE_URL}${cardPostal.image_path}`}
                      alt={cardPostal.name}
                    />
                    <CardPostalDetails>
                      <p>{cardPostal.name}</p>
                      <RemoveButton
                        onClick={() => {
                          setSelectedCardPostals((prev) =>
                            prev.filter((cp) => cp.id !== cardPostal.id),
                          )
                        }}
                      >
                        <Trash2 /> Sil
                      </RemoveButton>
                    </CardPostalDetails>
                  </CardPostalItem>
                ))}
              </CardPostalGrid>
            </div>
          )}

          <div>
            <h3>Fotoğraf Yükleme</h3>
            <DropzoneContainer {...getRootProps()}>
              <input {...getInputProps()} />
              <div>
                <Upload size={48} />
                <p>Fotoğrafları sürükleyip bırakın veya tıklayın</p>
              </div>
            </DropzoneContainer>
          </div>

          {photos.length > 0 && (
            <PhotoGrid>
              {photos.map((photo, index) => (
                <PhotoThumbnail key={index}>
                  <PhotoImage src={URL.createObjectURL(photo)} alt={`Uploaded photo ${index}`} />
                  <RemoveButton
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '50%',
                    }}
                    onClick={() => {
                      setPhotos((prev) => prev.filter((_, i) => i !== index))
                    }}
                  >
                    <Trash2 size={16} />
                  </RemoveButton>
                </PhotoThumbnail>
              ))}
            </PhotoGrid>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '1.5rem',
            }}
          >
            <SecondaryButton onClick={onClose}>İptal</SecondaryButton>
            <PrimaryButton onClick={handleSubmit}>
              <Check /> Sipariş Oluştur
            </PrimaryButton>
          </div>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default OrderCreate
