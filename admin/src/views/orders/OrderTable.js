import axios from 'axios'
import { ChevronDown, ChevronUp, Edit, Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

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

const ActionLink = styled.a`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
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
  'Sipariş Oluşturuldu': { dark: '#3498db', light: '#3498db' },
  'Sipariş Bekleniyor': { dark: '#f39c12', light: '#f39c12' },
  Hazırlanıyor: { dark: '#9b59b6', light: '#9b59b6' },
  Gönderildi: { dark: '#2ecc71', light: '#2ecc71' },
  'Teslim Edildi': { dark: '#2c3e50', light: '#2c3e50' },
}

const CustomStatusDropdown = ({ value, onChange, theme, options }) => {
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

const statusOptions = [
  'Sipariş Oluşturuldu',
  'Sipariş Bekleniyor',
  'Hazırlanıyor',
  'Gönderildi',
  'Teslim Edildi',
]

export const OrderTable = ({ orders, theme, originalOrders }) => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [sortConfig, setSortConfig] = useState({
    key: 'id',
    direction: 'descending',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusMap, setStatusMap] = useState({})

  const sortedOrders = useMemo(() => {
    let result = [...orders]

    if (searchTerm) {
      result = result.filter((order) =>
        Object.values(order).some((val) =>
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
  }, [orders, sortConfig, searchTerm])

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authorization token not found')
      }

      // HTTP PUT request
      const response = await axios.put(
        `${BASE_URL}/admin/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      // Update local state
      setStatusMap((prev) => ({
        ...prev,
        [orderId]: newStatus,
      }))

      console.log('Order status updated successfully:', response.data)
    } catch (error) {
      // Detailed error logging
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.statusText ||
        'Failed to update order status'

      console.error('Error updating order status:', errorMessage)
      alert(`Error: ${errorMessage}`) // Optional: Show user-friendly error
    }
  }

  return (
    <div>
      <SearchContainer>
        <SearchInput
          type="text"
          theme={theme}
          placeholder="Sipariş ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon theme={theme} size={20} />
      </SearchContainer>

      <TableWrapper theme={theme}>
        <Table>
          <thead>
            <tr>
              {['id', 'customer_name', 'order_price', 'status', 'date'].map((header) => (
                <TableHeader key={header} theme={theme} onClick={() => requestSort(header)}>
                  {header === 'id'
                    ? 'ID'
                    : header === 'customer_name'
                      ? 'Müşteri Adı'
                      : header === 'order_price'
                        ? 'Sipariş Fiyatı'
                        : header === 'status'
                          ? 'Durum'
                          : header === 'date'
                            ? 'Sipariş Tarihi'
                            : header}
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
            {sortedOrders.map((order) => (
              <TableRow key={order.id} theme={theme}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.order_price} TL</TableCell>
                <TableCell>
                  <CustomStatusDropdown
                    value={statusMap[order.id] || order.status}
                    onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                    theme={theme}
                    options={statusOptions}
                  />
                </TableCell>
                <TableCell>
                  {new Date(order.date).toLocaleString('tr-TR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <ActionButton color={theme === 'dark' ? '#3498db' : '#2980b9'}>
                      <ActionLink href={`/#/order_detail?order_id=${order.id}`}>
                        <Edit size={18} style={{ marginRight: '0.5rem' }} />
                        Düzenle
                      </ActionLink>
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        {sortedOrders.length === 0 && (
          <NoDataMessage theme={theme}>Gösterilecek sipariş bulunamadı.</NoDataMessage>
        )}
      </TableWrapper>
    </div>
  )
}
