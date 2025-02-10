import axios from 'axios'
import { ChevronDown, ChevronUp, Search, Trash2 } from 'lucide-react'
import React, { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { paperColorsApi } from './FetchPaperColors'
import { HexColorPicker } from 'react-colorful'
import PaperColorCreate from './PaperColorCreate'

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

const EditableCell = styled.td`
  padding: 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.theme === 'dark' ? '#3c3c3c' : '#f8f9fa')};
  }
`

const ColorPickerPopover = styled.div`
  position: absolute;
  z-index: 100;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 8px;
`

const EditInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  background: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : 'white')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  border-radius: 4px;
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

const PaperColorManagement = ({ theme }) => {
  const [colors, setColors] = useState([])
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'descending',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [editingCell, setEditingCell] = useState(null)
  const [colorPickerVisible, setColorPickerVisible] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const handleAddColor = async (colorData) => {
    try {
      await paperColorsApi.createPaperColor(colorData)
      fetchColors()
      setIsAddModalOpen(false)
    } catch (error) {
      console.error('Error adding color:', error)
      alert('Failed to add color')
    }
  }

  const handleCellEdit = async (colorId, field, value) => {
    try {
      const colorToUpdate = colors.find((c) => c.id === colorId)
      const updatedData = {
        color_name: colorToUpdate.color_name,
        color_code: colorToUpdate.color_code,
        color_price: colorToUpdate.color_price,
        [field]: value,
      }

      await paperColorsApi.updatePaperColor(colorId, updatedData)
      setColors(
        colors.map((color) => (color.id === colorId ? { ...color, [field]: value } : color)),
      )
    } catch (error) {
      console.error('Error updating color:', error)
      alert('Failed to update color')
    }
  }

  const EditableContent = ({ color, field }) => {
    const isEditing = editingCell?.id === color.id && editingCell?.field === field
    const value = color[field]

    if (isEditing) {
      return (
        <EditInput
          theme={theme}
          type={field === 'color_price' ? 'number' : 'text'}
          value={value}
          autoFocus
          onBlur={() => setEditingCell(null)}
          onChange={(e) => handleCellEdit(color.id, field, e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              setEditingCell(null)
            }
          }}
        />
      )
    }

    return (
      <span onClick={() => setEditingCell({ id: color.id, field })}>
        {field === 'color_price' ? `${value} TL` : value}
      </span>
    )
  }

  // Fetch colors on component mount
  useEffect(() => {
    fetchColors()
  }, [])

  const fetchColors = async () => {
    try {
      const data = await paperColorsApi.getPaperColors()
      setColors(data)
    } catch (error) {
      console.error('Error fetching colors:', error)
      alert('Failed to fetch colors')
    }
  }

  const handleDeleteColor = async (color) => {
    setDeleteConfirmation(color)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmation) return

    try {
      await paperColorsApi.deletePaperColor(deleteConfirmation.id)
      setColors(colors.filter((color) => color.id !== deleteConfirmation.id))
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting color:', error)
      alert('Failed to delete color')
    }
  }

  const sortedColors = useMemo(() => {
    let result = [...colors]

    if (searchTerm) {
      result = result.filter((color) =>
        Object.values(color).some((val) =>
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
  }, [colors, sortConfig, searchTerm])

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
        <PageTitle>Kağıt Renkleri</PageTitle>
        <AddButton onClick={() => setIsAddModalOpen(true)}>+ Renk Ekle</AddButton>
      </Header>

      {isAddModalOpen && (
        <PaperColorCreate
          theme={theme}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddColor}
        />
      )}

      {deleteConfirmation && (
        <DeleteConfirmationModal>
          <ModalContent theme={theme}>
            <h3>Renk Silme İşlemi</h3>
            <p>{`"${deleteConfirmation.color_name}" rengini silmek istediğinizden emin misiniz?`}</p>
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

      <SearchContainer>
        <SearchInput
          type="text"
          theme={theme}
          placeholder="Renk ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon theme={theme} size={20} />
      </SearchContainer>

      <TableWrapper theme={theme}>
        <Table>
          <thead>
            <tr>
              {['id', 'color_name', 'color_code', 'color_price'].map((header) => (
                <TableHeader key={header} theme={theme} onClick={() => requestSort(header)}>
                  {header === 'id'
                    ? 'ID'
                    : header === 'color_name'
                      ? 'Renk Adı'
                      : header === 'color_code'
                        ? 'Renk Kodu'
                        : 'Fiyat'}
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
            {sortedColors.map((color) => (
              <TableRow key={color.id} theme={theme}>
                <TableCell>{color.id}</TableCell>
                <EditableCell theme={theme}>
                  <EditableContent color={color} field="color_name" />
                </EditableCell>
                <EditableCell theme={theme}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: color.color_code,
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                      }}
                      onClick={() => setColorPickerVisible(color.id)}
                    />
                    {colorPickerVisible === color.id && (
                      <ColorPickerPopover>
                        <HexColorPicker
                          color={color.color_code}
                          onChange={(newColor) => handleCellEdit(color.id, 'color_code', newColor)}
                        />
                      </ColorPickerPopover>
                    )}
                    {color.color_code}
                  </div>
                </EditableCell>
                <EditableCell theme={theme}>
                  <EditableContent color={color} field="color_price" />
                </EditableCell>
                <TableCell>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ActionButton
                      color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                      onClick={() => handleDeleteColor(color)}
                    >
                      <Trash2 size={18} style={{ marginRight: '0.5rem' }} /> Sil
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        {sortedColors.length === 0 && (
          <NoDataMessage theme={theme}>Gösterilecek renk bulunamadı.</NoDataMessage>
        )}
      </TableWrapper>
    </div>
  )
}

export default PaperColorManagement
