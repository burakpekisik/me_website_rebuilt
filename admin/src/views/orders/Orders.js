import React, { useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { fetchOrders } from './FetchOrders'
import OrderCreate from './OrderCreate'
import { OrderTable } from './OrderTable'

const themes = {
  light: {
    background: '#f4f6f9',
    text: '#2c3e50',
    cardBackground: '#ffffff',
    shadowColor: 'rgba(0,0,0,0.1)',
    loadingBackground: '#ffffff',
    loadingSpinner: '#3498db',
  },
  dark: {
    background: '#1c1c1c',
    text: '#e0e0e0',
    cardBackground: '#2c2c2c',
    shadowColor: 'rgba(255,255,255,0.1)',
    loadingBackground: '#121212',
    loadingSpinner: '#4ecdc4',
  },
}

const PageContainer = styled.div`
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  min-height: 100vh;
  padding: 2rem;
  transition: all 0.3s ease;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => props.theme.loadingBackground};
`

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${(props) => props.theme.loadingSpinner};
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const PageTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: ${(props) => props.theme.text};
`

const ErrorContainer = styled.div`
  background-color: ${(props) => props.theme.background};
  color: #e74c3c;
  padding: 1rem;
  text-align: center;
`

const FilterToggleButton = styled.button`
  background-color: ${(props) => (props.active ? '#3498db' : '#95a5a6')};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.active ? '#2980b9' : '#7f8c8d')};
  }
`

const AddOrderButton = styled.button`
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
  margin-left: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #27ae60;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [theme, setTheme] = useState('light')
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [isOrderCreateOpen, setIsOrderCreateOpen] = useState(false)

  useEffect(() => {
    const currentTheme = localStorage.getItem('coreui-free-react-admin-template-theme') || 'light'
    setTheme(currentTheme)

    const loadOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        const data = await fetchOrders(token)
        setOrders(data)

        // Default filtering
        const filtered = data.filter(
          (order) => !['Sipariş Bekleniyor', 'Sipariş Oluşturuldu'].includes(order.status),
        )
        setFilteredOrders(filtered)
        setLoading(false)
      } catch (err) {
        setError(err)
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const toggleFilter = () => {
    setIsFilterActive(!isFilterActive)

    if (isFilterActive) {
      // Apply filter
      const filtered = orders.filter(
        (order) => !['Sipariş Bekleniyor', 'Sipariş Oluşturuldu'].includes(order.status),
      )
      setFilteredOrders(filtered)
    } else {
      // Remove filter
      setFilteredOrders(orders)
    }
  }

  const handleOrderCreateClose = () => {
    setIsOrderCreateOpen(false)
  }

  if (loading)
    return (
      <ThemeProvider theme={themes[theme]}>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </ThemeProvider>
    )

  if (error)
    return (
      <ThemeProvider theme={themes[theme]}>
        <ErrorContainer>Hata: {error.message}</ErrorContainer>
      </ThemeProvider>
    )

  return (
    <ThemeProvider theme={themes[theme]}>
      <PageContainer>
        <PageTitle>Siparişler</PageTitle>
        <ButtonContainer>
          <FilterToggleButton onClick={toggleFilter} active={isFilterActive}>
            {isFilterActive ? 'Filtreyi Kaldır' : 'Filtreyi Etkinleştir'}
          </FilterToggleButton>
          <AddOrderButton onClick={() => setIsOrderCreateOpen(true)}>Sipariş Ekle</AddOrderButton>
        </ButtonContainer>
        <OrderTable orders={filteredOrders} theme={theme} originalOrders={orders} />

        <OrderCreate isOpen={isOrderCreateOpen} onClose={handleOrderCreateClose} theme={theme} />
      </PageContainer>
    </ThemeProvider>
  )
}

export default Orders
