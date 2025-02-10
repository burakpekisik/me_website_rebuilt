from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from tortoise.exceptions import DoesNotExist
import os
from models import *
from typing import Optional
from helpers.user_helper import get_current_admin_user
import re

router = APIRouter()


def generate_slug(title: str) -> str:
    title = title.lower()
    turkish_to_english = str.maketrans("çğıöşü", "cgiosu")
    title = title.translate(turkish_to_english)
    slug = re.sub(r"\s+", "-", title)
    return slug


@router.get("/content", response_model=list[Content_Pydantic])
async def get_all_content():
    return await Content_Pydantic.from_queryset(Content.all())


@router.post("/content", response_model=Content_Pydantic)
async def create_content(
    content: ContentIn_Pydantic, current_user=Depends(get_current_admin_user)
):
    try:
        slug = generate_slug(content.title)

        new_content = await Content.create(
            title=content.title,
            slug=slug,
            text=content.text,
            main_photos=[],
            other_photos=[],
        )

        return await Content_Pydantic.from_tortoise_orm(new_content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating content: {str(e)}")


@router.put("/content/{content_id}", response_model=Content_Pydantic)
async def update_content(
    content_id: int,
    content: ContentIn_Pydantic,
    current_user=Depends(get_current_admin_user),
):
    try:
        # Get existing content
        existing_content = await Content.get(id=content_id)

        # Generate new slug if title changed
        if content.title != existing_content.title:
            slug = generate_slug(content.title)
            existing_content.slug = slug

        # Update fields
        existing_content.title = content.title
        existing_content.text = content.text

        # Save changes
        await existing_content.save()

        return await Content_Pydantic.from_tortoise_orm(existing_content)

    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Content not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating content: {str(e)}")


@router.delete("/content/{content_id}", response_model=dict)
async def delete_content(content_id: int, current_user=Depends(get_current_admin_user)):
    try:
        # Fetch the content entry by ID
        content = await Content.get(id=content_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Content not found")

    # Delete the content entry
    await content.delete()
    return {"message": "Content deleted successfully"}
