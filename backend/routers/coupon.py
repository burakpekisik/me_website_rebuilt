from fastapi import APIRouter, Depends
from models import *
from helpers.user_helper import get_current_user, get_current_admin_user
from datetime import datetime, timezone
from typing import List
from zoneinfo import ZoneInfo
from tortoise.exceptions import DoesNotExist

# Authentication
from authentication import *

router = APIRouter()


@router.post("/coupons")
async def create_coupon(
    coupon: coupon_pydanticIn,
    user_ids: List[int],
    current_user: User = Depends(get_current_admin_user),
):
    current_date = datetime.now(timezone.utc)

    if coupon.start_date < current_date:
        raise HTTPException(status_code=400, detail="Start date cannot be in the past.")

    if coupon.end_date < coupon.start_date:
        raise HTTPException(
            status_code=400, detail="End date cannot be earlier than start date."
        )

    coupon_obj = await Coupons.create(**coupon.dict())
    users_to_assign = await User.filter(id__in=user_ids)
    await coupon_obj.users.add(*users_to_assign)

    return await coupon_pydanticOut.from_tortoise_orm(coupon_obj)


@router.get("/coupons")
async def get_user_coupons(current_user: User = Depends(get_current_user)):
    current_date = datetime.now(ZoneInfo("Europe/Istanbul"))
    coupons = await current_user.coupons.all()

    for coupon in coupons:
        if not (coupon.start_date <= current_date <= coupon.end_date):
            coupon.is_active = False
            await coupon.save()

    return {
        "status": "success",
        "coupons": [
            {
                "coupon_code": coupon.coupon_code,
                "discount_rate": coupon.discount_rate,
                "smell_discount": coupon.smell_discount,
                "photo_discount": coupon.photo_discount,
                "cardpostal_discount": coupon.cardpostal_discount,
                "discount_description": coupon.discount_description,
                "start_date": coupon.start_date,
                "end_date": coupon.end_date,
                "is_active": coupon.is_active,
            }
            for coupon in coupons
        ],
    }


@router.get("/coupons/all")
async def get_all_coupons(current_user: User = Depends(get_current_admin_user)):
    current_date = datetime.now(ZoneInfo("Europe/Istanbul"))
    coupons = await Coupons.all()

    for coupon in coupons:
        if not (coupon.start_date <= current_date <= coupon.end_date):
            coupon.is_active = False
            await coupon.save()

    return {
        "status": "success",
        "coupons": [
            {
                "coupon_code": coupon.coupon_code,
                "discount_rate": coupon.discount_rate,
                "smell_discount": coupon.smell_discount,
                "photo_discount": coupon.photo_discount,
                "cardpostal_discount": coupon.cardpostal_discount,
                "discount_description": coupon.discount_description,
                "start_date": coupon.start_date,
                "end_date": coupon.end_date,
                "is_active": coupon.is_active,
                "users": [
                    {"id": user.id, "email": user.email}
                    for user in await coupon.users.all()
                ],
            }
            for coupon in coupons
        ],
    }


@router.post("/add_coupon")
async def add_coupon(coupon_code: str, current_user: User = Depends(get_current_user)):
    # Find the coupon by code
    coupon = await Coupons.get_or_none(coupon_code=coupon_code)

    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found.")

    # Check if the user is already associated with the coupon
    if current_user in await coupon.users.all():
        raise HTTPException(
            status_code=400, detail="You are already a participant of this coupon."
        )

    # Add the user to the coupon's users
    await coupon.users.add(current_user)

    return {"status": "success", "detail": "You have been added to the coupon."}


