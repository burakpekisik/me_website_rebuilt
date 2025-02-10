import axios from 'axios'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Edit,
  MapPin,
  Package,
  Save,
  User,
  XCircle,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import EnvelopePreview from './EnvelopePreview'
import {
  buildPayload,
  fetchCities,
  fetchEnvelopeColors,
  fetchJails,
  fetchJailsByCity,
  fetchLetterTypes,
  fetchOrderStatuses,
  fetchPaperColors,
  fetchTowns,
  fetchTownsByCity,
} from './FetchOrders'
import FileUploader from './FileUploader'
import PhotoUploader from './PhotoUploader'

// Dark Mode Theme Configuration
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

// Global Style for Dark Mode
const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    transition: background-color 0.3s, color 0.3s;
  }
`

// Styled Components with Theme Support
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

const EditableFieldValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const TrackerInput = styled.input`
  width: 100%;
  padding: 0.25rem 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
`

const Tab = styled.button`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  border-bottom: 2px solid ${(props) => (props.active ? '#2563eb' : 'transparent')};
  color: ${(props) => (props.active ? '#2563eb' : '#718096')};
  font-weight: ${(props) => (props.active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${(props) => (props.active ? '#2563eb' : '#4a5568')};
  }

  svg {
    margin-right: 0.5rem;
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

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const FieldLabel = styled.label`
  font-size: 1rem; /* Biraz daha büyük yazı */
  font-weight: 600; /* Daha belirgin bir font ağırlığı */
  color: #2d3748; /* Daha koyu bir ton */
  margin-bottom: 0.5rem; /* Daha dengeli bir alt boşluk */
  display: block; /* Her zaman yeni satıra yerleşsin */
  letter-spacing: 0.05em; /* Hafif aralık ekleyerek modern görünüm */
  transition: color 0.3s ease; /* Renk değişimine yumuşak bir geçiş */

  &:hover {
    color: #1a202c; /* Hover durumunda biraz daha koyulaştırma */
  }
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

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  color: #7f1d1d;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
`

const SuccessMessage = styled.div`
  background-color: #d1fae5;
  border: 1px solid #10b981;
  color: #065f46;
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`

const ColorSwatch = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
`

const OrderDetail = () => {
  const BASE_URL = process.env.REACT_APP_API_URL
  const [searchParams] = useSearchParams()
  const order_id = searchParams.get('order_id')
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState(null)
  const [editableData, setEditableData] = useState({})
  const [activeTab, setActiveTab] = useState('customerInfo')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const token = localStorage.getItem('token')

  const [letterTypes, setLetterTypes] = useState([])
  const [orderStatuses, setOrderStatuses] = useState([])
  const [envelopeColors, setEnvelopeColors] = useState([])
  const [paperColors, setPaperColors] = useState([])
  const [cities, setCities] = useState([])
  const [towns, setTowns] = useState([])
  const [jails, setJails] = useState([])

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [files, setFiles] = useState([])
  const [photos, setPhotos] = useState([])
  const [theme, setTheme] = useState(lightTheme)

  useEffect(() => {
    // Check localStorage for theme
    const storedTheme = localStorage.getItem('coreui-free-react-admin-template-theme')

    if (storedTheme === 'dark') {
      setTheme(darkTheme)
    } else {
      setTheme(lightTheme)
    }
  }, [])

  // Add a new function to handle order update
  const handleUpdateOrder = async () => {
    setIsSaving(true)
    setSaveError(null)

    try {
      const payload = buildPayload(
        editableData,
        cities,
        towns,
        jails,
        envelopeColors,
        paperColors,
        orderData,
      )

      const response = await axios.put(`${BASE_URL}/admin/orders/${order_id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      // Update the state with the updated order data
      setOrderData(response.data)
      setEditableData(response.data)
      setSaveSuccess(true)

      // Display success message and reload the page
      setTimeout(() => {
        setSaveSuccess(false)
        window.location.reload()
      }, 2000)
    } catch (err) {
      console.error('Order update error:', err)
      setSaveError(err.response?.data?.detail || 'Sipariş güncellenemedi')
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLetterTypes(fetchLetterTypes())
        setOrderStatuses(fetchOrderStatuses())
        setEnvelopeColors(await fetchEnvelopeColors())
        setPaperColors(await fetchPaperColors())
        setCities(await fetchCities())
        setTowns(await fetchTowns())
        setJails(await fetchJails())
      } catch (error) {
        console.error('Error fetching dropdown data:', error)
      }
    }

    fetchDropdownData()
  }, [])

  useEffect(() => {
    const mapOrderDetails = (data, mappings) => {
      return {
        ...data,
        sender_city: mappings.cities[data.sender_city] || data.sender_city,
        receiver_city: mappings.cities[data.receiver_city] || data.receiver_city,
        envelope_color: mappings.envelopeColors[data.envelope_color] || data.envelope_color,
        jail_address: mappings.jails[data.jail_name]?.address || data.jail_address,
        jail_name: mappings.jails[data.jail_name]?.name || data.jail_name,
        sender_district: mappings.towns[data.sender_district] || data.sender_district,
        paper_color: mappings.paperColors[data.paper_color] || data.paper_color,
      }
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/orders/${order_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = response.data

        const mappings = {
          cities: Object.fromEntries(cities.map((city) => [String(city.city_id), city.city_name])),
          towns: Object.fromEntries(towns.map((town) => [String(town.town_id), town.town_name])),
          jails: Object.fromEntries(jails.map((jail) => [String(jail.id), jail])),
          envelopeColors: Object.fromEntries(
            envelopeColors.map((color) => [String(color.color_code), color.color_name]),
          ),
          paperColors: Object.fromEntries(
            paperColors.map((color) => [String(color.color_code), color.color_name]),
          ),
        }

        const mappedData = mapOrderDetails(data, mappings)

        setOrderData(mappedData)
        setEditableData(mappedData)
        setLoading(false)

        // Update uploaded photos
        if (mappedData.photos && mappedData.photos.length > 0) {
          const photosList = mappedData.photos.map((photo, index) => ({
            url: `${BASE_URL}/${photo}`,
            id: index,
            path: photo,
          }))
          setPhotos(photosList)
        }

        if (mappedData.files && mappedData.files.length > 0) {
          const filesList = mappedData.files.map((file, index) => ({
            url: `${BASE_URL}/${file}`,
            path: file,
            id: file.split('/').pop(),
            name: file.split('/').pop(),
          }))
          setFiles(filesList)
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Sipariş detayları alınamadı')
        console.log('Error fetching order details:', err)
        setLoading(false)
      }
    }

    if (order_id) fetchOrderDetails()
    else {
      setError('Geçerli bir sipariş ID bulunamadı.')
      setLoading(false)
    }
  }, [order_id, cities, towns, jails, envelopeColors, paperColors])

  const sanitizeHTML = (html) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html
    return tempDiv.innerText || html
  }

  const EditableField = ({
    label,
    value,
    fieldName,
    type = 'text',
    options = [],
    onDropdownChange,
    additionalData,
  }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [currentValue, setCurrentValue] = useState(value)
    const [trackingCode, setTrackingCode] = useState('')
    const [trackingLink, setTrackingLink] = useState('')
    const [dropdownOptions, setDropdownOptions] = useState(options)

    // Fetch dynamic dropdown options based on field type
    useEffect(() => {
      const fetchDynamicOptions = async () => {
        try {
          switch (fieldName) {
            case 'sender_city':
            case 'receiver_city':
              const fetchedCities = await fetchCities()
              setDropdownOptions(fetchedCities.map((city) => city.city_name))
              break
            case 'sender_district':
            case 'receiver_district': {
              // Find the selected city's ID
              const selectedCity = await fetchCities().then((cities) =>
                cities.find(
                  (city) => city.city_name === editableData[fieldName.split('_')[0] + '_city'],
                ),
              )

              if (selectedCity) {
                const fetchedTowns = await fetchTownsByCity(selectedCity.city_id)
                setDropdownOptions(fetchedTowns.map((town) => town.town_name))
              } else {
                const fetchedTowns = await fetchTowns()
                setDropdownOptions(fetchedTowns.map((town) => town.town_name))
              }
              break
            }
            case 'jail_name': {
              // Find the selected city's ID
              const selectedCity = await fetchCities().then((cities) =>
                cities.find((city) => city.city_name === editableData.receiver_city),
              )

              if (selectedCity) {
                const fetchedJails = await fetchJailsByCity(selectedCity.city_id)
                setDropdownOptions(fetchedJails.map((jail) => jail.name))
              } else {
                const fetchedJails = await fetchJails()
                setDropdownOptions(fetchedJails.map((jail) => jail.name))
              }
              break
            }
          }
        } catch (error) {
          console.error(`Error fetching options for ${fieldName}:`, error)
        }
      }

      if (
        isEditing &&
        (fieldName === 'sender_city' ||
          fieldName === 'receiver_city' ||
          fieldName === 'sender_district' ||
          fieldName === 'receiver_district' ||
          fieldName === 'jail_name')
      ) {
        fetchDynamicOptions()
      }
    }, [isEditing, fieldName, editableData])

    const handleEdit = () => {
      setIsEditing(true)
    }

    const handleCancel = () => {
      setIsEditing(false)
      setCurrentValue(value)
    }

    const handleSave = async () => {
      setIsEditing(false)

      setOrderData((prev) => ({
        ...prev,
        [fieldName]: currentValue,
      }))

      // Special handling for specific fields
      const updateData = async () => {
        switch (fieldName) {
          case 'sender_city':
          case 'receiver_city': {
            const matchedCity = await fetchCities().then((cities) =>
              cities.find((city) => String(city.city_name) === String(currentValue)),
            )
            setEditableData((prev) => ({
              ...prev,
              [`${fieldName.split('_')[0]}_city_id`]: matchedCity ? matchedCity.city_id : null,
              [fieldName]: currentValue,
            }))
            break
          }
          case 'sender_district':
          case 'receiver_district': {
            const matchedTown = await fetchTowns().then((towns) =>
              towns.find((town) => town.town_name === currentValue),
            )
            setEditableData((prev) => ({
              ...prev,
              [`${fieldName.split('_')[0]}_district_id`]: matchedTown ? matchedTown.town_id : null,
              [fieldName]: currentValue,
            }))
            break
          }
          case 'jail_name': {
            const matchedJail = await fetchJails().then((jails) =>
              jails.find((jail) => jail.name === currentValue),
            )
            setEditableData((prev) => ({
              ...prev,
              jail_id: matchedJail ? matchedJail.id : null,
              jail_name: currentValue,
              jail_address: matchedJail ? matchedJail.address : null,
            }))
            break
          }
          case 'status': {
            setEditableData((prev) => ({
              ...prev,
              status: currentValue,
              tracking_code: trackingCode,
              tracking_link:
                trackingLink || `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${trackingCode}`,
            }))
            break
          }
          default:
            setEditableData((prev) => ({
              ...prev,
              [fieldName]: currentValue,
            }))

            setOrderData((prev) => ({
              ...prev,
              [fieldName]: currentValue,
            }))
        }
      }

      await updateData()
    }

    const renderInput = () => {
      switch (type) {
        case 'dropdown':
          return (
            <Select value={currentValue} onChange={(e) => setCurrentValue(e.target.value)}>
              {dropdownOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          )
        case 'color-dropdown':
          return (
            <Select
              value={currentValue}
              onChange={(e) => {
                const selectedColor = options.find((color) => color.color_name === e.target.value)
                setCurrentValue(selectedColor.color_code)
              }}
            >
              {options.map((color) => (
                <option key={color.color_name} value={color.color_name}>
                  {color.color_name}
                </option>
              ))}
            </Select>
          )
        case 'status':
          return (
            <>
              <Select value={currentValue} onChange={(e) => setCurrentValue(e.target.value)}>
                {options.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
              {currentValue === 'Gönderildi' && (
                <>
                  <TrackerInput
                    placeholder="Takip Kodu"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                  />
                  <TrackerInput
                    placeholder="Takip Linki"
                    value={
                      trackingLink ||
                      `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${trackingCode}`
                    }
                    onChange={(e) => setTrackingLink(e.target.value)}
                  />
                </>
              )}
            </>
          )
        default:
          return (
            <EditInput
              type="text"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
            />
          )
      }
    }

    return (
      <div>
        <FieldLabel>{label}</FieldLabel>
        {isEditing ? (
          <EditableFieldValue>
            {renderInput()}
            <EditButton onClick={handleSave}>
              <CheckCircle size={20} color="#10b981" />
            </EditButton>
            <EditButton onClick={handleCancel}>
              <XCircle size={20} color="#ef4444" />
            </EditButton>
          </EditableFieldValue>
        ) : (
          <EditableFieldValue>
            <FieldValue>{type === 'color' ? '' : currentValue}</FieldValue>
            {type === 'color' && (
              <ColorSwatch
                style={{
                  backgroundColor: currentValue,
                  marginLeft: '0.5rem',
                }}
              />
            )}
            <EditButton onClick={handleEdit}>
              <Edit size={16} />
            </EditButton>
          </EditableFieldValue>
        )}
      </div>
    )
  }

  const renderTabs = () => {
    const tabs = [
      { key: 'customerInfo', label: 'Müşteri Bilgileri', icon: <User /> },
      { key: 'senderInfo', label: 'Gönderen Bilgileri', icon: <MapPin /> },
      { key: 'receiverInfo', label: 'Alıcı Bilgileri', icon: <Package /> },
    ]

    return (
      <TabContainer>
        {tabs.map((tab) => (
          <Tab key={tab.key} onClick={() => setActiveTab(tab.key)} active={activeTab === tab.key}>
            {tab.icon}
            {tab.label}
          </Tab>
        ))}
      </TabContainer>
    )
  }

  const renderCustomerInfo = () => (
    <ContentSection>
      <GridLayout>
        <EditableField
          label="Müşteri Adı"
          value={orderData.customer_name}
          fieldName="customer_name"
        />
        <EditableField
          label="Sipariş Fiyatı"
          value={`${orderData.order_price} TL`}
          fieldName="order_price"
        />
        <EditableField
          label="Mektup Türü"
          value={orderData.letter_type}
          fieldName="letter_type"
          type="dropdown"
          options={letterTypes}
        />
        <EditableField
          label="Zarf Rengi"
          value={orderData.envelope_color}
          fieldName="envelope_color"
          type="color-dropdown"
          options={envelopeColors}
        />
        <EditableField
          label="Kağıt Rengi"
          value={orderData.paper_color}
          fieldName="paper_color"
          type="color-dropdown"
          options={paperColors}
        />
        <EditableField
          label="Durum"
          value={orderData.status}
          fieldName="status"
          type="status"
          options={orderStatuses}
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <FieldLabel>Zarf Metni</FieldLabel>
          <div
            style={{
              backgroundColor: '#f8fafc',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: '#2d3748',
            }}
          >
            {sanitizeHTML(orderData.envelope_text)}
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <FieldLabel>Mektup Zarfı</FieldLabel>
          <EnvelopePreview order_data={editableData} order_id={order_id} />
        </div>

        <PhotoUploader
          images={photos}
          isDropzoneActive={true}
          isDeleteButtonActive={true}
          orderId={order_id}
          token={token}
        />

        <FileUploader
          files={files}
          isDropzoneActive={true}
          isDeleteButtonActive={true}
          orderId={order_id}
          token={token}
        />
      </GridLayout>
    </ContentSection>
  )

  const renderSenderInfo = () => (
    <ContentSection>
      <GridLayout>
        <EditableField label="Ad" value={orderData.sender_name} fieldName="sender_name" />
        <EditableField
          label="Soyad"
          value={orderData.sender_surname || 'Belirtilmemiş'}
          fieldName="sender_surname"
        />
        <EditableField
          label="Şehir"
          value={orderData.sender_city}
          fieldName="sender_city"
          type="dropdown"
        />
        <EditableField
          label="İlçe"
          value={orderData.sender_district}
          fieldName="sender_district"
          type="dropdown"
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <EditableField
            label="Adres"
            value={orderData.sender_address}
            fieldName="sender_address"
          />
        </div>
      </GridLayout>
    </ContentSection>
  )

  const renderReceiverInfo = () => (
    <ContentSection>
      <GridLayout>
        <EditableField label="Ad" value={orderData.receiver_name} fieldName="receiver_name" />
        <EditableField
          label="Soyad"
          value={orderData.receiver_surname || 'Belirtilmemiş'}
          fieldName="receiver_surname"
        />
        <EditableField
          label="Telefon"
          value={orderData.receiver_phone}
          fieldName="receiver_phone"
        />
        <EditableField
          label="Şehir"
          value={orderData.receiver_city}
          fieldName="receiver_city"
          type="dropdown"
        />
        <EditableField label="Baba Adı" value={orderData.father_name} fieldName="father_name" />
        <EditableField
          label="Cezaevi Adı"
          value={orderData.jail_name}
          fieldName="jail_name"
          type="dropdown"
        />
        <EditableField
          label="Cezaevi Adresi"
          value={orderData.jail_address || 'Belirtilmemiş'}
          fieldName="jail_address"
        />
        <EditableField label="Koğuş ID" value={orderData.ward_id} fieldName="ward_id" />
      </GridLayout>
    </ContentSection>
  )

  if (loading)
    return (
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <LoadingSpinner />
        </div>
      </Container>
    )

  if (error)
    return (
      <Container>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <ErrorMessage>
            <AlertCircle style={{ marginRight: '0.5rem' }} />
            {error}
          </ErrorMessage>
        </div>
      </Container>
    )

  if (!orderData)
    return (
      <Container>
        <div className="flex justify-center items-center h-screen text-gray-500">
          Sipariş bulunamadı
        </div>
      </Container>
    )

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        {saveSuccess && (
          <SuccessMessage>
            <AlertCircle style={{ marginRight: '0.5rem' }} />
            Sipariş başarıyla güncellendi!
          </SuccessMessage>
        )}
        <PageHeader>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft />
          </BackButton>
          <PageTitle>Sipariş Detayları - #{orderData.id}</PageTitle>
          <UpdateButton onClick={handleUpdateOrder} disabled={isSaving}>
            <Save size={20} />
            Siparişi Güncelle
          </UpdateButton>
        </PageHeader>

        {saveError && (
          <ErrorMessage>
            <AlertCircle style={{ marginRight: '0.5rem' }} />
            {saveError}
          </ErrorMessage>
        )}

        {renderTabs()}

        {activeTab === 'customerInfo' && renderCustomerInfo()}
        {activeTab === 'senderInfo' && renderSenderInfo()}
        {activeTab === 'receiverInfo' && renderReceiverInfo()}
      </Container>
    </ThemeProvider>
  )
}

export default OrderDetail
