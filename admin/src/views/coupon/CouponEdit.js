import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const Modal = styled.div`
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
  width: 500px;
`

const FormGroup = styled.div`
  margin-bottom: 1rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  min-height: 20px;
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background: ${(props) => (props.primary ? '#3498db' : '#e0e0e0')};
  color: ${(props) => (props.primary ? '#ffffff' : '#2c3e50')};
`

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const SelectedUsersContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const SelectedUserTag = styled.div`
  background: ${(props) => (props.theme === 'dark' ? '#3498db' : '#e1f0ff')};
  color: ${(props) => (props.theme === 'dark' ? '#fff' : '#2980b9')};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const RemoveUserButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const SelectAllContainer = styled.div`
  margin-bottom: 0.5rem;
`

const CouponEdit = ({ theme, coupon, users, onClose, onSave }) => {
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    coupon: {
      coupon_code: '',
      discount_rate: 0,
      smell_discount: false,
      photo_discount: 0,
      cardpostal_discount: 0,
      discount_description: '',
      start_date: new Date(),
      end_date: new Date(),
    },
    user_ids: [],
  })

  const availableUsers = users.filter(
    (user) =>
      !selectedUsers.some((selected) => selected.id === user.id) &&
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectAll = () => {
    const newUsers = availableUsers.map((user) => ({
      id: user.id,
      email: user.email,
    }))

    setSelectedUsers([...selectedUsers, ...newUsers])
    setFormData({
      ...formData,
      user_ids: [...selectedUsers, ...newUsers].map((u) => u.id),
    })
  }

  useEffect(() => {
    if (coupon && users) {
      // Convert users array to proper format with email
      const existingUsers = coupon.users.map((userId) => {
        const user = users.find((u) => u.id === userId.id)
        return {
          id: userId.id,
          email: user?.email || 'Unknown User',
        }
      })

      setSelectedUsers(existingUsers)
      setFormData({
        coupon: {
          ...formData.coupon,
          coupon_code: coupon.coupon_code || '',
          discount_rate: coupon.discount_rate || 0,
          smell_discount: coupon.smell_discount || false,
          photo_discount: coupon.photo_discount || 0,
          cardpostal_discount: coupon.cardpostal_discount || 0,
          discount_description: coupon.discount_description || '',
          start_date: coupon.start_date ? new Date(coupon.start_date) : new Date(),
          end_date: coupon.end_date ? new Date(coupon.end_date) : new Date(),
        },
        user_ids: existingUsers.map((user) => user.id),
      })
    }
  }, [coupon, users])

  const handleUserSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions)
    const newUsers = selectedOptions
      .map((option) => {
        const selectedUser = users.find((u) => u.id === parseInt(option.value))
        return {
          id: parseInt(option.value),
          email: selectedUser?.email || 'Unknown User',
        }
      })
      .filter((user) => !selectedUsers.find((u) => u.id === user.id))

    const updatedUsers = [...selectedUsers, ...newUsers]
    setSelectedUsers(updatedUsers)
    setFormData({
      ...formData,
      user_ids: updatedUsers.map((u) => u.id),
    })
  }

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
    setFormData({
      ...formData,
      user_ids: formData.user_ids.filter((id) => id !== userId),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(formData)
    onSave(formData)
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>Kupon Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Kupon Kodu</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.coupon.coupon_code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coupon: { ...formData.coupon, coupon_code: e.target.value },
                })
              }
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>İndirim Oranı (%)</Label>
            <Input
              theme={theme}
              type="number"
              min="0"
              max="100"
              value={formData.coupon.discount_rate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coupon: { ...formData.coupon, discount_rate: parseFloat(e.target.value) },
                })
              }
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Koku İndirimi</Label>
            <Select
              theme={theme}
              value={formData.coupon.smell_discount.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coupon: { ...formData.coupon, smell_discount: e.target.value === 'true' },
                })
              }
            >
              <option value="false">Hayır</option>
              <option value="true">Evet</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Fotoğraf İndirimi</Label>
            <Input
              theme={theme}
              type="number"
              min="0"
              value={formData.coupon.photo_discount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coupon: { ...formData.coupon, photo_discount: parseInt(e.target.value) },
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Kartpostal İndirimi</Label>
            <Input
              theme={theme}
              type="number"
              min="0"
              value={formData.coupon.cardpostal_discount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coupon: { ...formData.coupon, cardpostal_discount: parseInt(e.target.value) },
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>İndirim Açıklaması</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.coupon.discount_description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  coupon: { ...formData.coupon, discount_description: e.target.value },
                })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Başlangıç Tarihi</Label>
            <StyledDatePicker
              selected={formData.coupon.start_date}
              onChange={(date) =>
                setFormData({
                  ...formData,
                  coupon: { ...formData.coupon, start_date: date },
                })
              }
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              theme={theme}
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Bitiş Tarihi</Label>
            <StyledDatePicker
              selected={formData.coupon.end_date}
              onChange={(date) =>
                setFormData({
                  ...formData,
                  coupon: { ...formData.coupon, end_date: date },
                })
              }
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              theme={theme}
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Kullanıcılar</Label>
            <SearchInput
              theme={theme}
              type="text"
              placeholder="Kullanıcı ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SelectAllContainer>
              <Button
                type="button"
                onClick={handleSelectAll}
                disabled={availableUsers.length === 0}
              >
                Tüm Kullanıcıları Seç ({availableUsers.length})
              </Button>
            </SelectAllContainer>
            <Select
              theme={theme}
              multiple
              onChange={handleUserSelect}
              style={{ minHeight: '150px' }}
            >
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </Select>
            <SelectedUsersContainer>
              {selectedUsers.map((user) => (
                <SelectedUserTag key={user.id} theme={theme}>
                  {user.email}
                  <RemoveUserButton onClick={() => removeUser(user.id)}>×</RemoveUserButton>
                </SelectedUserTag>
              ))}
            </SelectedUsersContainer>
          </FormGroup>

          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" primary>
              Kaydet
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default CouponEdit
