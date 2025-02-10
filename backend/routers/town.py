from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models import *
from helpers.user_helper import get_current_user

router = APIRouter()


# Town Routes
@router.get("/towns", response_model=List[town_pydantic])
async def get_towns(user: dict = Depends(get_current_user)):
    return await town_pydantic.from_queryset(Town.all())


@router.get("/towns/city/{city_id}", response_model=List[town_pydantic])
async def get_towns_by_city(city_id: int, user: dict = Depends(get_current_user)):
    towns = await Town.filter(city_id=city_id).all()
    if not towns:
        raise HTTPException(status_code=404, detail="No towns found for this city")
    return await town_pydantic.from_queryset(Town.filter(city_id=city_id))


@router.get("/towns/{town_id}", response_model=town_pydantic)
async def get_town(town_id: int, user: dict = Depends(get_current_user)):
    return await town_pydantic.from_queryset_single(Town.get(town_id=town_id))


@router.post("/towns", response_model=town_pydantic)
async def create_town(town: town_pydanticIn, user: dict = Depends(get_current_user)):
    town_obj = await Town.create(**town.dict(exclude_unset=True))
    return await town_pydantic.from_tortoise_orm(town_obj)


@router.put("/towns/{town_id}", response_model=town_pydantic)
async def update_town(
    town_id: int, town: town_pydanticIn, user: dict = Depends(get_current_user)
):
    await Town.filter(town_id=town_id).update(**town.dict(exclude_unset=True))
    return await town_pydantic.from_queryset_single(Town.get(town_id=town_id))


@router.delete("/towns/{town_id}")
async def delete_town(town_id: int, user: dict = Depends(get_current_user)):
    deleted_count = await Town.filter(town_id=town_id).delete()
    if not deleted_count:
        raise HTTPException(status_code=404, detail=f"Town {town_id} not found")
    return {"message": f"Town {town_id} deleted successfully"}
