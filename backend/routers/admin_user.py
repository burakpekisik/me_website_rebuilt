from fastapi import APIRouter, Depends
from models import *
from helpers.user_helper import get_current_admin_user
from tortoise.exceptions import DoesNotExist
from typing import List

# Authentication
from authentication import *

router = APIRouter()


@router.get("/admin/users", response_model=List[user_pydanticOut])
async def get_all_customers(current_admin: User = Depends(get_current_admin_user)):
    # Fetch all customers as a QuerySet
    customers_query = User.all()
    return await user_pydanticOut.from_queryset(customers_query)


@router.delete("/admin/users/{user_id}")
async def delete_user(
    user_id: int, current_user: User = Depends(get_current_admin_user)
):
    # Silinecek kullanıcıyı bul
    user_to_delete = await User.get(id=user_id)
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")

    # Kullanıcıyı veritabanından sil
    await user_to_delete.delete()

    return {"message": "User deleted successfully"}


@router.post("/admin/users", response_model=user_pydanticOut)
async def create_user(
    user: user_pydanticIn, admin_user: user_pydantic = Depends(get_current_admin_user)
):
    # Eğer gelen JSON'da is_verified varsa onu kullan, yoksa varsayılan değeri (False) kullan
    is_verified_value = user.dict().get("is_verified", False)

    user_obj = User(
        name=user.name,
        surname=user.surname,
        email=user.email,
        phone_number=user.phone_number,
        password=get_hashed_password(user.password),  # Şifreyi hash'le
        is_verified=is_verified_value,  # Gelen veya varsayılan değer
    )
    try:
        await user_obj.save()
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu e-posta veya telefon numarası zaten kayıtlı.",
        )
    return await user_pydanticOut.from_tortoise_orm(user_obj)


@router.put("/admin/users/{user_id}", response_model=user_pydanticOut)
async def update_user(
    user_id: int,
    updated_data: user_pydanticIn,  # Directly using the generated Pydantic model
    current_admin: User = Depends(get_current_admin_user),
):
    try:
        # Find the user to update
        user_to_update = await User.get(id=user_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")

    # Convert the incoming data to a dictionary, excluding unset fields
    updated_data_dict = updated_data.dict(exclude_unset=True)

    # Check for email uniqueness, if email is being updated
    if "email" in updated_data_dict:
        existing_user = (
            await User.filter(email=updated_data_dict["email"])
            .exclude(id=user_id)
            .first()
        )
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already in use")

    # If password is being updated, hash it before saving
    if "password" in updated_data_dict:
        updated_data_dict["password"] = get_hashed_password(
            updated_data_dict["password"]
        )

    # Update each field dynamically
    for field, value in updated_data_dict.items():
        setattr(user_to_update, field, value)

    # Save the changes to the database
    await user_to_update.save()

    # Return the updated user as the response
    return await user_pydanticOut.from_tortoise_orm(user_to_update)


@router.get("/admin/users/{user_id}", response_model=user_pydanticOut)
async def get_user_by_id(
    user_id: int, current_admin: User = Depends(get_current_admin_user)
):
    """
    Belirtilen order_id ile bir siparişi döner.
    Sadece admin kullanıcılar erişebilir.
    """
    try:
        # Siparişi veritabanında bul
        user = await User.get(id=user_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")

    # Sipariş detaylarını döndür
    return await user_pydanticOut.from_tortoise_orm(user)
