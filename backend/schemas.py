from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from models import PriorityEnum

# -- Tags --
class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class TagOut(TagBase):
    id: int
    class Config:
        from_attributes = True

# -- Categories --
class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryOut(CategoryBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# -- Tasks --
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: PriorityEnum = PriorityEnum.MEDIA
    is_completed: bool = False
    category_id: Optional[int] = None

class TaskCreate(TaskBase):
    tags: Optional[List[str]] = []

class TaskOut(TaskBase):
    id: int
    created_at: datetime
    user_id: int
    tags: List[TagOut] = []
    
    class Config:
        from_attributes = True

# -- Users --
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True

# -- Dashboard --
class DashboardMetrics(BaseModel):
    total_tasks: int
    completed_today: int
    overdue_tasks: int
    pending_urgent: int
