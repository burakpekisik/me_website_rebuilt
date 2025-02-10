from fastapi import APIRouter, Depends, Request
from typing import Optional
from pydantic import EmailStr
from models import *
from helpers.user_helper import get_current_user
from tortoise.exceptions import DoesNotExist

# Authentication
from authentication import *

router = APIRouter()

# Kullanıcı giriş route
@router.post("/login")
async def user_login(request: Request):
    # Request objesinden JSON verilerini çek
    body = await request.json()
    email = body.get("email")
    password = body.get("password")

    # Email veya password eksikse hata fırlat
    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required."
        )

    # Kullanıcıyı doğrula ve token üret
    token = await token_generator(email, password)

    # Kullanıcı bilgilerini al
    user = await User.get(email=email)
    user_data = await user_pydanticIn.from_tortoise_orm(user)

    return {
        "status": "ok",
        "token": token,  # JWT Token'ı döndür
        "user": user_data.dict(),  # Kullanıcı bilgilerini döndür
    }



@router.post("/register")
async def user_registeration(user: user_pydanticIn):
    user_info = user.dict(exclude_unset=True)
    user_info["password"] = get_hashed_password(user_info["password"])
    user_info["is_verified"] = False  # is_verified false olarak atanıyor
    user_info["join_date"] = datetime.now()  # join_date şu anki zaman olarak atanıyor
    user_info["privilege"] = "Müşteri"  # privilege "Müşteri" olarak atanıyor
    user_obj = await User.create(**user_info)
    new_user = await user_pydantic.from_tortoise_orm(user_obj)
    return {
        "status": "ok",
        "data": f"Hello, {new_user.name} thanks for registering. Please check your email for verification link",
    }

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    # Kullanıcıya ait siparişleri al
    orders = await Order.filter(customer_id=current_user.id)

    # Sipariş bilgilerini JSON formatında döndürmek için
    order_data = [await order_pydanticOut.from_tortoise_orm(order) for order in orders]

    # Kullanıcı profil bilgileri ve sipariş bilgilerini döndür
    return {
        "status": "success",
        "user": {
            "name": current_user.name,
            "surname": current_user.surname,
            "email": current_user.email,
            "phone_number": current_user.phone_number,
            "join_date": current_user.join_date
        },
        "orders": order_data
    }

@router.put("/update_password")
async def update_password(request: Request, user: User = Depends(get_current_user)):
    try:
        data = await request.json()
        old_password = data.get("old_password")
        new_password = data.get("new_password")

        if not old_password or not new_password:
            raise HTTPException(status_code=400, detail={"error": "Eski şifre ve yeni şifre gereklidir."})

        # Şifre kontrolü
        if not verify_password(old_password, user.password):
            raise HTTPException(status_code=400, detail={"error": "Eski şifre hatalı."})

        # Yeni şifreyi güncelle
        user.password = get_hashed_password(new_password)
        await user.save()
        
        return {"message": "Şifre başarıyla güncellendi."}

    except DoesNotExist:
        raise HTTPException(status_code=404, detail={"error": "Kullanıcı bulunamadı."})

@router.put("/update_email")
async def update_email(new_email: str, user: User = Depends(get_current_user)):
    try:
        # Yeni e-posta başka bir kullanıcı tarafından kullanılıyor mu?
        existing_user = await User.get_or_none(email=new_email)
        if existing_user:
            raise HTTPException(status_code=400, detail={"error": "Bu e-posta başka bir kullanıcı tarafından kullanılmaktadır."})

        # E-posta güncelle
        user.email = new_email
        await user.save()
        return {"message": "E-posta başarıyla güncellendi."}

    except DoesNotExist:
        raise HTTPException(status_code=404, detail={"error": "Kullanıcı bulunamadı."})
    
@router.put("/update_name")
async def update_name(new_first_name: str, new_last_name: str, user: User = Depends(get_current_user)):
    try:
        # Ad ve soyad güncelle
        user.first_name = new_first_name
        user.last_name = new_last_name
        await user.save()
        return {"message": "Ad ve soyadı başarıyla güncellendi."}

    except DoesNotExist:
        raise HTTPException(status_code=404, detail={"error": "Kullanıcı bulunamadı."})
    
@router.put("/update_user_info")
async def update_user_info(
    new_name: Optional[str] = None,
    new_surname: Optional[str] = None,
    new_email: Optional[EmailStr] = None,
    new_phone_number: Optional[str] = None,
    user: User = Depends(get_current_user)
):
    try:
        # E-posta güncelleme işlemi varsa
        if new_email:
            existing_user = await User.get_or_none(email=new_email)
            if existing_user:
                raise HTTPException(status_code=400, detail={"error": "Bu e-posta başka bir kullanıcı tarafından kullanılmaktadır."})
            user.email = new_email

        # Ad güncelleme işlemi varsa
        if new_name:
            user.name = new_name

        # Soyad güncelleme işlemi varsa
        if new_surname:
            user.surname = new_surname

        # Telefon numarası güncelleme işlemi varsa
        if new_phone_number:
            user.phone_number = new_phone_number

        # Değişiklikleri kaydet
        await user.save()

        return {"message": "Kullanıcı bilgileri başarıyla güncellendi."}

    except DoesNotExist:
        raise HTTPException(status_code=404, detail={"error": "Kullanıcı bulunamadı."})
    
@router.delete("/delete_user")
async def delete_user(user: User = Depends(get_current_user)):
    try:
        await user.delete()
        return {"message": "Kullanıcı başarıyla silindi."}
    except DoesNotExist:
        raise HTTPException(status_code=404, detail={"error": "Kullanıcı bulunamadı."})