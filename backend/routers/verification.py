from fastapi import APIRouter, Request
from models import *
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

# Authentication
from authentication import *

router = APIRouter()

templates = Jinja2Templates(directory="templates")

@router.get("/verification", response_class=HTMLResponse)
async def email_verification(request: Request, token: str):
    user = await very_token(token)
    if user and not user.is_verified:
        user.is_verified = True
        await user.save()
        return templates.TemplateResponse(
            "verification.html", {"request": request, "name": user.name}
        )
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )