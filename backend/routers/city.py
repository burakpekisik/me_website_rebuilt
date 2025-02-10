from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models import *
from helpers.user_helper import get_current_user

router = APIRouter()


# City Routes
@router.get("/cities", response_model=List[city_pydantic])
async def get_cities(user: dict = Depends(get_current_user)):
    return await city_pydantic.from_queryset(City.all())


@router.get("/cities/{city_id}", response_model=city_pydantic)
async def get_city(city_id: int, user: dict = Depends(get_current_user)):
    return await city_pydantic.from_queryset_single(City.get(city_id=city_id))


@router.post("/cities", response_model=city_pydantic)
async def create_city(city: city_pydanticIn, user: dict = Depends(get_current_user)):
    city_obj = await City.create(**city.dict(exclude_unset=True))
    return await city_pydantic.from_tortoise_orm(city_obj)


@router.put("/cities/{city_id}", response_model=city_pydantic)
async def update_city(
    city_id: int, city: city_pydanticIn, user: dict = Depends(get_current_user)
):
    await City.filter(city_id=city_id).update(**city.dict(exclude_unset=True))
    return await city_pydantic.from_queryset_single(City.get(city_id=city_id))


@router.delete("/cities/{city_id}")
async def delete_city(city_id: int, user: dict = Depends(get_current_user)):
    # First check if city exists
    city = await City.get_or_none(city_id=city_id)
    if not city:
        raise HTTPException(status_code=404, detail=f"City {city_id} not found")

    # Delete all related towns
    await Town.filter(city_id=city_id).delete()

    # Delete the city
    await city.delete()

    return {"message": f"City {city_id} and its related towns deleted successfully"}
