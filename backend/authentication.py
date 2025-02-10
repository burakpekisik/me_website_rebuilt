from passlib.context import CryptContext
from fastapi.exceptions import HTTPException
import jwt
from dotenv import dotenv_values
from models import User
from fastapi import status

config_credential = dotenv_values(".env")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hashed_password(password):
    return pwd_context.hash(password)


async def very_token(token: str):
    try:
        payload = jwt.decode(token, config_credential["SECRET"], algorithms=["HS256"])
        user = await User.get(id=payload.get("id"))
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


async def authenticate_user(email, password):
    user = await User.get(email=email)

    is_true = await verify_password(password, user.password)

    if user and is_true:
        return user
    return False


async def token_generator(email: str, password: str):
    user = await authenticate_user(email, password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = {
        "id": user.id,
        "email": user.email,
    }

    token = jwt.encode(token_data, config_credential["SECRET"], algorithm="HS256")

    return token
