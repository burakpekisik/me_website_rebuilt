from fastapi import APIRouter, Depends, HTTPException, Form
from tortoise.exceptions import DoesNotExist
from models import *
from helpers.user_helper import get_current_admin_user
import re

router = APIRouter()


def generate_slug(title: str) -> str:
    title = title.lower()
    turkish_to_english = str.maketrans("çğıöşü", "cgiosu")
    title = title.translate(turkish_to_english)
    slug = re.sub(r"\s+", "-", title)
    return slug


@router.get("/sss", response_model=list[SSS_Pydantic])
async def get_all_sss():
    return await SSS_Pydantic.from_queryset(SSS.all())


@router.post("/sss", response_model=SSS_Pydantic)
async def create_sss(
    sss_data: SSSIn_Pydantic, current_user: User = Depends(get_current_admin_user)
):
    try:
        # Generate slug from title
        slug = generate_slug(sss_data.title)

        # Create SSS object
        sss = await SSS.create(title=sss_data.title, slug=slug, text=sss_data.text)

        return await SSS_Pydantic.from_tortoise_orm(sss)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating SSS: {str(e)}")


@router.put("/sss/{sss_id}", response_model=SSS_Pydantic)
async def update_sss(
    sss_id: int, sss_data: SSSIn_Pydantic, current_user=Depends(get_current_admin_user)
):
    try:
        # Fetch the SSS entry by ID - Fix: Changed from get_all_sss.get to SSS.get
        sss = await SSS.get(id=sss_id)

        # Generate a new slug if the title is updated
        if sss_data.title:
            sss.slug = generate_slug(sss_data.title)

        # Update fields
        sss.title = sss_data.title
        sss.text = sss_data.text

        # Save changes
        await sss.save()

        return await SSS_Pydantic.from_tortoise_orm(sss)

    except DoesNotExist:
        raise HTTPException(status_code=404, detail=f"SSS with ID {sss_id} not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating SSS: {str(e)}")


@router.delete("/sss/{sss_id}", response_model=dict)
async def delete_sss(sss_id: int, current_user=Depends(get_current_admin_user)):
    try:
        # Fetch the sss entry by ID
        sss = await SSS.get(id=sss_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="SSS not found")

    # Delete the sss entry
    await sss.delete()
    return {"message": "SSS deleted successfully"}
