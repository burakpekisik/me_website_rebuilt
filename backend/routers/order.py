from fastapi import APIRouter, Depends
from models import *
from helpers.user_helper import get_current_user

# Authentication
from authentication import *

router = APIRouter()

@router.post("/order", response_model=order_pydanticOut)
async def create_order(
    order: order_pydanticIn,
    current_user: User = Depends(get_current_user),
):
    # Ensure the user is logged in and has a customer privilege
    if current_user.privilege != "Müşteri" and current_user.privilege != "Admin":
        raise HTTPException(status_code=403, detail="Operation not permitted")

    # Create a new order entry
    order_data = order.dict(exclude_unset=True)
    # Automatically set customer_name and customer_id from the current user
    order_data["customer_name"] = f"{current_user.name} {current_user.surname}"
    order_data["customer_id"] = current_user.id  # Fill in customer_id from the current user
    order_obj = await Order.create(**order_data)

    return await order_pydanticOut.from_tortoise_orm(order_obj)

@router.put("/order/{order_id}", response_model=order_pydanticOut)
async def update_order(
    order_id: int,
    order_update: order_pydanticIn,
    current_user: User = Depends(get_current_user)
):
    # Ensure the user is logged in and has a customer privilege
    if current_user.privilege != "Müşteri" and current_user.privilege != "Admin":
        raise HTTPException(status_code=403, detail="Operation not permitted")

    # Fetch the existing order
    order_obj = await Order.get_or_none(id=order_id)
    if not order_obj:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check if the order status is still "Sipariş Bekleniyor"
    # if order_obj.status != "Sipariş Bekleniyor" and order_obj.status != "Sipariş Oluşturuldu":
    #     raise HTTPException(status_code=400, detail="Order cannot be updated once the status has changed")

    # Check if the current user is the owner of the order
    if order_obj.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to update this order")

    # Update the order with provided data
    update_data = order_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(order_obj, key, value)
    
    await order_obj.save()  # Save the updated order

    return await order_pydanticOut.from_tortoise_orm(order_obj)

@router.delete("/order/{order_id}", response_model=dict)
async def delete_order(
    order_id: int,
    current_user: User = Depends(get_current_user)
):
    # Ensure the user is logged in and has a customer privilege
    if current_user.privilege not in ["Müşteri", "Admin"]:
        raise HTTPException(status_code=403, detail="Operation not permitted")

    # Fetch the existing order
    order_obj = await Order.get_or_none(id=order_id)
    if not order_obj:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check if the current user is the owner of the order
    if order_obj.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to delete this order")

    await order_obj.delete()  # Delete the order

    return {"detail": "Order deleted successfully"}

@router.get("/order/{order_id}", response_model=order_pydanticOut)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user)
):
    # Fetch the existing order
    order_obj = await Order.get_or_none(id=order_id)
    if not order_obj:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check if the current user is the owner of the order
    if order_obj.customer_id != current_user.id:
        raise HTTPException(status_code=403, detail="You are not authorized to access this order")

    return await order_pydanticOut.from_tortoise_orm(order_obj)

@router.get("/check_status", response_model=dict)
async def check_order_status(
    current_user: User = Depends(get_current_user)
):
    # Kullanıcının "Müşteri" veya "Admin" olarak yetkili olup olmadığını kontrol et
    if current_user.privilege not in ["Müşteri", "Admin"]:
        raise HTTPException(status_code=403, detail="Operation not permitted")

    # "Sipariş Bekleniyor" statüsüne sahip bir sipariş olup olmadığını kontrol et
    orders = await Order.filter(status="Sipariş Bekleniyor").all()

    # Eğer en az bir siparişin durumu "Sipariş Bekleniyor" ise not_send True, yoksa False döndür
    not_send = len(orders) > 0

    return {"not_send": not_send}