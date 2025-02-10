import axios from 'axios'
import { ChevronDown, ChevronUp, Edit, Search, Trash2 } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { DeleteConfirmationModal } from './DeleteConfirmation'

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

const CustomSelect = styled.div`
  position: relative;
  width: 100%;
`

const SelectTrigger = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#e0e0e0')};
  background-color: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => (props.theme === 'dark' ? '#4ecdc4' : '#3498db')};
  }
`

const SelectIcon = styled(ChevronDown)`
  transform: ${(props) => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.3s ease;
`

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  max-height: ${(props) => (props.$isOpen ? '300px' : '0')};
  overflow: hidden;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#ffffff')};
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#e0e0e0')};
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
`

const DropdownItem = styled.li`
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: ${(props) => (props.theme === 'dark' ? '#2c2c2c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.theme === 'dark' ? '#3c3c3c' : '#f1f3f5')};
  }

  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${(props) => (props.theme === 'dark' ? '#666' : '#a0a0a0')};
`

const statusColors = {
  Aktif: { dark: '#3498db', light: '#3498db' },
  Pasif: { dark: '#f39c12', light: '#f39c12' },
}

const CustomStatusDropdown = ({ value, onChange, theme, options }) => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [isOpen, setIsOpen] = useState(false)

  return (
    <CustomSelect theme={theme}>
      <SelectTrigger theme={theme} onClick={() => setIsOpen(!isOpen)}>
        <span
          style={{
            color: statusColors[value]?.[theme] || (theme === 'dark' ? '#e0e0e0' : '#2c3e50'),
          }}
        >
          {value}
        </span>
        <SelectIcon $isOpen={isOpen} size={18} />
      </SelectTrigger>
      <DropdownList theme={theme} $isOpen={isOpen}>
        {options.map((status) => (
          <DropdownItem
            key={status}
            theme={theme}
            onClick={() => {
              onChange(status)
              setIsOpen(false)
            }}
          >
            <span
              style={{
                color: statusColors[status]?.[theme] || (theme === 'dark' ? '#e0e0e0' : '#2c3e50'),
              }}
            >
              {status}
            </span>
          </DropdownItem>
        ))}
      </DropdownList>
    </CustomSelect>
  )
}

const statusOptions = ['Aktif', 'Pasif']

const mapStatusToText = (status) => (status === 1 ? 'Aktif' : 'Pasif')
const mapTextToStatus = (text) => (text === 'Aktif' ? 1 : 0)

export const CustomerTable = ({ customers, theme, originalOrders }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'descending',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusMap, setStatusMap] = useState({})
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  const handleDeleteCustomer = async (customer) => {
    // Open the confirmation modal
    setDeleteConfirmation(customer)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmation) return

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authorization token not found')
      }

      // HTTP DELETE request
      const response = await axios.delete(`${BASE_URL}/admin/users/${deleteConfirmation.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Customer deleted successfully:', response.data)

      // Close the confirmation modal
      setDeleteConfirmation(null)
    } catch (error) {
      // More comprehensive error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage =
          error.response.data?.detail ||
          error.response.data?.message ||
          error.response.statusText ||
          'Failed to delete customer'

        console.error('Server responded with error:', errorMessage)

        // If the status is 200 or close to 200, treat it as a success
        if (error.response.status >= 200 && error.response.status < 300) {
          if (onCustomerDelete) {
            onCustomerDelete(deleteConfirmation.id)
          }
          setDeleteConfirmation(null)
          return
        }

        alert(`Error: ${errorMessage}`)
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request)
        alert('No response from server. Please check your network connection.')
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message)
        alert(`Error: ${error.message}`)
      }

      // Close the confirmation modal
      setDeleteConfirmation(null)
    }
  }

  const sortedCustomers = useMemo(() => {
    let result = [...customers]

    if (searchTerm) {
      result = result.filter((customer) =>
        Object.values(customer).some((val) =>
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
  }, [customers, sortConfig, searchTerm])

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handleStatusChange = async (customerId, newStatusText) => {
    const newStatus = mapTextToStatus(newStatusText) // Convert text to numeric value

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authorization token not found')
      }

      // HTTP PUT request
      const response = await axios.put(
        `${BASE_URL}/admin/users/${customerId}`,
        { is_verified: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      // Update the status in the statusMap and trigger re-render
      setStatusMap((prev) => ({
        ...prev,
        [customerId]: newStatusText, // Update the specific customer status
      }))

      console.log('Customer status updated successfully:', response.data)
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.statusText ||
        'Failed to update customer status'

      console.error('Error updating customer status:', errorMessage)
      alert(`Error: ${errorMessage}`)
    }
  }

  return (
    <div>
      {deleteConfirmation && (
        <DeleteConfirmationModal
          theme={theme}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirmation(null)}
          customerName={`${deleteConfirmation.name} ${deleteConfirmation.surname}`}
        />
      )}

      <SearchContainer>
        <SearchInput
          type="text"
          theme={theme}
          placeholder="Üye ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon theme={theme} size={20} />
      </SearchContainer>

      <TableWrapper theme={theme}>
        <Table>
          <thead>
            <tr>
              {[
                'id',
                'customer_name',
                'email',
                'phone_number',
                'is_verified',
                'privilege',
                'join_date',
              ].map((header) => (
                <TableHeader key={header} theme={theme} onClick={() => requestSort(header)}>
                  {header === 'id'
                    ? 'ID'
                    : header === 'customer_name'
                      ? 'Müşteri Adı'
                      : header === 'email'
                        ? 'Email'
                        : header === 'phone_number'
                          ? 'Telefon Numarası'
                          : header === 'is_verified'
                            ? 'Onay Durumu'
                            : header === 'privilege'
                              ? 'Yetki'
                              : 'Kayıt Tarihi'}
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
            {sortedCustomers.map((customer) => (
              <TableRow key={customer.id} theme={theme}>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name + ' ' + customer.surname}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone_number}</TableCell>
                <TableCell>{customer.privilege}</TableCell>
                <TableCell>
                  <CustomStatusDropdown
                    value={statusMap[customer.id] || (customer.is_verified ? 'Aktif' : 'Pasif')} // Fallback to 'Aktif'/'Pasif' if no custom status
                    onChange={(newStatusText) => handleStatusChange(customer.id, newStatusText)}
                    theme={theme}
                    options={statusOptions}
                  />
                </TableCell>
                <TableCell>
                  {new Date(customer.join_date).toLocaleString('tr-TR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <ActionButton color={theme === 'dark' ? '#2ecc71' : '#27ae60'}>
                      <a
                        style={{ underline: 'none', textDecoration: 'none' }}
                        href={`/#/customer_detail?customer_id=${customer.id}`}
                      >
                        <Edit size={18} style={{ marginRight: '0.5rem' }} /> Düzenle
                      </a>
                    </ActionButton>
                    <ActionButton
                      color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                      onClick={() => handleDeleteCustomer(customer)}
                    >
                      <Trash2 size={18} style={{ marginRight: '0.5rem' }} /> Sil
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        {sortedCustomers.length === 0 && (
          <NoDataMessage theme={theme}>Gösterilecek üye bulunamadı.</NoDataMessage>
        )}
      </TableWrapper>
    </div>
  )
}
