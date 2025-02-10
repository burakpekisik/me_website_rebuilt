from fastapi import APIRouter, Depends
from models import *
from helpers.user_helper import get_current_admin_user

# Authentication
from authentication import *

router = APIRouter()

# POST and GET methods for ShipmentType
@router.post("/shipment_type", response_model=shipment_type_pydantic)
async def create_shipment_type(shipment_type: shipment_type_pydantic, current_user: User = Depends(get_current_admin_user)):
    return await ShipmentType.create(**shipment_type.dict())

@router.get("/shipment_type", response_model=list[shipment_type_pydantic])
async def get_shipment_type():
    return await ShipmentType.all()