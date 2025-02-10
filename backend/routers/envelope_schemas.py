from fastapi import APIRouter, Depends, HTTPException
from models import *
from tortoise.exceptions import DoesNotExist
from helpers.user_helper import get_current_admin_user, get_current_user

router = APIRouter()

# GET route: Verileri kullanıcı bazlı listele
@router.get("/schemas", response_model=list[EnvelopeSchemasOut_Pydantic])
async def get_envelope_schemas():
    return await EnvelopeSchemasOut_Pydantic.from_queryset(EnvelopeSchemas.all())

# POST route: Yeni veri oluşturma (sadece admin)
@router.post("/schemas", response_model=EnvelopeSchemasOut_Pydantic)
async def create_envelope_schema(schema: EnvelopeSchemasIn_Pydantic, admin_user=Depends(get_current_admin_user)):
    schema_obj = await EnvelopeSchemas.create(**schema.dict())
    return await EnvelopeSchemasOut_Pydantic.from_tortoise_orm(schema_obj)

# PUT route: Var olan veriyi güncelleme (sadece admin)
@router.put("/schemas/{schema_id}", response_model=EnvelopeSchemasOut_Pydantic)
async def update_envelope_schema(schema_id: int, schema_data: EnvelopeSchemasIn_Pydantic, admin_user=Depends(get_current_admin_user)):
    try:
        schema_obj = await EnvelopeSchemas.get(id=schema_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Envelope schema not found")
    
    await schema_obj.update_from_dict(schema_data.dict())
    await schema_obj.save()
    return await EnvelopeSchemasOut_Pydantic.from_tortoise_orm(schema_obj)

# DELETE route: Var olan veriyi silme (sadece admin)
@router.delete("/schemas/{schema_id}")
async def delete_envelope_schema(schema_id: int, admin_user=Depends(get_current_admin_user)):
    try:
        schema_obj = await EnvelopeSchemas.get(id=schema_id)
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Envelope schema not found")
    
    await schema_obj.delete()
    return {"detail": "Envelope schema deleted successfully"}
