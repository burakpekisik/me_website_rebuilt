import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, CheckCircle, Edit, Save, XCircle } from 'lucide-react'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'

const lightTheme = {
  background: '#ffffff',
  text: '#2d3748',
  secondaryText: '#4a5568',
  border: '#e2e8f0',
  inputBackground: '#ffffff',
  cardBackground: '#ffffff',
  primaryColor: '#2563eb',
  successColor: '#10b981',
  errorColor: '#ef4444',
  shadowColor: 'rgba(0, 0, 0, 0.1)',
}

const darkTheme = {
  background: '#1a202c',
  text: '#e2e8f0',
  secondaryText: '#a0aec0',
  border: '#2d3748',
  inputBackground: '#2d3748',
  cardBackground: '#2d3748',
  primaryColor: '#3b82f6',
  successColor: '#34d399',
  errorColor: '#f87171',
  shadowColor: 'rgba(255, 255, 255, 0.1)',
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    transition: background-color 0.3s, color 0.3s;
  }
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', sans-serif;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.secondaryText};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => props.theme.primaryColor};
  }
`

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.text};
  margin: 0 auto;
`

const UpdateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${(props) => props.theme.primaryColor};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.primaryColor}ee;
  }

  &:disabled {
    background-color: ${(props) => props.theme.primaryColor}88;
    cursor: not-allowed;
  }
`

const ContentSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
`

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FieldLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  display: block;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;

  &:hover {
    color: #1a202c;
  }
`

const EditableFieldValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const FieldValue = styled.div`
  font-size: 0.875rem;
  color: #2d3748;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const EditButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #2563eb;
  }
`

const EditInput = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.875rem;
`

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.875rem;
`

const LoadingSpinner = styled.div`
  border: 4px solid #e2e8f0;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const CustomerDetail = () => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [searchParams] = useSearchParams()
  const user_id = searchParams.get('customer_id')
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [theme, setTheme] = useState(lightTheme)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const storedTheme = localStorage.getItem('coreui-free-react-admin-template-theme')
    setTheme(storedTheme === 'dark' ? darkTheme : lightTheme)
  }, [])

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/users/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserData(response.data)
        setLoading(false)
      } catch (err) {
        setError(err.response?.data?.detail || 'Kullanıcı detayları alınamadı')
        setLoading(false)
      }
    }

    if (user_id) fetchUserDetails()
    else {
      setError('Geçerli bir kullanıcı ID bulunamadı.')
      setLoading(false)
    }
  }, [user_id, token])

  const EditableField = ({ label, value, fieldName, type = 'text' }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [currentValue, setCurrentValue] = useState(value)

    const handleSave = () => {
      setIsEditing(false)
      setUserData((prev) => ({
        ...prev,
        [fieldName]: currentValue,
      }))
    }

    return (
      <div>
        <FieldLabel>{label}</FieldLabel>
        {isEditing ? (
          <EditableFieldValue>
            {type === 'select' ? (
              <Select value={currentValue} onChange={(e) => setCurrentValue(e.target.value)}>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </Select>
            ) : (
              <EditInput
                type={type}
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
              />
            )}
            <EditButton onClick={handleSave}>
              <CheckCircle size={20} color="#10b981" />
            </EditButton>
            <EditButton onClick={() => setIsEditing(false)}>
              <XCircle size={20} color="#ef4444" />
            </EditButton>
          </EditableFieldValue>
        ) : (
          <EditableFieldValue>
            <FieldValue>{value}</FieldValue>
            <EditButton onClick={() => setIsEditing(true)}>
              <Edit size={16} />
            </EditButton>
          </EditableFieldValue>
        )}
      </div>
    )
  }

  const handleUpdateUser = async () => {
    setIsSaving(true)
    setSaveError(null)

    try {
      const response = await axios.put(`${BASE_URL}/admin/users/${user_id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      setUserData(response.data)
      setSaveSuccess(true)

      setTimeout(() => {
        setSaveSuccess(false)
        window.location.reload()
      }, 2000)
    } catch (err) {
      setSaveError(err.response?.data?.detail || 'Kullanıcı güncellenemedi')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading || !userData) {
    return (
      <Container>
        <CenteredContainer>
          <LoadingSpinner />
        </CenteredContainer>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <div style={{ color: 'red' }}>{error}</div>
      </Container>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <PageHeader>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft />
          </BackButton>
          <PageTitle>Kullanıcı Detayları - #{userData.id}</PageTitle>
          <UpdateButton onClick={handleUpdateUser} disabled={isSaving}>
            <Save size={20} />
            Güncelle
          </UpdateButton>
        </PageHeader>

        <ContentSection>
          <GridLayout>
            <EditableField label="Ad" value={userData.name} fieldName="name" />
            <EditableField label="Soyad" value={userData.surname} fieldName="surname" />
            <EditableField label="E-posta" value={userData.email} fieldName="email" type="email" />
            <EditableField label="Telefon" value={userData.phone_number} fieldName="phone_number" />
            <EditableField
              label="Yetki"
              value={userData.privilege}
              fieldName="privilege"
              type="select"
            />
            <EditableField
              label="Kayıt Tarihi"
              value={new Date(userData.join_date).toLocaleDateString('tr-TR')}
              fieldName="join_date"
              type="text"
            />
          </GridLayout>
        </ContentSection>
      </Container>
    </ThemeProvider>
  )
}

export default CustomerDetail
