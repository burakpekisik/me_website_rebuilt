from fastapi import APIRouter, Depends, HTTPException, status
from tortoise.contrib.pydantic import pydantic_queryset_creator
from models import *
from helpers.user_helper import get_current_admin_user
from typing import List

router = APIRouter()

# Create
@router.post("/features", response_model=features_pydantic, status_code=status.HTTP_201_CREATED)
async def create_feature(feature: features_pydanticIn, user=Depends(get_current_admin_user)):
    """
    Create a new feature entry.
    Only accessible by authorized admin users.
    """
    obj = await Features.create(**feature.dict())
    return await features_pydantic.from_tortoise_orm(obj)

@router.get("/features", response_model=List[features_pydantic])
async def get_all_features():
    try:
        # Tortoise ORM'den tüm kayıtları al
        features = await Features.all()
        # Pydantic modeline dönüştür
        return await features_pydantic.from_queryset(Features.all())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Read by ID
@router.get("/features/id/{feature_id}", response_model=features_pydantic)
async def get_feature(feature_id: int, user=Depends(get_current_admin_user)):
    """
    Retrieve a feature by its ID.
    Only accessible by authorized admin users.
    """
    feature = await Features.get_or_none(id=feature_id)
    if not feature:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Feature with ID {feature_id} not found."
        )
    return await features_pydantic.from_tortoise_orm(feature)

@router.get("/features/name/{feature_name}", response_model=features_pydantic)
async def get_feature(feature_name: str, user=Depends(get_current_admin_user)):
    """
    Retrieve a feature by its ID.
    Only accessible by authorized admin users.
    """
    feature = await Features.get_or_none(feature_name=feature_name)
    if not feature:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Feature with Name {feature_name} not found."
        )
    return await features_pydantic.from_tortoise_orm(feature)

# Update
@router.put("/feature/{feature_id}", response_model=features_pydantic)
async def update_feature(feature_id: int, updated_feature: features_pydanticIn, user=Depends(get_current_admin_user)):
    """
    Update an existing feature entry by ID.
    Only accessible by authorized admin users.
    """
    feature = await Features.get_or_none(id=feature_id)
    if not feature:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Featue with ID {feature_id} not found."
        )
    await feature.update_from_dict(updated_feature.dict()).save()
    return await features_pydantic.from_tortoise_orm(feature)

# Delete
@router.delete("/feature/{feature_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_feature(feature_id: int, user=Depends(get_current_admin_user)):
    """
    Delete a feature entry by ID.
    Only accessible by authorized admin users.
    """
    feature = await Features.get_or_none(id=feature_id)
    if not feature:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Feature with ID {feature_id} not found."
        )
    await feature.delete()
    return {"detail": f"Feature with ID {feature_id} has been deleted successfully."}
