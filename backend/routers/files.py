from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from models import *
from helpers.user_helper import get_current_user
from typing import List
import os
import secrets
from datetime import datetime

router = APIRouter()

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'xlsx', 'xls', 'pptx'}  # Yalnızca izin verilen dosya türleri

def allowed_file(filename: str) -> bool:
    """Dosya uzantısını kontrol et."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@router.post("/file")
async def upload_files(
    order_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user)
):
    # Verify if the order exists
    order = await Order.get(id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.customer_id != current_user.id and current_user.privilege != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized to upload files for this order")

    saved_files = []

    # Define the directory where files will be saved
    UPLOAD_DIRECTORY = "static/uploads/files/"

    # Ensure the upload directory exists
    if not os.path.exists(UPLOAD_DIRECTORY):
        os.makedirs(UPLOAD_DIRECTORY)

    for file in files:
        # Check if the file extension is allowed
        if not allowed_file(file.filename):
            raise HTTPException(status_code=400, detail="Invalid file type. Only PDF, Word, and Excel files are allowed.")

        # Generate a unique file name using timestamp and user ID
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = file.filename.split(".")[-1]
        file_name = f"{timestamp}_{current_user.id}_{secrets.token_hex(4)}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIRECTORY, file_name)

        # Save the file
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Save the file record in the database
        file_obj = await Files.create(order=order, path=file_path)
        saved_files.append(await file_pydantic.from_tortoise_orm(file_obj))

        # Add the file path to the Order's JSON field (make sure it's a list)
        if isinstance(order.files, list):
            order.files.append(file_obj.path)
        else:
            order.files = [file_obj.path]

    # Save the updated Order with the new file paths
    await order.save()

    return {"status": "success", "files": saved_files, "file_paths": order.files}

@router.get("/files/{order_id}")
async def get_files(order_id: int, current_user: User = Depends(get_current_user)):
    # Verify if the order exists
    order = await Order.get(id=order_id).prefetch_related('file_set')
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check if the user has permission to view the order's files
    if order.customer_id != current_user.id and current_user.privilege != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized to view files for this order")

    # Get all files associated with the order
    files = await Files.filter(order=order).all()

    # Return the list of file paths
    return {"status": "success", "files": [file.path for file in files]}

@router.delete("/files/{order_id}/{file_name}")
async def delete_file(
    order_id: int,
    file_name: str,
    current_user: User = Depends(get_current_user)
):
    # Verify if the order exists
    order = await Order.get(id=order_id).prefetch_related('file_set')
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check if the user has permission to delete the file
    if order.customer_id != current_user.id and current_user.privilege != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete files for this order")

    # Find the specific file by its name
    file = await Files.filter(order=order, path__contains=file_name).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    # Define the path to the file in the file system
    UPLOAD_DIRECTORY = "static/uploads/files/"
    file_path = os.path.join(UPLOAD_DIRECTORY, file.path)

    # Delete the file from the file system
    if os.path.exists(file_path):
        os.remove(file_path)

    # Remove the file record from the database
    await file.delete()

    # Remove the file path from the order's JSON field
    if file.path in order.files:
        order.files.remove(file.path)
        await order.save()

    return {"status": "success", "message": f"File '{file_name}' for order {order_id} has been deleted"}