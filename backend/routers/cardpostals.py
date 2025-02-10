from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from models import *
from helpers.user_helper import get_current_user, get_current_admin_user
from fastapi import File, UploadFile
import os
from typing import List
from PIL import Image
import secrets

# Authentication
from authentication import *

router = APIRouter()

@router.get("/cardpostals")
async def get_cardpostals():
    cardpostals = await Cardpostal.all().prefetch_related("category")
    return [
        {
            "name": cardpostal.name,
            "image_path": f"/cardpostals/images/{cardpostal.id}",  # Görsel için özel bir endpoint
            "category": cardpostal.category.name if cardpostal.category else None
        }
        for cardpostal in cardpostals
    ]

@router.get("/cardpostals/images/{cardpostal_id}")
async def get_cardpostal_image(cardpostal_id: int):
    cardpostal = await Cardpostal.get_or_none(id=cardpostal_id)
    if not cardpostal or not os.path.exists(cardpostal.image_path):
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(cardpostal.image_path)

@router.get("/cardpostals/{category_id}")
async def get_cardpostals_by_category(category_id: int):
    category = await Category.get_or_none(id=category_id).prefetch_related("cardpostals")
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    return [
        {
            "id": cardpostal.id,
            "name": cardpostal.name,
            "image_path": f"/cardpostals/images/{cardpostal.id}",  # Görsel için özel bir endpoint
            "category": category.name
        }
        for cardpostal in category.cardpostals
    ]

@router.post("/categories")
async def create_category(name: str, user = Depends(get_current_admin_user)):
    category = await Category.create(name=name)
    return {"message": "Category created successfully", "category": category}

@router.get("/categories")
async def get_categories():
    categories = await Category.all()
    return [{"id": category.id, "name": category.name} for category in categories]