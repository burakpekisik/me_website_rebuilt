import { Check, X } from 'lucide-react'
import React, { useState } from 'react'
import styled from 'styled-components'
import { createCustomer } from './FetchCustomers'

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
  background-color: ${theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
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

const CustomerCreate = ({ isOpen, onClose, theme }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone_number: '',
    password: '',
    is_verified: 0, // Default to 0 (Pasif)
  })

  const handleSubmit = async () => {
    try {
      const customerData = {
        ...formData,
      }

      console.log(formData)
      console.log(customerData)

      const createdCustomer = await createCustomer(customerData)
      console.log('Customer created:', createdCustomer)

      onClose()
    } catch (error) {
      console.error('Customer creation failed', error)
    }
  }

  if (!isOpen) return null

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <h2>Üye Oluştur</h2>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <FormGrid>
            <Input
              placeholder="Ad"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Soyad"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              placeholder="Telefon Numarası"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            />
            <Input
              placeholder="Şifre"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Select
              value={formData.is_verified}
              onChange={(e) => setFormData({ ...formData, is_verified: parseInt(e.target.value) })}
            >
              <option value="" disabled>
                Onay Durumu
              </option>
              <option value={1}>Aktif</option>
              <option value={0}>Pasif</option>
            </Select>
          </FormGrid>
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
              <Check /> Üye Oluştur
            </PrimaryButton>
          </div>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default CustomerCreate
