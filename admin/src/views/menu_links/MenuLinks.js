import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { menuLinksApi } from './FetchMenuLinks'
import MenuLinkCreate from './MenuLinkCreate'
import MenuLinkEdit from './MenuLinkEdit'
import { Edit, Trash2, Plus, Search } from 'lucide-react'

const DeleteConfirmationModal = styled.div`
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

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
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

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => (props.theme === 'dark' ? '#666' : '#a0a0a0')};
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

const TableWrapper = styled.div`
  background-color: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#ffffff')};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  position: relative;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#e0e0e0')};
  background-color: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.theme === 'dark' ? '#4ecdc4' : '#3498db')};
  }
`

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => (props.theme === 'dark' ? '#666' : '#a0a0a0')};
`

const MenuLinks = ({ theme }) => {
  const [links, setLinks] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLinks()
  }, [])

  const filteredLinks = useMemo(() => {
    if (!searchTerm) return links

    return links.filter((link) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        link.menu_name.toLowerCase().includes(searchLower) ||
        link.menu_url.toLowerCase().includes(searchLower) ||
        link.menu_group.toLowerCase().includes(searchLower)
      )
    })
  }, [links, searchTerm])

  const fetchLinks = async () => {
    try {
      const data = await menuLinksApi.getMenuLinks()
      setLinks(data)
    } catch (error) {
      console.error('Error fetching menu links:', error)
      alert('Failed to fetch menu links')
    }
  }

  const handleCreate = async (data) => {
    try {
      await menuLinksApi.createMenuLink(data)
      fetchLinks()
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating menu link:', error)
      alert('Failed to create menu link')
    }
  }

  const handleEdit = (link) => {
    setEditingLink(link)
  }

  const handleUpdate = async (data) => {
    try {
      await menuLinksApi.updateMenuLink(editingLink.id, data)
      fetchLinks()
      setEditingLink(null)
    } catch (error) {
      console.error('Error updating menu link:', error)
      alert('Failed to update menu link')
    }
  }

  const handleDelete = (link) => {
    setDeleteConfirmation(link)
  }

  const confirmDelete = async () => {
    try {
      await menuLinksApi.deleteMenuLink(deleteConfirmation.id)
      fetchLinks()
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting menu link:', error)
      alert('Failed to delete menu link')
    }
  }

  return (
    <div>
      <Header>
        <Title>Menü Linkleri</Title>
        <AddButton onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} />
          Yeni Link Ekle
        </AddButton>
      </Header>

      <SearchContainer>
        <SearchInput
          type="text"
          theme={theme}
          placeholder="Ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon theme={theme} size={20} />
      </SearchContainer>

      <TableWrapper theme={theme}>
        <Table>
          <thead>
            <tr>
              <TableHeader theme={theme}>Menü Adı</TableHeader>
              <TableHeader theme={theme}>URL</TableHeader>
              <TableHeader theme={theme}>Hedef</TableHeader>
              <TableHeader theme={theme}>Grup</TableHeader>
              <TableHeader theme={theme}>Dropdown</TableHeader>
              <TableHeader theme={theme}>İşlemler</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.map((link) => (
              <tr key={link.id}>
                <TableCell theme={theme}>{link.menu_name}</TableCell>
                <TableCell theme={theme}>{link.menu_url}</TableCell>
                <TableCell theme={theme}>
                  {link.target_window === 'this_window' ? 'Bu Pencere' : 'Yeni Pencere'}
                </TableCell>
                <TableCell theme={theme}>{link.menu_group}</TableCell>
                <TableCell theme={theme}>{link.is_dropdown ? 'Evet' : 'Hayır'}</TableCell>
                <TableCell theme={theme}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <ActionButton
                      color={theme === 'dark' ? '#3498db' : '#2980b9'}
                      onClick={() => handleEdit(link)}
                    >
                      <Edit size={18} style={{ marginRight: '0.5rem' }} />
                      Düzenle
                    </ActionButton>
                    <ActionButton
                      color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                      onClick={() => handleDelete(link)}
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
        {filteredLinks.length === 0 && (
          <NoDataMessage theme={theme}>Sonuç bulunamadı</NoDataMessage>
        )}
      </TableWrapper>

      {isCreateModalOpen && (
        <MenuLinkCreate
          theme={theme}
          onClose={() => setIsCreateModalOpen(false)}
          onAdd={handleCreate}
        />
      )}

      {editingLink && (
        <MenuLinkEdit
          theme={theme}
          link={editingLink}
          onClose={() => setEditingLink(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteConfirmation && (
        <DeleteConfirmationModal>
          <ModalContent theme={theme}>
            <h3>Link Silme İşlemi</h3>
            <p>{`"${deleteConfirmation.menu_name}" menü linkini silmek istediğinizden emin misiniz?`}</p>
            <ModalButtonContainer>
              <ActionButton
                color={theme === 'dark' ? '#444' : '#e0e0e0'}
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
            </ModalButtonContainer>
          </ModalContent>
        </DeleteConfirmationModal>
      )}
    </div>
  )
}

export default MenuLinks
