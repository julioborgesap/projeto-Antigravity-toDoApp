from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from routes.auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/", response_model=List[schemas.TaskOut])
def get_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Task).filter(models.Task.user_id == current_user.id).all()

@router.post("/", response_model=schemas.TaskOut)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Handle category check
    if task.category_id:
        category = db.query(models.Category).filter(models.Category.id == task.category_id, models.Category.user_id == current_user.id).first()
        if not category:
            raise HTTPException(status_code=400, detail="Category not found or doesn't belong to you")
            
    # Handle tags
    db_tags = []
    if task.tags:
        for tag_name in task.tags:
            tag_name_lower = tag_name.lower().strip()
            db_tag = db.query(models.Tag).filter(models.Tag.name == tag_name_lower).first()
            if not db_tag:
                db_tag = models.Tag(name=tag_name_lower)
                db.add(db_tag)
                db.commit()
                db.refresh(db_tag)
            db_tags.append(db_tag)
            
    new_task = models.Task(
        title=task.title,
        description=task.description,
        due_date=task.due_date,
        priority=task.priority,
        is_completed=task.is_completed,
        category_id=task.category_id,
        user_id=current_user.id
    )
    new_task.tags = db_tags
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.put("/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: int, task_update: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task_query = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == current_user.id)
    task = task_query.first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    # Update simple fields
    task.title = task_update.title
    task.description = task_update.description
    task.due_date = task_update.due_date
    task.priority = task_update.priority
    task.is_completed = task_update.is_completed
    task.category_id = task_update.category_id
    
    # Update tags
    db_tags = []
    if task_update.tags:
        for tag_name in task_update.tags:
            tag_name_lower = tag_name.lower().strip()
            db_tag = db.query(models.Tag).filter(models.Tag.name == tag_name_lower).first()
            if not db_tag:
                db_tag = models.Tag(name=tag_name_lower)
                db.add(db_tag)
                db.commit()
                db.refresh(db_tag)
            db_tags.append(db_tag)
    task.tags = db_tags
    
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    task_query = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == current_user.id)
    task = task_query.first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task_query.delete(synchronize_session=False)
    db.commit()
    return {"message": "Task deleted successfully"}

@router.get("/categories", response_model=List[schemas.CategoryOut])
def get_categories(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Category).filter(models.Category.user_id == current_user.id).all()

@router.post("/categories", response_model=schemas.CategoryOut)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    new_cat = models.Category(name=category.name, user_id=current_user.id)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat
