import random
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import User, Item, SessionLocal, engine
from datetime import datetime
from typing import List


app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://194.169.163.65",
        "http://localhost",
        "http://localhost:3000",
        "http://127.0.0.1",
        #"https://site-test-deploy1.ru",
    ],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Схемы для запроса и ответа
class UserCreate(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str

# Pydantic model for request data
class ItemCreate(BaseModel):
    task: str
    day: str
    iduser: str

# Pydantic model for response data
class ItemResponse(BaseModel):
    id: int
    task: str
    day: str
    iduser: str

# Функция для получения базы данных
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пользователь уже существует")

    new_user = User(username=user.username, password=user.password)  # В реальном приложении используйте хэширование паролей
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users", response_model=List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()  # Запрос всех пользователей из базы данных
    return users


@app.post("/login")
async def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username, User.password == user.password).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверное имя пользователя или пароль")
    return {"message": f"Добро пожаловать, {user.username}!"}



@app.post("/items", response_model=ItemResponse)
async def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    new_user = Item(task=item.task, day=item.day, iduser=item.iduser)  # В реальном приложении используйте хэширование паролей
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user



@app.get("/items", response_model=List[ItemResponse])
async def get_items(iduser: str, db: Session = Depends(get_db)):
    items = db.query(Item).filter(Item.iduser == iduser).all()
    if not items:
        raise HTTPException(status_code=404, detail="Items not found")
    return items


@app.delete("/items", response_model=dict)
def delete_item(task: str, day: str, iduser: str, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.task == task, Item.day == day, Item.iduser == iduser).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return {"detail": "Item deleted successfully"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
