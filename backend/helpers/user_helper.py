from fastapi import HTTPException, status, Depends

# Authentication
from authentication import *
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, config_credential["SECRET"], algorithms=["HS256"])
        user = await User.get(id=payload.get("id"))
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return await user

async def get_current_admin_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, config_credential["SECRET"], algorithms=["HS256"])
        user = await User.get(id=payload.get("id"))
        if user.privilege != "Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted. Admin privileges required.",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return await user