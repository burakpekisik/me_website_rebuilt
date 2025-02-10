import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { commentApi } from './FetchComments'
import { Edit, Trash2, Plus, Search, Star, ChevronUp, ChevronDown } from 'lucide-react'
import CommentCreate from './CommentCreate'
import CommentEdit from './CommentEdit'

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

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => (props.theme === 'dark' ? '#666' : '#a0a0a0')};
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

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    width: 25%; // Equally distribute 4 columns
  }
`

const Comments = ({ theme }) => {
  const [comments, setComments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const data = await commentApi.getComments()
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
      alert('Yorumlar yüklenirken hata oluştu')
    }
  }

  const filteredComments = useMemo(() => {
    return comments.filter(
      (comment) =>
        comment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [comments, searchTerm])

  const sortedComments = useMemo(() => {
    const sorted = [...filteredComments]
    sorted.sort((a, b) => {
      let comparison = 0
      switch (sortConfig.key) {
        case 'created_at':
          comparison = new Date(b.created_at) - new Date(a.created_at)
          break
        case 'star':
          comparison = b.star - a.star
          break
        default:
          comparison = String(a[sortConfig.key]).localeCompare(String(b[sortConfig.key]))
      }
      return sortConfig.direction === 'ascending' ? comparison : -comparison
    })
    return sorted
  }, [filteredComments, sortConfig])

  const handleCreate = async (data) => {
    try {
      console.log(data)
      await commentApi.createComment(data)
      fetchComments()
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating comment:', error)
      alert('Yorum eklenirken hata oluştu')
    }
  }

  const handleEdit = (comment) => {
    setEditingComment(comment)
  }

  const handleUpdate = async (data) => {
    try {
      await commentApi.updateComment(editingComment.id, data)
      fetchComments()
      setEditingComment(null)
    } catch (error) {
      console.error('Error updating comment:', error)
      alert('Yorum güncellenirken hata oluştu')
    }
  }

  const handleDelete = (comment) => {
    setDeleteConfirmation(comment)
  }

  const confirmDelete = async () => {
    try {
      await commentApi.deleteComment(deleteConfirmation.id)
      fetchComments()
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Yorum silinirken hata oluştu')
    }
  }

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  return (
    <div>
      <Header>
        <Title>Yorumlar</Title>
        <AddButton onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} />
          Yeni Yorum Ekle
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
              <TableHeader theme={theme} onClick={() => requestSort('customer_name')}>
                <span>Müşteri Adı</span>
                {sortConfig.key === 'customer_name' &&
                  (sortConfig.direction === 'ascending' ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  ))}
              </TableHeader>
              <TableHeader theme={theme} onClick={() => requestSort('title')}>
                <span>Başlık</span>
                {sortConfig.key === 'title' &&
                  (sortConfig.direction === 'ascending' ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  ))}
              </TableHeader>
              <TableHeader theme={theme} onClick={() => requestSort('star')}>
                <span>Yıldız</span>
                {sortConfig.key === 'star' &&
                  (sortConfig.direction === 'ascending' ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  ))}
              </TableHeader>
              <TableHeader theme={theme} onClick={() => requestSort('created_at')}>
                <span>Tarih</span>
                {sortConfig.key === 'created_at' &&
                  (sortConfig.direction === 'ascending' ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  ))}
              </TableHeader>
              <TableHeader theme={theme}>İşlemler</TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedComments.map((comment) => (
              <TableRow key={comment.id} theme={theme}>
                <TableCell>{comment.customer_name}</TableCell>
                <TableCell>{comment.title}</TableCell>
                <TableCell>
                  {[...Array(comment.star)].map((_, index) => (
                    <Star key={index} size={16} fill="#FFD700" color="#FFD700" />
                  ))}
                </TableCell>
                <TableCell>{new Date(comment.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <ActionButton
                      color={theme === 'dark' ? '#3498db' : '#2980b9'}
                      onClick={() => handleEdit(comment)}
                    >
                      <Edit size={18} style={{ marginRight: '0.5rem' }} />
                      Düzenle
                    </ActionButton>
                    <ActionButton
                      color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                      onClick={() => handleDelete(comment)}
                    >
                      <Trash2 size={18} style={{ marginRight: '0.5rem' }} />
                      Sil
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        {sortedComments.length === 0 && (
          <NoDataMessage theme={theme}>Yorum bulunamadı</NoDataMessage>
        )}
      </TableWrapper>

      {isCreateModalOpen && (
        <CommentCreate
          theme={theme}
          onClose={() => setIsCreateModalOpen(false)}
          onAdd={handleCreate}
        />
      )}

      {editingComment && (
        <CommentEdit
          theme={theme}
          comment={editingComment}
          onClose={() => setEditingComment(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteConfirmation && (
        <DeleteConfirmationModal>
          <ModalContent theme={theme}>
            <h3>Yorum Silme İşlemi</h3>
            <p>{`"${deleteConfirmation.customer_name}" isimli kullanıcının yorumunu silmek istediğinizden emin misiniz?`}</p>
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

export default Comments
