from fastapi import APIRouter, Depends, HTTPException, status
from tortoise.contrib.pydantic import pydantic_queryset_creator
from models import *
from helpers.user_helper import get_current_admin_user
from typing import List

router = APIRouter()


# Create
@router.post(
    "/prices", response_model=prices_pydantic, status_code=status.HTTP_201_CREATED
)
async def create_price(price: prices_pydanticIn, user=Depends(get_current_admin_user)):
    """
    Create a new price entry.
    Only accessible by authorized admin users.
    """
    obj = await Prices.create(**price.dict())
    return await prices_pydantic.from_tortoise_orm(obj)


@router.get("/prices", response_model=List[prices_pydantic])
async def get_all_prices():
    try:
        prices = await Prices.all()
        result = await prices_pydantic.from_queryset(Prices.all())

        # Format decimal values
        for price in result:
            price.price_value = float(price.price_value)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Read by ID
@router.get("/prices/id/{price_id}", response_model=prices_pydantic)
async def get_price(price_id: int, user=Depends(get_current_admin_user)):
    """
    Retrieve a price by its ID.
    Only accessible by authorized admin users.
    """
    price = await Prices.get_or_none(id=price_id)
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Price with ID {price_id} not found.",
        )
    return await prices_pydantic.from_tortoise_orm(price)


@router.get("/prices/name/{price_name}", response_model=prices_pydantic)
async def get_price(price_name: str, user=Depends(get_current_admin_user)):
    """
    Retrieve a price by its ID.
    Only accessible by authorized admin users.
    """
    price = await Prices.get_or_none(price_name=price_name)
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Price with Name {price_name} not found.",
        )
    return await prices_pydantic.from_tortoise_orm(price)


# Update
@router.put("/prices/{price_id}", response_model=prices_pydantic)
async def update_price(
    price_id: int,
    updated_price: prices_pydanticIn,
    user=Depends(get_current_admin_user),
):
    """
    Update an existing price entry by ID.
    Only accessible by authorized admin users.
    """
    price = await Prices.get_or_none(id=price_id)
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Price with ID {price_id} not found.",
        )
    await price.update_from_dict(updated_price.dict()).save()
    return await prices_pydantic.from_tortoise_orm(price)


# Delete
@router.delete("/prices/{price_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_price(price_id: int, user=Depends(get_current_admin_user)):
    """
    Delete a price entry by ID.
    Only accessible by authorized admin users.
    """
    price = await Prices.get_or_none(id=price_id)
    if not price:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Price with ID {price_id} not found.",
        )
    await price.delete()
    return {"detail": f"Price with ID {price_id} has been deleted successfully."}