@router.post("/validate_coupon")
async def validate_coupon(
    coupon_code: str, current_user: User = Depends(get_current_user)
):
    # Kuponu kod ile kontrol et
    coupon = await Coupons.get_or_none(coupon_code=coupon_code)

    # Eğer kupon yoksa hata döndür
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found.")

    # Kuponun geçerlilik tarihlerini kontrol et
    current_date = datetime.now(ZoneInfo("Europe/Istanbul"))
    if not (coupon.start_date <= current_date <= coupon.end_date):
        raise HTTPException(status_code=400, detail="Coupon is not valid at this time.")

    # Kullanıcının zaten kupona sahip olup olmadığını kontrol et
    if current_user in await coupon.users.all():
        return {
            "status": "exists",
            "detail": "You already have this coupon.",
            "coupon": {
                "coupon_code": coupon.coupon_code,
                "discount_rate": coupon.discount_rate,
                "smell_discount": coupon.smell_discount,
                "photo_discount": coupon.photo_discount,
                "cardpostal_discount": coupon.cardpostal_discount,
                "discount_description": coupon.discount_description,
                "start_date": coupon.start_date,
                "end_date": coupon.end_date,
                "is_active": coupon.is_active,
            },
        }

    # Kupon geçerli ve kullanıcıda yoksa bu bilgileri döndür
    return {
        "status": "valid",
        "detail": "Coupon is valid and you do not have it yet.",
        "coupon": {
            "coupon_code": coupon.coupon_code,
            "discount_rate": coupon.discount_rate,
            "smell_discount": coupon.smell_discount,
            "photo_discount": coupon.photo_discount,
            "cardpostal_discount": coupon.cardpostal_discount,
            "start_date": coupon.start_date,
            "end_date": coupon.end_date,
            "is_active": coupon.is_active,
        },
    }


@router.delete("/remove_coupon")
async def remove_coupon(
    coupon_code: str, current_user: User = Depends(get_current_user)
):
    # Kuponu kod ile kontrol et
    coupon = await Coupons.get_or_none(coupon_code=coupon_code)

    # Eğer kupon yoksa hata döndür
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found.")

    # Kullanıcının bu kupona sahip olup olmadığını kontrol et
    if current_user not in await coupon.users.all():
        raise HTTPException(status_code=400, detail="You do not have this coupon.")

    # Kullanıcı-kupon ilişkisini sil
    await coupon.users.remove(current_user)

    return {"status": "success", "detail": "Coupon has been removed from your account."}


@router.put("/coupons/{coupon_code}")
async def update_coupon(
    coupon_code: str,
    coupon_data: dict,
    current_user: User = Depends(get_current_admin_user),
):
    try:
        coupon = await Coupons.get(coupon_code=coupon_code)
        coupon_details = coupon_data.get("coupon", {})

        # Convert string dates to datetime objects
        if "start_date" in coupon_details:
            start_date = datetime.fromisoformat(
                coupon_details["start_date"].replace("Z", "+00:00")
            )
            coupon_details["start_date"] = start_date

        if "end_date" in coupon_details:
            end_date = datetime.fromisoformat(
                coupon_details["end_date"].replace("Z", "+00:00")
            )
            coupon_details["end_date"] = end_date

        # Update coupon fields
        for key, value in coupon_details.items():
            if hasattr(coupon, key):
                setattr(coupon, key, value)

        await coupon.save()

        # Update user assignments if provided
        user_ids = coupon_data.get("user_ids", [])
        if user_ids is not None:
            await coupon.users.clear()
            if user_ids:  # Only add users if list is not empty
                users = await User.filter(id__in=user_ids)
                await coupon.users.add(*users)

        return {
            "status": "success",
            "message": "Coupon updated successfully",
            "data": {
                "coupon_code": coupon.coupon_code,
                "discount_rate": coupon.discount_rate,
                "smell_discount": coupon.smell_discount,
                "photo_discount": coupon.photo_discount,
                "cardpostal_discount": coupon.cardpostal_discount,
                "discount_description": coupon.discount_description,
                "start_date": coupon.start_date,
                "end_date": coupon.end_date,
                "is_active": coupon.is_active,
            },
        }

    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Coupon not found")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/coupons/{coupon_code}")
async def delete_coupon(
    coupon_code: str, current_user: User = Depends(get_current_admin_user)
):
    try:
        coupon = await Coupons.get(coupon_code=coupon_code)

        # Remove all user relationships
        await coupon.users.clear()

        # Delete the coupon
        await coupon.delete()

        return {
            "status": "success",
            "message": f"Coupon {coupon_code} has been deleted successfully",
        }

    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Coupon not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
