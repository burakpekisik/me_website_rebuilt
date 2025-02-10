import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { jailApi } from './FetchJails'
import { ChevronDown, ChevronUp, Eye, Edit, Trash2, Search } from 'lucide-react'
import JailCreate from './JailCreate'
import JailEdit from './JailEdit'

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

const JailSection = styled.div`
  padding: 1rem;
  background-color: ${(props) => (props.theme === 'dark' ? '#363636' : '#f8f9fa')};
`

const JailManagement = ({ theme }) => {
  const [cities, setCities] = useState([])
  const [jails, setJails] = useState({})
  const [expandedCities, setExpandedCities] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'city_name', direction: 'ascending' })
  const [searchTerm, setSearchTerm] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  useEffect(() => {
    fetchCities()
  }, [])

  const filteredCities = useMemo(() => {
    if (!searchTerm) return cities

    return cities.filter((city) => {
      const cityMatch = city.city_name.toLowerCase().includes(searchTerm.toLowerCase())

      // Also search in jails if city is expanded
      const jailsMatch = jails[city.city_id]?.some(
        (jail) =>
          jail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          jail.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      return cityMatch || jailsMatch
    })
  }, [cities, jails, searchTerm])

  const sortedAndFilteredCities = useMemo(() => {
    let result = [...filteredCities]

    result.sort((a, b) => {
      if (sortConfig.key === 'city_name') {
        const aValue = a.city_name.toLowerCase()
        const bValue = b.city_name.toLowerCase()

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      }
      return 0
    })

    return result
  }, [filteredCities, sortConfig])

  const fetchCities = async () => {
    try {
      const data = await jailApi.getCities()
      setCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
      alert('Failed to fetch cities')
    }
  }

  const getJailTypeText = (type) => {
    return type === 1 ? 'Kapalı' : 'Açık'
  }

  const fetchJails = async (cityId) => {
    try {
      const data = await jailApi.getJailsByCity(cityId)
      setJails((prev) => ({
        ...prev,
        [cityId]: data,
      }))
    } catch (error) {
      console.error('Error fetching jails:', error)
      alert('Failed to fetch jails')
    }
  }

  const handleExpandCity = async (cityId) => {
    if (expandedCities.includes(cityId)) {
      setExpandedCities(expandedCities.filter((id) => id !== cityId))
    } else {
      setExpandedCities([...expandedCities, cityId])
      if (!jails[cityId]) {
        await fetchJails(cityId)
      }
    }
  }

  const handleCreate = async (data) => {
    try {
      await jailApi.createJail(data)
      await fetchJails(data.city_id)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating jail:', error)
      alert('Failed to create jail')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
  }

  const handleSave = async (formData) => {
    try {
      await jailApi.updateJail(editingItem.id, formData)
      await fetchJails(formData.city_id)
      setEditingItem(null)
    } catch (error) {
      console.error('Error updating jail:', error)
      alert('Failed to update jail')
    }
  }

  const handleDelete = (item) => {
    setDeleteConfirmation(item)
  }

  const confirmDelete = async () => {
    try {
      await jailApi.deleteJail(deleteConfirmation.id)
      await fetchJails(deleteConfirmation.city_id)
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting jail:', error)
      alert('Failed to delete jail')
    }
  }

  return (
    <div>
      <Header>
        <Title>Cezaevleri</Title>
        <AddButton onClick={() => setIsCreateModalOpen(true)}>+ Cezaevi Ekle</AddButton>
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
                onClick={() => requestSort('city_name')}
                style={{ cursor: 'pointer' }}
              >
                İl
                {sortConfig.key === 'city_name' &&
                  (sortConfig.direction === 'ascending' ? (
                    <ChevronUp size={16} style={{ marginLeft: '4px' }} />
                  ) : (
                    <ChevronDown size={16} style={{ marginLeft: '4px' }} />
                  ))}
              </TableHeader>
              <TableHeader theme={theme}>İşlemler</TableHeader>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredCities.map((city) => (
              <React.Fragment key={city.city_id}>
                <TableRow theme={theme}>
                  <TableCell>{city.city_name}</TableCell>
                  <TableCell>
                    <ActionButton
                      color={theme === 'dark' ? '#3498db' : '#2980b9'}
                      onClick={() => handleExpandCity(city.city_id)}
                    >
                      <Eye size={18} style={{ marginRight: '0.5rem' }} />
                      {expandedCities.includes(city.city_id) ? 'Gizle' : 'Göster'}
                    </ActionButton>
                  </TableCell>
                </TableRow>
                {expandedCities.includes(city.city_id) && jails[city.city_id] && (
                  <tr>
                    <td colSpan="2">
                      <JailSection theme={theme}>
                        <Table>
                          <thead>
                            <tr>
                              <TableHeader theme={theme}>Cezaevi Adı</TableHeader>
                              <TableHeader theme={theme}>Adres</TableHeader>
                              <TableHeader theme={theme}>Tip</TableHeader>
                              <TableHeader theme={theme}>İşlemler</TableHeader>
                            </tr>
                          </thead>
                          <tbody>
                            {jails[city.city_id].map((jail) => (
                              <TableRow key={jail.id} theme={theme}>
                                <TableCell>{jail.name}</TableCell>
                                <TableCell>{jail.address}</TableCell>
                                <TableCell>{getJailTypeText(jail.type)}</TableCell>
                                <TableCell>
                                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <ActionButton
                                      color={theme === 'dark' ? '#3498db' : '#2980b9'}
                                      onClick={() => handleEdit(jail)}
                                    >
                                      <Edit size={18} style={{ marginRight: '0.5rem' }} />
                                      Düzenle
                                    </ActionButton>
                                    <ActionButton
                                      color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                                      onClick={() => handleDelete(jail)}
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
                      </JailSection>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
        {filteredCities.length === 0 && (
          <NoDataMessage theme={theme}>Sonuç bulunamadı</NoDataMessage>
        )}
      </TableWrapper>

      {isCreateModalOpen && (
        <JailCreate
          theme={theme}
          cities={cities}
          onClose={() => setIsCreateModalOpen(false)}
          onAdd={handleCreate}
        />
      )}

      {editingItem && (
        <JailEdit
          theme={theme}
          data={editingItem}
          cities={cities}
          onClose={() => setEditingItem(null)}
          onSave={handleSave}
        />
      )}

      {deleteConfirmation && (
        <DeleteConfirmationModal>
          <ModalContent theme={theme}>
            <h3>Cezaevi Silme İşlemi</h3>
            <p>{`"${deleteConfirmation.name}" cezaevini silmek istediğinizden emin misiniz?`}</p>
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

export default JailManagement
