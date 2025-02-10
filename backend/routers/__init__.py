from .admin_order import router as admin_order_router
from .admin_user import router as admin_user_router
from .cardpostals import router as cardpostals_router
from .coupon import router as coupon_router
from .envelope_colors import router as envelope_colors_router
from .envelope_smell import router as envelope_smell_router
from .order import router as order_router
from .paper_colors import router as paper_colors_router
from .photo import router as photo_router
from .shipment_type import router as shipment_type_router
from .token import router as token_router
from .user import router as user_router
from .verification import router as verification_router
from .blog import router as blog_router
from .menu_links import router as menu_links_router
from .sss import router as sss_router
from .comments import router as comment_router
from .content import router as content_router
from .envelope_schemas import router as schema_router
from .city import router as city_router
from .jail import router as jail_router
from .town import router as town_router
from .prices import router as prices_router
from .features import router as feature_router
from .files import router as files_router
from .status import router as status_router

# Group routers for easy inclusion
routers = [
    admin_order_router,
    admin_user_router,
    cardpostals_router,
    coupon_router,
    envelope_colors_router,
    envelope_smell_router,
    order_router,
    paper_colors_router,
    photo_router,
    shipment_type_router,
    token_router,
    user_router,
    verification_router,
    blog_router,
    menu_links_router,
    sss_router,
    comment_router,
    content_router,
    schema_router,
    city_router,
    jail_router,
    town_router,
    prices_router,
    feature_router,
    files_router,
    status_router
]
