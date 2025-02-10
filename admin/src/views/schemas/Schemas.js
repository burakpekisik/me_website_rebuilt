import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { schemasApi } from './FetchSchemas'
import SchemaCreate from './SchemaCreate'
import SchemaEdit from './SchemaEdit'
import { ChevronDown, ChevronUp, Edit, Trash2, Search } from 'lucide-react'

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

// Update table styles
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    width: 25%; // Equally distribute 4 columns
  }
`

const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  color: ${(props) => props.theme.text};
`

const Schemas = ({ theme }) => {
  const [schemas, setSchemas] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'descending' })
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSchema, setEditingSchema] = useState(null)

  useEffect(() => {
    fetchSchemas()
  }, [])

  const fetchSchemas = async () => {
    try {
      const data = await schemasApi.getSchemas()
      setSchemas(data)
    } catch (error) {
      console.error('Error fetching schemas:', error)
      alert('Failed to fetch schemas')
    }
  }

  const handleAddSchema = async (schemaData) => {
    try {
      await schemasApi.createSchema(schemaData)
      fetchSchemas()
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Error adding schema:', error)
      alert('Failed to add schema')
    }
  }

  const handleUpdateSchema = async (schemaId, schemaData) => {
    try {
      await schemasApi.updateSchema(schemaId, schemaData)
      fetchSchemas()
      setEditingSchema(null)
    } catch (error) {
      console.error('Error updating schema:', error)
      alert('Failed to update schema')
    }
  }

  const stripHtml = (html) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const truncateText = (text, maxLength = 50) => {
    const plainText = stripHtml(text)
    return plainText.length > maxLength ? `${plainText.substring(0, maxLength)}...` : plainText
  }

  const handleDeleteSchema = (schema) => {
    setDeleteConfirmation(schema)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmation) return

    try {
      await schemasApi.deleteSchema(deleteConfirmation.id)
      setSchemas(schemas.filter((schema) => schema.id !== deleteConfirmation.id))
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting schema:', error)
      alert('Failed to delete schema')
    }
  }

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedSchemas = useMemo(() => {
    let result = [...schemas]

    if (searchTerm) {
      result = result.filter((schema) =>
        Object.values(schema).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }

    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })

    return result
  }, [schemas, sortConfig, searchTerm])

  return (
    <div>
      <Header>
        <Title>Hazır Mektup Şablonları</Title>
        <AddButton onClick={() => setIsAddModalOpen(true)}>+ Şablon Ekle</AddButton>
      </Header>

      <SearchContainer>
        <SearchInput
          type="text"
          theme={theme}
          placeholder="Şema ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon theme={theme} size={20} />
      </SearchContainer>

      <TableWrapper theme={theme}>
        <Table>
          <thead>
            <tr>
              {['id', 'title', 'text', 'created_at', 'updated_at'].map((header) => (
                <TableHeader key={header} theme={theme} onClick={() => requestSort(header)}>
                  {header === 'id'
                    ? 'ID'
                    : header === 'title'
                      ? 'Başlık'
                      : header === 'text'
                        ? 'Metin'
                        : header === 'created_at'
                          ? 'Oluşturulma Tarihi'
                          : 'Güncellenme Tarihi'}
                  {sortConfig.key === header &&
                    (sortConfig.direction === 'ascending' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </TableHeader>
              ))}
              <TableHeader theme={theme}>İşlemler</TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedSchemas.map((schema) => (
              <TableRow key={schema.id} theme={theme}>
                <TableCell>{schema.id}</TableCell>
                <TableCell>{schema.title}</TableCell>
                <TableCell>{truncateText(schema.text)}</TableCell>
                <TableCell>{new Date(schema.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(schema.updated_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <ActionButton
                      color={theme === 'dark' ? '#3498db' : '#2980b9'}
                      onClick={() => setEditingSchema(schema)}
                    >
                      <Edit size={18} style={{ marginRight: '0.5rem' }} /> Düzenle
                    </ActionButton>
                    <ActionButton
                      color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                      onClick={() => handleDeleteSchema(schema)}
                    >
                      <Trash2 size={18} style={{ marginRight: '0.5rem' }} /> Sil
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        {sortedSchemas.length === 0 && (
          <NoDataMessage theme={theme}>Gösterilecek şema bulunamadı.</NoDataMessage>
        )}
      </TableWrapper>

      {isAddModalOpen && (
        <SchemaCreate
          theme={theme}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddSchema}
        />
      )}

      {editingSchema && (
        <SchemaEdit
          theme={theme}
          schema={editingSchema}
          onClose={() => setEditingSchema(null)}
          onSave={handleUpdateSchema}
        />
      )}

      {deleteConfirmation && (
        <DeleteConfirmationModal>
          <ModalContent theme={theme}>
            <h3>Şema Silme İşlemi</h3>
            <p>{`"${deleteConfirmation.title}" şemasını silmek istediğinizden emin misiniz?`}</p>
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

export default Schemas
