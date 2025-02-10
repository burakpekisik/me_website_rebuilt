import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { couponApi } from './FetchCoupon'
import { Edit, Trash2, Plus } from 'lucide-react'
import CouponCreate from './CouponCreate'
import CouponEdit from './CouponEdit'

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

const Coupon = ({ theme }) => {
  const [coupons, setCoupons] = useState([])
  const [users, setUsers] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  useEffect(() => {
    fetchCoupons()
    fetchUsers()
  }, [])

  const fetchCoupons = async () => {
    try {
      const data = await couponApi.getCoupons()
      setCoupons(data.coupons)
    } catch (error) {
      console.error('Error fetching coupons:', error)
      alert('Failed to fetch coupons')
    }
  }

  const fetchUsers = async () => {
    try {
      const data = await couponApi.getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      alert('Failed to fetch users')
    }
  }

  const handleCreate = async (data) => {
    try {
      await couponApi.createCoupon(data)
      fetchCoupons()
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating coupon:', error)
      alert('Failed to create coupon')
    }
  }

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon)
  }

  const handleUpdate = async (data) => {
    try {
      await couponApi.updateCoupon(editingCoupon.coupon_code, data)
      fetchCoupons()
      setEditingCoupon(null)
    } catch (error) {
      console.error('Error updating coupon:', error)
      alert('Failed to update coupon')
    }
  }

  const handleDelete = (coupon) => {
    setDeleteConfirmation(coupon)
  }

  const confirmDelete = async () => {
    try {
      await couponApi.deleteCoupon(deleteConfirmation.coupon_code)
      fetchCoupons()
      setDeleteConfirmation(null)
    } catch (error) {
      console.error('Error deleting coupon:', error)
      alert('Failed to delete coupon')
    }
  }

  return (
    <div>
      <Header>
        <Title>Kuponlar</Title>
        <AddButton onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} />
          Yeni Kupon Ekle
        </AddButton>
      </Header>

      <TableWrapper theme={theme}>
        <Table>
          <thead>
            <tr>
              <TableHeader theme={theme}>Kupon Kodu</TableHeader>
              <TableHeader theme={theme}>İndirim Oranı</TableHeader>
              <TableHeader theme={theme}>Koku İndirimi</TableHeader>
              <TableHeader theme={theme}>Fotoğraf İndirimi</TableHeader>
              <TableHeader theme={theme}>Kartpostal İndirimi</TableHeader>
              <TableHeader theme={theme}>Başlangıç Tarihi</TableHeader>
              <TableHeader theme={theme}>Bitiş Tarihi</TableHeader>
              <TableHeader theme={theme}>Aktif</TableHeader>
              <TableHeader theme={theme}>İşlemler</TableHeader>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.coupon_code} theme={theme}>
                <TableCell theme={theme}>{coupon.coupon_code}</TableCell>
                <TableCell theme={theme}>{coupon.discount_rate}%</TableCell>
                <TableCell theme={theme}>{coupon.smell_discount ? 'Evet' : 'Hayır'}</TableCell>
                <TableCell theme={theme}>{coupon.photo_discount}</TableCell>
                <TableCell theme={theme}>{coupon.cardpostal_discount}</TableCell>
                <TableCell theme={theme}>
                  {new Date(coupon.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell theme={theme}>
                  {new Date(coupon.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell theme={theme}>{coupon.is_active ? 'Evet' : 'Hayır'}</TableCell>
                <TableCell theme={theme}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <ActionButton
                      color={theme === 'dark' ? '#3498db' : '#2980b9'}
                      onClick={() => handleEdit(coupon)}
                    >
                      <Edit size={18} style={{ marginRight: '0.5rem' }} />
                      Düzenle
                    </ActionButton>
                    <ActionButton
                      color={theme === 'dark' ? '#e74c3c' : '#c0392b'}
                      onClick={() => handleDelete(coupon)}
                    >
                      <Trash2 size={18} style={{ marginRight: '0.5rem' }} />
                      Sil
                    </ActionButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      {isCreateModalOpen && (
        <CouponCreate
          theme={theme}
          users={users}
          onClose={() => setIsCreateModalOpen(false)}
          onAdd={handleCreate}
        />
      )}

      {editingCoupon && (
        <CouponEdit
          theme={theme}
          coupon={editingCoupon}
          users={users}
          onClose={() => setEditingCoupon(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteConfirmation && (
        <DeleteConfirmationModal>
          <ModalContent theme={theme}>
            <h3>Kupon Silme İşlemi</h3>
            <p>{`"${deleteConfirmation.coupon_code}" kuponunu silmek istediğinizden emin misiniz?`}</p>
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
    </div>
  )
}

export default Coupon
