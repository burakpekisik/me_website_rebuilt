from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from routers import routers  # Import the routers list
# Authentication
from authentication import *
from fastapi.middleware.cors import CORSMiddleware

# image uplaod
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Allow CORS for your frontend domain (replace with your frontend URL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods like GET, POST, OPTIONS, etc.
    allow_headers=["*"],  # Allows all headers
)

# static file config
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def index():
    return {"Message": "Hello World"}

register_tortoise(
    app,
    db_url="sqlite://database.sqlite3",
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)

for router in routers:
    app.include_router(router)

#uvicorn main:app --host 0.0.0.0 --port 80
