import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { districtCityApi } from './FetchDistrictCity'
import { ChevronDown, ChevronUp, Eye, Search, Edit, Trash2 } from 'lucide-react'
import DistrictCityEdit from './DistrictCityEdit'
import DistrictCityCreate from './DistrictCityCreate'

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

const ExpandableRow = styled(TableRow)`
  cursor: pointer;
`

const DistrictRow = styled(TableRow)`
  background-color: ${(props) => (props.theme === 'dark' ? '#363636' : '#f8f9fa')};
`

const DistrictSection = styled.div`
  padding: 1rem;
  background-color: ${(props) => (props.theme === 'dark' ? '#363636' : '#f8f9fa')};
`

const DistrictCityManagement = ({ theme }) => {
  const [cities, setCities] = useState([])
  const [districts, setDistricts] = useState({})
  const [expandedCities, setExpandedCities] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'city_id', direction: 'ascending' })
  const [searchTerm, setSearchTerm] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Add handler for create
  const handleCreate = async (data) => {
    try {
      if (data.type === 'city') {
        await districtCityApi.createCity(data.data)
      } else {
        await districtCityApi.createTown(data.data)
      }
      fetchCities()
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating:', error)
      alert('Failed to create')
    }
  }

  const handleDelete = (item) => {
    setDeleteConfirmation(item)
  }

  const confirmDelete = async () => {
    try {
      if (deleteConfirmation.town_id) {
        await districtCityApi.deleteTown(deleteConfirmation.town_id)
        await fetchDistricts(deleteConfirmation.city_id)
      } else {
        await districtCityApi.deleteCity(deleteConfirmation.city_id)
        await fetchCities()
      }
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Failed to delete')
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
  }

  const handleSave = async (formData) => {
    try {
      if (formData.town_id) {
        await districtCityApi.updateTown(formData.town_id, formData)
      } else {
        await districtCityApi.updateCity(formData.city_id, formData)
      }
      fetchCities()
      setEditingItem(null)
    } catch (error) {
      console.error('Error updating:', error)
      alert('Failed to update')
    }
  }

  // Add EditModal component:
  {
    editingItem && (
      <DistrictCityEdit
        theme={theme}
        data={editingItem}
        cities={cities}
        onClose={() => setEditingItem(null)}
        onSave={handleSave}
      />
    )
  }

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const data = await districtCityApi.getCities()
      setCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
      alert('Failed to fetch cities')
    }
  }

  const fetchDistricts = async (cityId) => {
    try {
      const data = await districtCityApi.getTowns(cityId)
      setDistricts((prev) => ({
        ...prev,
        [cityId]: data,
      }))
    } catch (error) {
      console.error('Error fetching districts:', error)
      alert('Failed to fetch districts')
    }
  }

  const handleExpandCity = async (cityId) => {
    if (expandedCities.includes(cityId)) {
      setExpandedCities(expandedCities.filter((id) => id !== cityId))
    } else {
      setExpandedCities([...expandedCities, cityId])
      if (!districts[cityId]) {
        await fetchDistricts(cityId)
      }
    }
  }

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedCities = useMemo(() => {
    let result = [...cities]

    if (searchTerm) {
      result = result.filter((city) =>
        Object.values(city).some((val) =>
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
  }, [cities, sortConfig, searchTerm])

  return (
    <div>
      <Header>
        <Title>İl ve İlçeler</Title>
        <AddButton onClick={() => setIsCreateModalOpen(true)}>+ İl/İlçe Ekle</AddButton>
      </Header>

      {isCreateModalOpen && (
        <DistrictCityCreate
          theme={theme}
          cities={cities}
          onClose={() => setIsCreateModalOpen(false)}
          onAdd={handleCreate}
        />
      )}

      {editingItem && (
        <DistrictCityEdit
          theme={theme}
          data={editingItem}
          cities={cities}
          onClose={() => setEditingItem(null)}
          onSave={(formData) => handleSave(formData)}
        />
      )}
      {deleteConfirmation && (
        <DeleteConfirmationModal>
          <ModalContent theme={theme}>
            <h3>{deleteConfirmation.town_id ? 'İlçe Silme İşlemi' : 'İl Silme İşlemi'}</h3>
            <p>
              {deleteConfirmation.town_id
                ? `"${deleteConfirmation.town_name}" ilçesini silmek istediğinizden emin misiniz?`
                : `"${deleteConfirmation.city_name}" ilini silmek istediğinizden emin misiniz?`}
            </p>
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
          placeholder="İl ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon theme={theme} size={20} />
      </SearchContainer>
      <TableWrapper theme={theme}>
        <Table>
          <thead>
            <tr>
              {['city_id', 'city_name', 'plate_no', 'phone_code'].map((header) => (
                <TableHeader key={header} theme={theme} onClick={() => requestSort(header)}>
                  {header === 'city_id'
                    ? 'ID'
                    : header === 'city_name'
                      ? 'İl Adı'
                      : header === 'plate_no'
                        ? 'Plaka Kodu'
                        : 'Telefon Kodu'}
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
            {sortedCities.map((city) => (
              <React.Fragment key={city.city_id}>
                <ExpandableRow theme={theme}>
                  <TableCell>{city.city_id}</TableCell>
                  <TableCell>{city.city_name}</TableCell>
                  <TableCell>{city.plate_no}</TableCell>
                  <TableCell>{city.phone_code}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <ActionButton
                        color={theme === 'dark' ? '#3498db' : '#2980b9'}
                        onClick={() => handleEdit(city)}
                      >
                        <Edit size={18} style={{ marginRight: '0.5rem' }} />
                        Düzenle
                      </ActionButton>
                      <ActionButton
                        color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                        onClick={() => handleDelete(city)}
                      >
                        <Trash2 size={18} style={{ marginRight: '0.5rem' }} />
                        Sil
                      </ActionButton>
                      <ActionButton
                        color={theme === 'dark' ? '#3498db' : '#2980b9'}
                        onClick={() => handleExpandCity(city.city_id)}
                      >
                        <Eye size={18} style={{ marginRight: '0.5rem' }} />
                        {expandedCities.includes(city.city_id) ? 'Gizle' : 'Göster'}
                      </ActionButton>
                    </div>
                  </TableCell>
                </ExpandableRow>
                {expandedCities.includes(city.city_id) && districts[city.city_id] && (
                  <tr>
                    <td colSpan="5">
                      <DistrictSection theme={theme}>
                        <Table>
                          <thead>
                            <tr>
                              <TableHeader theme={theme}>İlçe ID</TableHeader>
                              <TableHeader theme={theme}>İlçe Adı</TableHeader>
                            </tr>
                          </thead>
                          <tbody>
                            {districts[city.city_id].map((district) => (
                              <DistrictRow key={district.town_id} theme={theme}>
                                <TableCell>{district.town_id}</TableCell>
                                <TableCell>{district.town_name}</TableCell>
                                <TableCell>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                      gap: '0.5rem',
                                    }}
                                  >
                                    <ActionButton
                                      color={theme === 'dark' ? '#3498db' : '#2980b9'}
                                      onClick={() => handleEdit(district)}
                                    >
                                      <Edit size={18} style={{ marginRight: '0.5rem' }} />
                                      Düzenle
                                    </ActionButton>
                                    <ActionButton
                                      color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                                      onClick={() => handleDelete(district)}
                                    >
                                      <Trash2 size={18} style={{ marginRight: '0.5rem' }} />
                                      Sil
                                    </ActionButton>
                                  </div>
                                </TableCell>
                              </DistrictRow>
                            ))}
                          </tbody>
                        </Table>
                      </DistrictSection>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
        {sortedCities.length === 0 && (
          <NoDataMessage theme={theme}>Gösterilecek il bulunamadı.</NoDataMessage>
        )}
      </TableWrapper>
    </div>
  )
}

export default DistrictCityManagement
