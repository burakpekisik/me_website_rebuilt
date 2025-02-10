from fastapi import APIRouter, Depends
from models import *
from helpers.user_helper import get_current_admin_user

# Authentication
from authentication import *

router = APIRouter()


@router.get("/paper_colors/{color_id}", response_model=paper_color_pydantic)
async def get_paper_color_by_id(
    color_id: int, current_user: User = Depends(get_current_admin_user)
):
    color_instance = await PaperColors.get_or_none(id=color_id)
    if not color_instance:
        raise HTTPException(status_code=404, detail="Paper color not found")

    return await paper_color_pydantic.from_tortoise_orm(color_instance)


@router.get("/paper_colors", response_model=list[paper_color_pydantic])
async def get_paper_colors():
    return await PaperColors.all()


# POST and GET methods for PaperColors
@router.post("/paper_colors", response_model=paper_color_pydantic)
async def create_paper_color(
    paper_color: paper_color_pydanticIn,
    current_user: User = Depends(get_current_admin_user),
):
    return await PaperColors.create(**paper_color.dict())


# PUT method to update a PaperColor
@router.put("/paper_colors/{color_id}", response_model=paper_color_pydantic)
async def update_paper_color(
    color_id: int,
    paper_color: paper_color_pydanticIn,
    current_user: User = Depends(get_current_admin_user),
):
    color_instance = await PaperColors.get_or_none(id=color_id)
    if not color_instance:
        raise HTTPException(status_code=404, detail="Paper color not found")

    await color_instance.update_from_dict(paper_color.dict()).save()
    return await paper_color_pydantic.from_tortoise_orm(color_instance)


# DELETE method to delete a PaperColor
@router.delete("/paper_colors/{color_id}")
async def delete_paper_color(
    color_id: int, current_user: User = Depends(get_current_admin_user)
):
    color_instance = await PaperColors.get_or_none(id=color_id)
    if not color_instance:
        raise HTTPException(status_code=404, detail="Paper color not found")

    await color_instance.delete()
    return {"detail": "Paper color deleted successfully"}
