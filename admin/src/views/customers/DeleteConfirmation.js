import { AlertTriangle } from 'lucide-react'
import React from 'react'
import styled from 'styled-components'

// New styled components for the confirmation modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContainer = styled.div`
  background-color: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#ffffff')};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 400px;
  padding: 2rem;
  text-align: center;
`

const ModalTitle = styled.h2`
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  margin-bottom: 1rem;
`

const ModalMessage = styled.p`
  color: ${(props) => (props.theme === 'dark' ? '#a0a0a0' : '#7f8c8d')};
  margin-bottom: 1.5rem;
`

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &.cancel {
    background-color: ${(props) => (props.theme === 'dark' ? '#444' : '#e0e0e0')};
    color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};

    &:hover {
      background-color: ${(props) => (props.theme === 'dark' ? '#555' : '#d0d0d0')};
    }
  }

  &.delete {
    background-color: #e74c3c;
    color: white;

    &:hover {
      background-color: #c0392b;
    }
  }
`

// Confirmation Modal Component
export const DeleteConfirmationModal = ({ theme, onConfirm, onCancel, customerName }) => {
  return (
    <ModalOverlay>
      <ModalContainer theme={theme}>
        <AlertTriangle
          size={64}
          color="#e74c3c"
          style={{ marginBottom: '1rem', display: 'block', margin: '0 auto' }}
        />
        <ModalTitle theme={theme}>Müşteriyi Sil</ModalTitle>
        <ModalMessage theme={theme}>
          {`${customerName} isimli müşteriyi silmek istediğinizden emin misiniz?`}
        </ModalMessage>
        <ModalButtonContainer>
          <ModalButton className="cancel" theme={theme} onClick={onCancel}>
            İptal
          </ModalButton>
          <ModalButton className="delete" onClick={onConfirm}>
            Sil
          </ModalButton>
        </ModalButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  )
}
