import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { priceApi } from './FetchPrices'
import { Plus, Search, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import PriceCreate from './PricesCreate'
import PriceEdit from './PricesEdit'

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

const AdditionalSettings = ({ theme }) => {
  const [prices, setPrices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'price_name', direction: 'ascending' })
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingPrice, setEditingPrice] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      const data = await priceApi.getPrices()
      setPrices(data)
    } catch (error) {
      console.error('Error fetching prices:', error)
      alert('Fiyatlar yüklenirken hata oluştu')
    }
  }

  const filteredPrices = useMemo(() => {
    return prices.filter(
      (price) =>
        price.price_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        price.price_description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [prices, searchTerm])

  const sortedPrices = useMemo(() => {
    let sortedItems = [...filteredPrices]
    sortedItems.sort((a, b) => {
      if (sortConfig.key === 'price_value') {
        return sortConfig.direction === 'ascending'
          ? a.price_value - b.price_value
          : b.price_value - a.price_value
      }

      const aValue = a[sortConfig.key].toLowerCase()
      const bValue = b[sortConfig.key].toLowerCase()

      if (sortConfig.direction === 'ascending') {
        return aValue.localeCompare(bValue)
      }
      return bValue.localeCompare(aValue)
    })
    return sortedItems
  }, [filteredPrices, sortConfig])

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handleCreate = async (data) => {
    try {
      await priceApi.createPrice(data)
      fetchPrices()
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating price:', error)
      alert('Fiyat eklenirken hata oluştu')
    }
  }

  const handleEdit = (price) => {
    setEditingPrice(price)
  }

  const handleUpdate = async (data) => {
    try {
      await priceApi.updatePrice(editingPrice.id, data)
      fetchPrices()
      setEditingPrice(null)
    } catch (error) {
      console.error('Error updating price:', error)
      alert('Fiyat güncellenirken hata oluştu')
    }
  }

  const handleDelete = (price) => {
    setDeleteConfirmation(price)
  }

  const confirmDelete = async () => {
    try {
      await priceApi.deletePrice(deleteConfirmation.id)
      fetchPrices()
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting price:', error)
      alert('Fiyat silinirken hata oluştu')
    }
  }

  const formatPrice = (price) => {
    return typeof price === 'number'
      ? price.toLocaleString('tr-TR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : '0.00'
  }

  return (
    <div>
      <Header>
        <Title theme={theme}>Fiyatlar</Title>
        <AddButton onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} />
          Yeni Fiyat Ekle
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
              <TableHeader
                theme={theme}
                onClick={() => requestSort('price_name')}
                style={{ cursor: 'pointer' }}
              >
                Fiyat Adı
                {sortConfig.key === 'price_name' &&
                  (sortConfig.direction === 'ascending' ? (
                    <ChevronUp size={16} style={{ marginLeft: '4px' }} />
                  ) : (
                    <ChevronDown size={16} style={{ marginLeft: '4px' }} />
                  ))}
              </TableHeader>
              <TableHeader
                theme={theme}
                onClick={() => requestSort('price_value')}
                style={{ cursor: 'pointer' }}
              >
                Değer
                {sortConfig.key === 'price_value' &&
                  (sortConfig.direction === 'ascending' ? (
                    <ChevronUp size={16} style={{ marginLeft: '4px' }} />
                  ) : (
                    <ChevronDown size={16} style={{ marginLeft: '4px' }} />
                  ))}
              </TableHeader>
              <TableHeader theme={theme}>Açıklama</TableHeader>
              <TableHeader theme={theme}>İşlemler</TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedPrices.map((price) => (
              <TableRow key={price.id} theme={theme}>
                <TableCell>{price.price_name}</TableCell>
                <TableCell>{price.price_value} TL</TableCell>
                <TableCell>{price.price_description}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <ActionButton
                      color={theme === 'dark' ? '#3498db' : '#2980b9'}
                      onClick={() => handleEdit(price)}
                    >
                      <Edit size={18} style={{ marginRight: '0.5rem' }} />
                      Düzenle
                    </ActionButton>
                    <ActionButton
                      color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                      onClick={() => handleDelete(price)}
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
        {sortedPrices.length === 0 && <NoDataMessage theme={theme}>Fiyat bulunamadı</NoDataMessage>}
      </TableWrapper>

      {isCreateModalOpen && (
        <PriceCreate
          theme={theme}
          onClose={() => setIsCreateModalOpen(false)}
          onAdd={handleCreate}
        />
      )}

      {editingPrice && (
        <PriceEdit
          theme={theme}
          price={editingPrice}
          onClose={() => setEditingPrice(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteConfirmation && (
        <DeleteConfirmationModal>
          <ModalContent theme={theme}>
            <h3>Fiyat Silme İşlemi</h3>
            <p>{`"${deleteConfirmation.price_name}" fiyatını silmek istediğinizden emin misiniz?`}</p>
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

export default AdditionalSettings
