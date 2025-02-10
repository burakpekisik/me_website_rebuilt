from fastapi import APIRouter, Depends
from models import *
from helpers.user_helper import get_current_admin_user

# Authentication
from authentication import *

router = APIRouter()


@router.get("/envelope_colors/{color_id}", response_model=envelope_color_pydantic)
async def get_envelope_color_by_id(
    color_id: int, current_user: User = Depends(get_current_admin_user)
):
    color_instance = await EnvelopeColors.get_or_none(id=color_id)
    if not color_instance:
        raise HTTPException(status_code=404, detail="Envelope color not found")

    return await envelope_color_pydantic.from_tortoise_orm(color_instance)


@router.get("/envelope_colors", response_model=list[envelope_color_pydantic])
async def get_envelope_colors():
    return await EnvelopeColors.all()


# POST and GET methods for EnvelopeColors
@router.post("/envelope_colors", response_model=envelope_color_pydantic)
async def create_envelope_color(
    envelope_color: envelope_color_pydanticIn,
    current_user: User = Depends(get_current_admin_user),
):
    return await EnvelopeColors.create(**envelope_color.dict())


# PUT method to update an EnvelopeColor
@router.put("/envelope_colors/{color_id}", response_model=envelope_color_pydantic)
async def update_envelope_color(
    color_id: int,
    envelope_color: envelope_color_pydanticIn,
    current_user: User = Depends(get_current_admin_user),
):
    color_instance = await EnvelopeColors.get_or_none(id=color_id)
    if not color_instance:
        raise HTTPException(status_code=404, detail="Envelope color not found")

    await color_instance.update_from_dict(envelope_color.dict()).save()
    return await envelope_color_pydantic.from_tortoise_orm(color_instance)


# DELETE method to delete an EnvelopeColor
@router.delete("/envelope_colors/{color_id}")
async def delete_envelope_color(
    color_id: int, current_user: User = Depends(get_current_admin_user)
):
    color_instance = await EnvelopeColors.get_or_none(id=color_id)
    if not color_instance:
        raise HTTPException(status_code=404, detail="Envelope color not found")

    await color_instance.delete()
    return {"detail": "Envelope color deleted successfully"}
