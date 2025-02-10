from fastapi import APIRouter, Depends, HTTPException
from models import *
from helpers.user_helper import get_current_admin_user
from typing import List
from tortoise.exceptions import DoesNotExist, ValidationError

# Authentication
from authentication import *

router = APIRouter()

@router.get("/admin/orders", response_model=List[order_pydanticOut])
async def get_all_orders(current_admin: User = Depends(get_current_admin_user)):
    # Fetch all orders as a QuerySet
    orders = Order.all()  # Don't await here as we need to keep it as a QuerySet
    
    # Return the orders using `from_queryset` to handle the QuerySet
    return await order_pydanticOut.from_queryset(orders)

@router.post("/admin/orders", response_model=order_pydanticOut)
async def create_order(
    order_data: order_pydanticIn,  # Admin panelinden gelen sipariş verileri
    current_admin: User = Depends(get_current_admin_user)  # Sadece Admin yetkisine sahip kullanıcılar sipariş oluşturabilir
):
    try:
        # Siparişi oluşturmak için order_data'daki verileri dict olarak alalım
        order_values = order_data.dict()
        order_values["customer_name"] = f"{current_admin.name} {current_admin.surname}"
        order_values["customer_id"] = current_admin.id  # Fill in customer_id from the current user

        # Yeni siparişi veritabanına kaydet
        new_order = await Order.create(**order_values)

        return await order_pydanticOut.from_tortoise_orm(new_order)

    except ValidationError as e:
        # Tortoise ORM'den gelen doğrulama hataları için
        raise HTTPException(status_code=422, detail=f"Validation Error: {e}")

    except Exception as e:
        # Diğer genel hatalar için
        raise HTTPException(status_code=422, detail=f"Error: {str(e)}")


@router.put("/admin/orders/{order_id}", response_model=order_pydanticOut)
async def update_order(
    order_id: int, 
    updated_data: order_pydanticIn,  # OrderIn modelini kullanıyoruz
    current_admin: User = Depends(get_current_admin_user)
):
    try:
        # Güncellenecek siparişi bul
        order_to_update = await Order.get(id=order_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Order not found")

    # Gelen verileri dinamik olarak güncelle
    updated_values = updated_data.dict(exclude_unset=True)  # Sadece gelen verileri al
    for field, value in updated_values.items():
        setattr(order_to_update, field, value)

    # Veritabanında güncelleme yap
    await order_to_update.save()

    return await order_pydanticOut.from_tortoise_orm(order_to_update)

# Sipariş silme fonksiyonu
@router.delete("/admin/orders/{order_id}")
async def delete_order(order_id: int, current_user: User = Depends(get_current_admin_user)):
    try:
        # Silinecek siparişi bul
        order_to_delete = await Order.get(id=order_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Order not found")

    # Siparişi sil
    await order_to_delete.delete()

    return {"message": "Order deleted successfully"}


@router.get("/admin/orders/{order_id}", response_model=order_pydanticOut)
async def get_order_by_id(order_id: int, current_admin: User = Depends(get_current_admin_user)):
    """
    Belirtilen order_id ile bir siparişi döner.
    Sadece admin kullanıcılar erişebilir.
    """
    try:
        # Siparişi veritabanında bul
        order = await Order.get(id=order_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Order not found")

    # Sipariş detaylarını döndür
    return await order_pydanticOut.from_tortoise_orm(order)