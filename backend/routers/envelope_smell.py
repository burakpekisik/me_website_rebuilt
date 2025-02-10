from fastapi import APIRouter, Depends
from models import *
from helpers.user_helper import get_current_admin_user

# Authentication
from authentication import *

router = APIRouter()

# POST and GET methods for EnvelopeSmell
@router.post("/envelope_smell", response_model=envelope_smell_pydantic)
async def create_envelope_smell(envelope_smell: envelope_smell_pydantic, current_user: User = Depends(get_current_admin_user)):
    return await EnvelopeSmell.create(**envelope_smell.dict())

@router.get("/envelope_smell", response_model=list[envelope_smell_pydantic])
async def get_envelope_smell():
    return await EnvelopeSmell.all()