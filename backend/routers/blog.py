from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
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
    slug = re.sub(r'\s+', '-', title)
    return slug

@router.post("/blogs")
async def create_blog(
    title: str = Form(...),  # Form field for title
    text: str = Form(...),   # Form field for text
    icon: UploadFile = File(None),  # Icon image
    main_photo: UploadFile = File(None),  # Main photo
    current_user=Depends(get_current_admin_user)  # Dependency to get the current user
):
    # Generate slug from title
    slug = generate_slug(title)

    # Save the icon and main photo if uploaded
    icon_path = None
    main_photo_path = None
    upload_folder = "static/uploads/blogs"
    os.makedirs(upload_folder, exist_ok=True)
    
    if icon:
        icon_filename = f"{slug}_icon_{icon.filename}"
        icon_path = os.path.join(upload_folder, icon_filename)
        with open(icon_path, "wb") as buffer:
            buffer.write(await icon.read())
    
    if main_photo:
        main_photo_filename = f"{slug}_main_{main_photo.filename}"
        main_photo_path = os.path.join(upload_folder, main_photo_filename)
        with open(main_photo_path, "wb") as buffer:
            buffer.write(await main_photo.read())
    
    # Create the Blog entry in the database
    new_blog = await Blog.create(
        title=title,
        slug=slug,
        text=text,
        icon=icon_path,
        main_photo=main_photo_path
    )

    return {"message": "Blog created successfully", "blog": await Blog_Pydantic.from_tortoise_orm(new_blog)}

@router.get("/blogs", response_model=list[Blog_Pydantic])
async def get_all_blogs():
    return await Blog_Pydantic.from_queryset(Blog.all())

@router.put("/blogs/{blog_id}", response_model=Blog_Pydantic)
async def update_blog(blog_id: int, blog_data: BlogIn_Pydantic, icon: Optional[UploadFile] = File(None), main_photo: Optional[UploadFile] = File(None), current_user=Depends(get_current_admin_user)):
    try:
        # Fetch the blog entry by ID
        blog = await Blog.get(id=blog_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Blog not found")

    # Generate a new slug if the title is updated
    if blog_data.title:
        blog.slug = generate_slug(blog_data.title)

    # Update fields
    blog.title = blog_data.title
    blog.text = blog_data.text

    # Handle icon update
    if icon:
        icon_filename = f"{blog.slug}_icon_{icon.filename}"
        icon_path = os.path.join("static/uploads/", icon_filename)
        with open(icon_path, "wb") as buffer:
            buffer.write(await icon.read())
        blog.icon = icon_path

    # Handle main photo update
    if main_photo:
        main_photo_filename = f"{blog.slug}_main_{main_photo.filename}"
        main_photo_path = os.path.join("static/uploads/", main_photo_filename)
        with open(main_photo_path, "wb") as buffer:
            buffer.write(await main_photo.read())
        blog.main_photo = main_photo_path

    # Save changes
    await blog.save()
    return await Blog_Pydantic.from_tortoise_orm(blog)

@router.delete("/blogs/{blog_id}", response_model=dict)
async def delete_blog(blog_id: int, current_user=Depends(get_current_admin_user)):
    try:
        # Fetch the blog entry by ID
        blog = await Blog.get(id=blog_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Blog not found")

    # Delete the blog entry
    await blog.delete()
    return {"message": "Blog deleted successfully"}



