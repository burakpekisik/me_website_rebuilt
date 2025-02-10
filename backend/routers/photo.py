from fastapi import APIRouter, Depends, Query
from models import *
from helpers.user_helper import get_current_user, get_current_admin_user
from fastapi import File, UploadFile
from typing import List
import os
import secrets
from PIL import Image
from tortoise.exceptions import DoesNotExist

# Authentication
from authentication import *

router = APIRouter()


@router.post("/photo")
async def upload_photos(
    order_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
):
    # Verify if the order exists
    order = await Order.get(id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.customer_id != current_user.id and current_user.privilege != "Admin":
        raise HTTPException(
            status_code=403, detail="Not authorized to upload photos for this order"
        )

    saved_files = []

    # Define the directory where photos will be saved
    UPLOAD_DIRECTORY = "static/uploads/photos/"

    # Ensure the upload directory exists
    if not os.path.exists(UPLOAD_DIRECTORY):
        os.makedirs(UPLOAD_DIRECTORY)

    for file in files:
        # Generate a unique file name using timestamp and user ID
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_name = f"{timestamp}_{current_user.id}_{secrets.token_hex(4)}"
        file_path = os.path.join(UPLOAD_DIRECTORY, file_name)

        # Save the file
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Verify the image
        try:
            img = Image.open(file_path)
            img.verify()
        except (IOError, SyntaxError):
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Save the photo in the database
        photo_obj = await Photo.create(order=order, path=file_path)
        saved_files.append(await photo_pydantic.from_tortoise_orm(photo_obj))

        # Add the photo path to the Order's JSON field
        order.photos.append(photo_obj.path)

    # Save the updated Order with the new photo paths
    await order.save()

    return {"status": "success", "photos": saved_files, "photo_paths": order.photos}


@router.get("/photos/{order_id}")
async def get_photos(order_id: int, current_user: User = Depends(get_current_user)):
    # Verify if the order exists
    order = await Order.get(id=order_id).prefetch_related("photo_set")
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check if the user has permission to view the order's photos
    if order.customer_id != current_user.id and current_user.privilege != "Admin":
        raise HTTPException(
            status_code=403, detail="Not authorized to view photos for this order"
        )

    # Get all photos associated with the order
    photos = await Photo.filter(order=order).all()

    # Return the list of photo paths
    return {"status": "success", "photos": [photo.path for photo in photos]}


@router.delete("/photos/{order_id}/{photo_name}")
async def delete_photo(
    order_id: int, photo_name: str, current_user: User = Depends(get_current_user)
):
    # Verify if the order exists
    order = await Order.get(id=order_id).prefetch_related("photo_set")
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check if the user has permission to delete the photo
    if order.customer_id != current_user.id and current_user.privilege != "Admin":
        raise HTTPException(
            status_code=403, detail="Not authorized to delete photos for this order"
        )

    # Find the specific photo by its name
    photo = await Photo.filter(order=order, path__contains=photo_name).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    # Define the path to the photo in the file system
    UPLOAD_DIRECTORY = "static/uploads/photos/"
    photo_path = os.path.join(UPLOAD_DIRECTORY, photo.path)

    # Delete the photo file from the file system
    if os.path.exists(photo_path):
        os.remove(photo_path)

    # Remove the photo record from the database
    await photo.delete()

    # Remove the photo path from the order's JSON field
    if photo.path in order.photos:
        order.photos.remove(photo.path)
        await order.save()

    return {
        "status": "success",
        "message": f"Photo '{photo_name}' for order {order_id} has been deleted",
    }


@router.post("/upload/media")
async def upload_media(
    model_type: str,
    field_name: str,
    record_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Upload media to Blog or Content models' fields by specifying the record ID.

    Args:
        model_type: The model type ('blog' or 'content').
        field_name: The field to update ('main_photo' or 'other_photos').
        record_id: The ID of the Blog or Content record to update.
        files: List of files to upload.
        current_user: The current authenticated user.
    """
    # Validate model type
    if model_type not in ["blog", "content"]:
        raise HTTPException(
            status_code=400, detail="Invalid model_type. Choose 'blog' or 'content'."
        )

    # Validate field name
    if field_name not in ["main_photo", "other_photos"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid field_name. Choose 'main_photo' or 'other_photos'.",
        )

    # Set the upload directory based on the model type
    UPLOAD_DIRECTORY = f"static/uploads/{model_type}/"

    # Ensure the upload directory exists
    if not os.path.exists(UPLOAD_DIRECTORY):
        os.makedirs(UPLOAD_DIRECTORY)

    saved_files = []

    # Process each file
    for file in files:
        # Generate a unique file name
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_name = f"{timestamp}_{current_user.id}_{secrets.token_hex(4)}.{file.filename.split('.')[-1]}"
        file_path = os.path.join(UPLOAD_DIRECTORY, file_name)

        # Save the file
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        saved_files.append(file_path)

    # Update the specified model and field
    if model_type == "blog":
        blog = await Blog.get_or_none(id=record_id)
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")

        if field_name == "main_photo":
            blog.main_photo = saved_files[0]  # Only the first file is set as main_photo
        elif field_name == "other_photos":
            # Initialize other_photos as an empty list if it's None
            if blog.other_photos is None:
                blog.other_photos = []
            blog.other_photos.extend(saved_files)
        await blog.save()

    elif model_type == "content":
        content = await Content.get_or_none(id=record_id)
        if not content:
            raise HTTPException(status_code=404, detail="Content not found")

        if field_name == "main_photo":
            content.main_photo = saved_files[
                0
            ]  # Only the first file is set as main_photo
        elif field_name == "other_photos":
            # Initialize other_photos as an empty list if it's None
            if content.other_photos is None:
                content.other_photos = []
            content.other_photos.extend(saved_files)
        await content.save()

    return {
        "status": "success",
        "saved_files": saved_files,
    }


@router.delete("/upload/media")
async def delete_media(
    model_type: str,
    field_name: str,
    record_id: int,
    photos_to_delete: List[str],
    current_user: User = Depends(get_current_admin_user),
):
    try:
        if model_type == "content":
            content = await Content.get(id=record_id)

            if field_name == "main_photo":
                if content.main_photo in photos_to_delete:
                    content.main_photo = None
            elif field_name == "other_photos":
                current_photos = content.other_photos or []
                photos_to_keep = [
                    photo for photo in current_photos if photo not in photos_to_delete
                ]
                content.other_photos = photos_to_keep

            await content.save()

            # Delete physical files
            for photo_path in photos_to_delete:
                full_path = photo_path
                if os.path.exists(full_path):
                    os.remove(full_path)

            return {"message": "Photos deleted successfully"}

    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Content not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
