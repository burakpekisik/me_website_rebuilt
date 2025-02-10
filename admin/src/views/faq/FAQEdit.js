import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

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
  width: 800px;

  .ql-editor {
    min-height: 200px;
    background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
    color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  }

  .ql-toolbar {
    background: ${(props) => (props.theme === 'dark' ? '#363636' : '#f8f9fa')};
    border-color: ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  }

  .ql-container {
    border-color: ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  }
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
  text-align: center;
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

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${(props) => (props.theme === 'dark' ? '#444' : '#ddd')};
  border-radius: 4px;
  background: ${(props) => (props.theme === 'dark' ? '#1c1c1c' : '#ffffff')};
  color: ${(props) => (props.theme === 'dark' ? '#e0e0e0' : '#2c3e50')};
`

const FAQEdit = ({ theme, faq, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    text: '',
    created_at: null,
    updated_at: null,
  })

  useEffect(() => {
    if (faq) {
      setFormData({
        id: faq.id || '',
        title: faq.title || '',
        text: faq.text || '',
        created_at: faq.created_at || null,
        updated_at: faq.updated_at || null,
      })
    }
  }, [faq])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.text) {
      alert('Lütfen tüm alanları doldurun')
      return
    }
    onSave({
      title: formData.title,
      text: formData.text,
    })
  }

  return (
    <Modal>
      <ModalContent theme={theme}>
        <h2>Soru Düzenle</h2>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label theme={theme}>Başlık</Label>
            <Input
              theme={theme}
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              required
            />
          </FormGroup>

          <FormGroup>
            <Label theme={theme}>İçerik</Label>
            <ReactQuill
              theme="snow"
              value={formData.text}
              onChange={(value) => setFormData({ ...formData, text: value })}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['clean'],
                ],
              }}
            />
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

export default FAQEdit
