from fastapi import APIRouter, Depends, HTTPException
from models import *
from helpers.user_helper import get_current_user, get_current_admin_user

router = APIRouter()


@router.post("/comments", response_model=Comment_Pydantic)
async def create_comment(
    comment: CommentIn_Pydantic, current_user: User = Depends(get_current_user)
):
    # Kullanıcının en az bir siparişinin olup olmadığını kontrol et
    orders = await Order.filter(customer_id=current_user.id)

    # Kullanıcının en az bir siparişinin durumu "Sipariş Bekleniyor"dan farklı mı kontrol et
    if not orders or all(order.status == "Sipariş Bekleniyor" for order in orders):
        raise HTTPException(
            status_code=403,
            detail="You must have made at least one order that is not in 'Pending' status to leave a comment.",
        )

    # Yorumu oluştur
    comment_obj = await Comment.create(
        title=comment.title,
        text=comment.text,
        star=comment.star,
        customer_name=current_user.name,
        customer_id=current_user.id,
    )
    return await Comment_Pydantic.from_tortoise_orm(comment_obj)


@router.post("/admin/comments", response_model=Comment_Pydantic)
async def admin_create_comment(
    comment: CommentInAdmin_Pydantic,
    current_user: User = Depends(get_current_admin_user),
):
    try:
        comment_obj = await Comment.create(
            title=comment.title,
            text=comment.text,
            star=comment.star,
            customer_name=comment.customer_name,  # Admin can set any customer name
            customer_id=(
                comment.customer_id if comment.customer_id else None
            ),  # Optional customer_id
        )
        return await Comment_Pydantic.from_tortoise_orm(comment_obj)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating comment: {str(e)}")


@router.put("/admin/comments/{comment_id}", response_model=Comment_Pydantic)
async def update_comment(
    comment_id: int,
    comment_data: CommentInAdmin_Pydantic,
    current_user: User = Depends(get_current_admin_user),
):
    comment_obj = await Comment.filter(id=comment_id).first()
    if not comment_obj:
        raise HTTPException(status_code=404, detail="Comment not found")

    try:
        # Yorumun verilerini güncelle
        await comment_obj.update_from_dict(comment_data.dict(exclude_unset=True))
        await comment_obj.save()
        return await Comment_Pydantic.from_tortoise_orm(comment_obj)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error updating comment: {str(e)}")


@router.delete("/admin/comments/{comment_id}", response_model=dict)
async def delete_comment(
    comment_id: int, current_user: User = Depends(get_current_admin_user)
):
    comment_obj = await Comment.filter(id=comment_id).first()
    if not comment_obj:
        raise HTTPException(status_code=404, detail="Comment not found")

    try:
        await comment_obj.delete()
        return {"detail": "Comment deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting comment: {str(e)}")


@router.get("/comments", response_model=list[Comment_Pydantic])
async def get_comments():
    # Fetch all comments as a queryset, without awaiting
    comments = Comment.all()
    return await Comment_Pydantic.from_queryset(comments)
