import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { faqApi } from './FetchFAQ'
import { Edit, Trash2, Plus } from 'lucide-react'
import FAQCreate from './FAQCreate'
import FAQEdit from './FAQEdit'

const Container = styled.div`
  padding: 2rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

const Title = styled.h1`
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  margin: 0;
`

const AddButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #2980b9;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.th`
  background-color: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#f4f6f9')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#e9ecef')};
  }
`

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#dee2e6')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: ${(props) => props.color};
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`

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
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`

const TableWrapper = styled.div`
  background-color: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#ffffff')};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`

const FAQ = ({ theme }) => {
  const [faqs, setFaqs] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  useEffect(() => {
    fetchFaqs()
  }, [])

  const fetchFaqs = async () => {
    try {
      const data = await faqApi.getFaqs()
      setFaqs(data)
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      alert('FAQs yüklenirken bir hata oluştu')
    }
  }

  const handleCreate = async (data) => {
    try {
      await faqApi.createFaq(data)
      fetchFaqs()
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating FAQ:', error)
      alert('FAQ eklenirken bir hata oluştu')
    }
  }

  const handleEdit = (faq) => {
    setEditingFaq(faq)
  }

  const handleUpdate = async (data) => {
    try {
      await faqApi.updateFaq(editingFaq.id, data)
      fetchFaqs()
      setEditingFaq(null)
    } catch (error) {
      console.error('Error updating FAQ:', error)
      alert('FAQ güncellenirken bir hata oluştu')
    }
  }

  const handleDelete = (faq) => {
    setDeleteConfirmation(faq)
  }

  const confirmDelete = async () => {
    try {
      await faqApi.deleteFaq(deleteConfirmation.id)
      fetchFaqs()
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      alert('FAQ silinirken bir hata oluştu')
    }
  }

  return (
    <Container>
      <Header>
        <Title>Sıkça Sorulan Sorular</Title>
        <AddButton onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} />
          Yeni Soru Ekle
        </AddButton>
      </Header>

      <TableWrapper theme={theme}>
        <Table>
          <thead>
            <tr>
              <TableHeader theme={theme}>Başlık</TableHeader>
              <TableHeader theme={theme}>İçerik</TableHeader>
              <TableHeader theme={theme}>İşlemler</TableHeader>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <TableCell theme={theme}>{faq.title}</TableCell>
                <TableCell theme={theme}>{faq.text}</TableCell>
                <TableCell theme={theme}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <ActionButton
                      color={theme === 'dark' ? '#3498db' : '#2980b9'}
                      onClick={() => handleEdit(faq)}
                    >
                      <Edit size={18} style={{ marginRight: '0.5rem' }} />
                      Düzenle
                    </ActionButton>
                    <ActionButton
                      color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                      onClick={() => handleDelete(faq)}
                    >
                      <Trash2 size={18} style={{ marginRight: '0.5rem' }} />
                      Sil
                    </ActionButton>
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      {isCreateModalOpen && (
        <FAQCreate theme={theme} onClose={() => setIsCreateModalOpen(false)} onAdd={handleCreate} />
      )}

      {editingFaq && (
        <FAQEdit
          theme={theme}
          faq={editingFaq}
          onClose={() => setEditingFaq(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteConfirmation && (
        <Modal>
          <ModalContent theme={theme}>
            <h3>SSS Silme İşlemi</h3>
            <p>{`"${deleteConfirmation.title}" sorusunu silmek istediğinizden emin misiniz?`}</p>
            <ButtonGroup>
              <ActionButton
                color={theme === 'dark' ? '#666' : '#999'}
                onClick={() => setDeleteConfirmation(null)}
              >
                İptal
              </ActionButton>
              <ActionButton
                color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                onClick={confirmDelete}
              >
                Sil
              </ActionButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  )
}

export default FAQ
