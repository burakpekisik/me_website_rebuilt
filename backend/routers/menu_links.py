from fastapi import APIRouter, Depends, HTTPException
from tortoise.exceptions import DoesNotExist
from models import MenuLinks
from helpers.user_helper import get_current_admin_user
from models import *

router = APIRouter()

# Create a new menu link
@router.post("/menu_links", response_model=MenuLinksOut_Pydantic)
async def create_menu_link(
    menu_link: MenuLinksIn_Pydantic,
    current_user=Depends(get_current_admin_user)  # Only admins can create new menu links
):
    if menu_link.is_dropdown and not menu_link.dropdown_items:
        raise HTTPException(status_code=400, detail="dropdown_items cannot be empty if is_dropdown is true")

    new_menu_link = await MenuLinks.create(
        menu_name=menu_link.menu_name,
        menu_url=menu_link.menu_url,
        target_window=menu_link.target_window,
        menu_group=menu_link.menu_group,
        is_dropdown=menu_link.is_dropdown,
        dropdown_items=menu_link.dropdown_items
    )
    return await MenuLinksOut_Pydantic.from_tortoise_orm(new_menu_link)

# Retrieve all menu links
@router.get("/menu_links", response_model=list[MenuLinksOut_Pydantic])
async def get_all_menu_links():
    menu_links = await MenuLinks.all()
    return [await MenuLinksOut_Pydantic.from_tortoise_orm(link) for link in menu_links]

# Retrieve a specific menu link by ID
@router.get("/menu_links/{menu_link_id}", response_model=MenuLinksOut_Pydantic)
async def get_menu_link(menu_link_id: int):
    try:
        menu_link = await MenuLinks.get(id=menu_link_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Menu link not found")
    
    return await MenuLinksOut_Pydantic.from_tortoise_orm(menu_link)

# Update a specific menu link by ID
@router.put("/menu_links/{menu_link_id}", response_model=MenuLinksOut_Pydantic)
async def update_menu_link(
    menu_link_id: int,
    menu_link: MenuLinksIn_Pydantic,
    current_user=Depends(get_current_admin_user)  # Only admins can update menu links
):
    try:
        existing_menu_link = await MenuLinks.get(id=menu_link_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Menu link not found")

    existing_menu_link.menu_name = menu_link.menu_name
    existing_menu_link.menu_url = menu_link.menu_url
    existing_menu_link.target_window = menu_link.target_window
    existing_menu_link.menu_group = menu_link.menu_group
    
    await existing_menu_link.save()
    
    return await MenuLinksOut_Pydantic.from_tortoise_orm(existing_menu_link)

# Delete a specific menu link by ID
@router.delete("/menu_links/{menu_link_id}", response_model=dict)
async def delete_menu_link(menu_link_id: int, current_user=Depends(get_current_admin_user)):
    try:
        menu_link = await MenuLinks.get(id=menu_link_id)
        await menu_link.delete()
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Menu link not found")
    
    return {"status": "success", "detail": "Menu link deleted successfully"}
