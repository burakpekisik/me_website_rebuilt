import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { contentApi } from './FetchContent'
import { Plus, Search, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import ContentCreate from './ContentCreate'
import ContentEdit from './ContentEdit'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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

const TableWrapper = styled.div`
  background-color: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#ffffff')};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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

const TableRow = styled.tr`
  background-color: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  border-bottom: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#e0e0e0')};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.theme === 'dark' ? '#3c3c3c' : '#f1f3f5')};
  }
`

const TableCell = styled.td`
  padding: 1rem;
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
  text-align: center;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    width: 25%; // Equally distribute 4 columns
  }
`

const PhotoPreview = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  max-width: 200px;
`

const ThumbImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`

const Content = ({ theme }) => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [contents, setContents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingContent, setEditingContent] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const data = await contentApi.getContents()
      setContents(data)
    } catch (error) {
      console.error('Error fetching contents:', error)
      alert('İçerikler yüklenirken hata oluştu')
    }
  }

  const filteredContents = useMemo(() => {
    return contents.filter(
      (content) =>
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stripHtml(content.text).toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [contents, searchTerm])

  const stripHtml = (html) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // Add requestSort function before return statement
  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  // Update sortedContents function
  const sortedContents = useMemo(() => {
    let sortedItems = [...filteredContents]
    sortedItems.sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Strip HTML if we're sorting text content
      if (sortConfig.key === 'text') {
        aValue = stripHtml(aValue)
        bValue = stripHtml(bValue)
      }

      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()

      if (sortConfig.direction === 'ascending') {
        return aValue.localeCompare(bValue)
      }
      return bValue.localeCompare(aValue)
    })
    return sortedItems
  }, [filteredContents, sortConfig])

  const handleCreate = async (data) => {
    try {
      // Create content first
      const newContent = await contentApi.createContent(data)
      fetchContents() // Refresh content list
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating content:', error)
      alert('İçerik eklenirken hata oluştu')
    }
  }

  const handleEdit = (content) => {
    setEditingContent(content)
  }

  const handleUpdate = async (id, data) => {
    try {
      await contentApi.updateContent(id, data)
      fetchContents() // Refresh content list
      setEditingContent(null)
    } catch (error) {
      console.error('Error updating content:', error)
      alert('İçerik güncellenirken hata oluştu')
    }
  }

  const handleDelete = (content) => {
    setDeleteConfirmation(content)
  }

  const confirmDelete = async () => {
    try {
      await contentApi.deleteContent(deleteConfirmation.id)
      fetchContents()
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('İçerik silinirken hata oluştu')
    }
  }

  return (
    <div>
      <Header>
        <Title theme={theme}>İçerikler</Title>
        <AddButton onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} />
          Yeni İçerik Ekle
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
              <TableHeader theme={theme}>Ana Fotoğraflar</TableHeader>
              <TableHeader theme={theme}>Diğer Fotoğraflar</TableHeader>
              <TableHeader
                theme={theme}
                onClick={() => requestSort('title')}
                style={{ cursor: 'pointer' }}
              >
                Başlık
                {sortConfig.key === 'title' &&
                  (sortConfig.direction === 'ascending' ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  ))}
              </TableHeader>
              <TableHeader theme={theme}>İçerik</TableHeader>
              <TableHeader theme={theme}>İşlemler</TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedContents.map((content) => (
              <TableRow key={content.id} theme={theme}>
                <TableCell>
                  <PhotoPreview>
                    {content.main_photo && (
                      <ThumbImage
                        key={'main-' + sortedContents.indexOf(content)}
                        src={BASE_URL + "/" + content.main_photo}
                        alt={`Main ${sortedContents.indexOf(content) + 1}`}
                      />
                    )}
                  </PhotoPreview>
                </TableCell>
                <TableCell>
                  <PhotoPreview>
                    {content.other_photos?.map((photo, index) => (
                      <ThumbImage
                        key={index}
                        src={BASE_URL + "/" + photo}
                        alt={`Other ${index + 1}`}
                      />
                    ))}
                  </PhotoPreview>
                </TableCell>
                <TableCell>{content.title}</TableCell>
                <TableCell>{stripHtml(content.text).substring(0, 100)}...</TableCell>
                <TableCell>
                  <ActionButton
                    color={theme === 'dark' ? '#3498db' : '#2980b9'}
                    onClick={() => handleEdit(content)}
                  >
                    <Edit size={18} />
                    Düzenle
                  </ActionButton>
                  <ActionButton
                    color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                    onClick={() => handleDelete(content)}
                  >
                    <Trash2 size={18} />
                    Sil
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      {isCreateModalOpen && (
        <ContentCreate
          theme={theme}
          onClose={() => setIsCreateModalOpen(false)}
          onAdd={handleCreate}
        />
      )}

      {editingContent && (
        <ContentEdit
          theme={theme}
          content={editingContent}
          onClose={() => setEditingContent(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteConfirmation && (
        <DeleteConfirmationModal>
          <ModalContent theme={theme}>
            <h3>İçerik Silme İşlemi</h3>
            <p>{`"${deleteConfirmation.title}" içeriğini silmek istediğinizden emin misiniz?`}</p>
            <ButtonGroup>
              <Button onClick={() => setDeleteConfirmation(null)}>İptal</Button>
              <Button primary onClick={confirmDelete}>
                Sil
              </Button>
            </ButtonGroup>
          </ModalContent>
        </DeleteConfirmationModal>
      )}
    </div>
  )
}

export default Content
