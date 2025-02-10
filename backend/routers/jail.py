from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models import *
from helpers.user_helper import get_current_admin_user, get_current_user

router = APIRouter()

# Jail Routes
@router.get("/jails", response_model=List[jail_pydantic])
async def get_jails(user: dict = Depends(get_current_user)):
    return await jail_pydantic.from_queryset(Jail.all())

@router.get("/jails/{jail_id}", response_model=jail_pydantic)
async def get_jail(jail_id: int, user: dict = Depends(get_current_user)):
    return await jail_pydantic.from_queryset_single(Jail.get(id=jail_id))

@router.get("/jails/city/{city_id}", response_model=List[jail_pydantic])
async def get_jails_by_city(city_id: int, user: dict = Depends(get_current_user)):
    jails = await Jail.filter(city_id=city_id).all()
    if not jails:
        raise HTTPException(status_code=404, detail="No jails found for this city")
    return await jail_pydantic.from_queryset(Jail.filter(city_id=city_id))

@router.post("/jails", response_model=jail_pydantic)
async def create_jail(jail: jail_pydanticIn, user: dict = Depends(get_current_admin_user)):
    jail_obj = await Jail.create(**jail.dict())
    return await jail_pydantic.from_tortoise_orm(jail_obj)

@router.put("/jails/{jail_id}", response_model=jail_pydantic)
async def update_jail(jail_id: int, jail: jail_pydanticIn, user: dict = Depends(get_current_admin_user)):
    await Jail.filter(id=jail_id).update(**jail.dict())
    return await jail_pydantic.from_queryset_single(Jail.get(id=jail_id))

@router.delete("/jails/{jail_id}", response_model=dict)
async def delete_jail(jail_id: int, user: dict = Depends(get_current_admin_user)):
    delete_obj = await Jail.filter(id=jail_id).delete()
    if not delete_obj:
        raise HTTPException(status_code=404, detail="Jail not found")
    return {"message": "Jail deleted successfully"}