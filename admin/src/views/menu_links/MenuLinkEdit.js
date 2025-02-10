import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

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
  width: 400px;
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

const Checkbox = styled.input`
  margin-right: 0.5rem;
`

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const MenuLinkEdit = ({ theme, link, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    menu_name: '',
    menu_url: '',
    target_window: 'this_window',
    menu_group: 'navbar',
    is_dropdown: false,
    dropdown_items: [],
  })

  const [dropdownItem, setDropdownItem] = useState({ name: '', url: '' })

  useEffect(() => {
    if (link) {
      setFormData({
        menu_name: link.menu_name || '',
        menu_url: link.menu_url || '',
        target_window: link.target_window || 'this_window',
        menu_group: link.menu_group || 'navbar',
        is_dropdown: link.is_dropdown || false,
        dropdown_items: link.dropdown_items || [],
      })
    }
  }, [link])

  const handleAddDropdownItem = () => {
    if (dropdownItem.name && dropdownItem.url) {
      setFormData({
        ...formData,
        dropdown_items: [...formData.dropdown_items, dropdownItem],
      })
      setDropdownItem({ name: '', url: '' })
    }
  }

  const removeDropdownItem = (index) => {
    setFormData({
      ...formData,
      dropdown_items: formData.dropdown_items.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>Link Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Menü Adı</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.menu_name}
              onChange={(e) => setFormData({ ...formData, menu_name: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>URL</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.menu_url}
              onChange={(e) => setFormData({ ...formData, menu_url: e.target.value })}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Hedef Pencere</Label>
            <Select
              theme={theme}
              value={formData.target_window}
              onChange={(e) => setFormData({ ...formData, target_window: e.target.value })}
            >
              <option value="this_window">Bu Pencere</option>
              <option value="new_window">Yeni Pencere</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>Menü Grubu</Label>
            <Select
              theme={theme}
              value={formData.menu_group}
              onChange={(e) => setFormData({ ...formData, menu_group: e.target.value })}
            >
              <option value="navbar">Navbar</option>
              <option value="footer">Footer</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>
              <Checkbox
                type="checkbox"
                checked={formData.is_dropdown}
                onChange={(e) => setFormData({ ...formData, is_dropdown: e.target.checked })}
              />
              Dropdown Menü
            </Label>
          </FormGroup>

          {formData.is_dropdown && (
            <div>
              <h3>Dropdown Öğeleri</h3>
              {formData.dropdown_items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    {item.name} - {item.url}
                  </div>
                  <Button type="button" onClick={() => removeDropdownItem(index)}>
                    Sil
                  </Button>
                </div>
              ))}
              <FormGroup>
                <Input
                  theme={theme}
                  type="text"
                  placeholder="Öğe Adı"
                  value={dropdownItem.name}
                  onChange={(e) => setDropdownItem({ ...dropdownItem, name: e.target.value })}
                />
                <Input
                  theme={theme}
                  type="text"
                  placeholder="URL"
                  value={dropdownItem.url}
                  onChange={(e) => setDropdownItem({ ...dropdownItem, url: e.target.value })}
                />
                <Button type="button" onClick={handleAddDropdownItem}>
                  Öğe Ekle
                </Button>
              </FormGroup>
            </div>
          )}

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

export default MenuLinkEdit
