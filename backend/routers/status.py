from fastapi import APIRouter, Depends, HTTPException
from tortoise import Tortoise
from models import User, Order, City, Town, Jail, Photo, Coupons, Comment
from datetime import datetime, timedelta
from tortoise.exceptions import DoesNotExist
from helpers.user_helper import get_current_admin_user

router = APIRouter()

@router.get("/status")
async def get_status():
    # Date ranges for calculations
    today = datetime.now()
    this_week_start = today - timedelta(days=today.weekday())
    this_month_start = today.replace(day=1)
    this_year_start = today.replace(month=1, day=1)
    
    # Query total counts
    total_users = await User.all().count()
    total_orders = await Order.all().count()
    total_cities = await City.all().count()
    total_towns = await Town.all().count()
    total_jails = await Jail.all().count()
    total_photos = await Photo.all().count()
    active_coupons = await Coupons.filter(is_active=True).count()
    
    # Query comments and calculate average stars
    comments = await Comment.all()
    average_star_rating = sum(comment.star for comment in comments) / len(comments) if comments else 0

    # Calculate new users (based on join date)
    new_users_today = await User.filter(join_date__gte=today).count()
    new_users_this_week = await User.filter(join_date__gte=this_week_start).count()
    new_users_this_month = await User.filter(join_date__gte=this_month_start).count()
    new_users_this_year = await User.filter(join_date__gte=this_year_start).count()
    
    # Calculate new orders (based on order date)
    new_orders_today = await Order.filter(date__gte=today).count()
    new_orders_this_week = await Order.filter(date__gte=this_week_start).count()
    new_orders_this_month = await Order.filter(date__gte=this_month_start).count()
    new_orders_this_year = await Order.filter(date__gte=this_year_start).count()
    
    # Calculate revenue for the current and past periods
    last_month_start = (today.replace(day=1) - timedelta(days=1)).replace(day=1)
    last_week_start = today - timedelta(days=today.weekday() + 7)
    last_year_start = today.replace(year=today.year - 1)

    # Revenue calculations using a loop-based sum
    revenue_last_month = sum(order.order_price for order in await Order.filter(date__gte=last_month_start, date__lt=this_month_start))
    revenue_this_month = sum(order.order_price for order in await Order.filter(date__gte=this_month_start))
    revenue_last_week = sum(order.order_price for order in await Order.filter(date__gte=last_week_start, date__lt=this_week_start))
    revenue_this_week = sum(order.order_price for order in await Order.filter(date__gte=this_week_start))
    revenue_last_year = sum(order.order_price for order in await Order.filter(date__gte=last_year_start, date__lt=this_year_start))
    revenue_this_year = sum(order.order_price for order in await Order.filter(date__gte=this_year_start))

    # Calculate percentage changes
    percent_change_month = 0 if not revenue_last_month else ((revenue_this_month - revenue_last_month) / revenue_last_month) * 100
    percent_change_week = 0 if not revenue_last_week else ((revenue_this_week - revenue_last_week) / revenue_last_week) * 100
    percent_change_year = 0 if not revenue_last_year else ((revenue_this_year - revenue_last_year) / revenue_last_year) * 100
    
    # Return status data
    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "total_cities": total_cities,
        "total_towns": total_towns,
        "total_jails": total_jails,
        "total_photos": total_photos,
        "active_coupons": active_coupons,
        "average_star_rating": average_star_rating,
        
        # New user stats
        "new_users_today": new_users_today,
        "new_users_this_week": new_users_this_week,
        "new_users_this_month": new_users_this_month,
        "new_users_this_year": new_users_this_year,
        
        # New order stats
        "new_orders_today": new_orders_today,
        "new_orders_this_week": new_orders_this_week,
        "new_orders_this_month": new_orders_this_month,
        "new_orders_this_year": new_orders_this_year,

        # Revenue stats
        "revenue_current_month": revenue_this_month,
        "revenue_last_month": revenue_last_month,
        "revenue_this_week": revenue_this_week,
        "revenue_last_week": revenue_last_week,
        "revenue_current_year": revenue_this_year,
        "revenue_last_year": revenue_last_year,
        
        # Revenue percentage change
        "revenue_month_percentage": percent_change_month,
        "revenue_week_percentage": percent_change_week,
        "revenue_year_percentage": percent_change_year,
        
    }
