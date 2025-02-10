import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { commentApi } from './FetchComments'

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
  text-align: center;
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  min-height: 100px;
  resize: vertical;
`

const StarContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.active ? '#FFD700' : props.theme === 'dark' ? '#444' : '#ddd')};
  font-size: 24px;
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

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const CommentEdit = ({ theme, comment, onClose, onSave }) => {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    star: 5,
    customer_name: '',
    customer_id: null,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (comment) {
      setFormData({
        title: comment.title || '',
        text: comment.text || '',
        star: comment.star || 5,
        customer_name: comment.customer_name || '',
        customer_id: comment.customer_id || null,
      })
    }
  }, [comment])

  const fetchUsers = async () => {
    try {
      const data = await commentApi.getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleUserSelect = (e) => {
    const selectedUser = users.find((user) => user.id === parseInt(e.target.value))
    if (selectedUser) {
      setFormData({
        ...formData,
        customer_id: selectedUser.id,
        customer_name: `${selectedUser.name} ${selectedUser.surname}`,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.text || !formData.customer_name) {
      alert('Lütfen tüm alanları doldurun')
      return
    }
    onSave(formData)
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>Yorum Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Kullanıcı</Label>
            <Select
              theme={theme}
              value={formData.customer_id || ''}
              onChange={handleUserSelect}
              required
            >
              <option value="">Kullanıcı Seçin</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} {user.surname} ({user.email})
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Başlık</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Yorum</Label>
            <TextArea
              theme={theme}
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Yıldız</Label>
            <StarContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton
                  key={star}
                  type="button"
                  theme={theme}
                  active={star <= formData.star}
                  onClick={() => setFormData({ ...formData, star })}
                >
                  ★
                </StarButton>
              ))}
            </StarContainer>
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

export default CommentEdit
