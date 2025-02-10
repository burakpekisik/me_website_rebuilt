from tortoise import Tortoise, fields, Model
from datetime import datetime
import pytz


class User(Model):
    id = fields.IntField(pk=True, index=True)
    name = fields.CharField(max_length=50, null=False, unique=False, default="")
    surname = fields.CharField(max_length=50, null=False, unique=False, default="")
    email = fields.CharField(max_length=200, null=False, unique=True, default="")
    phone_number = fields.CharField(max_length=50, null=False, unique=True, default="")
    password = fields.CharField(max_length=100, null=False, default="")
    is_verified = fields.BooleanField(default=False)
    join_date = fields.DatetimeField(default=datetime.now)
    privilege = fields.CharField(max_length=20, default="Müşteri")


class Order(Model):
    id = fields.IntField(pk=True, index=True)

    # General Info
    date = fields.DatetimeField(
        default=lambda: datetime.now(pytz.timezone("Europe/Istanbul"))
    )
    customer_name = fields.CharField(max_length=100)
    customer_id = fields.IntField(max_length=50)

    # Sender Info
    sender_name = fields.CharField(max_length=50, default="")
    sender_surname = fields.CharField(max_length=50, default="")
    sender_city = fields.CharField(max_length=50, default="")
    sender_district = fields.CharField(max_length=50, default="")
    sender_address = fields.TextField(default="")

    # Receiver Info
    receiver_name = fields.CharField(max_length=50, default="")
    receiver_surname = fields.CharField(max_length=50, default="")
    receiver_city = fields.CharField(max_length=50, default="")
    receiver_phone = fields.CharField(max_length=50, default="")
    jail_name = fields.CharField(max_length=100, default="")
    jail_address = fields.TextField(default="")
    father_name = fields.CharField(max_length=50, default="")
    ward_id = fields.CharField(max_length=50, default="")

    # Order Info
    letter_type = fields.CharField(max_length=30, default="Cezaevine Mektup")
    order_price = fields.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = fields.CharField(
        max_length=100, default="Sipariş Bekleniyor"
    )  # Default value
    envelope_text = fields.TextField(null=True, default="")
    envelope_color = fields.CharField(max_length=30, default="")
    paper_color = fields.CharField(max_length=30, default="")
    cardpostals = fields.JSONField(default=[])
    photos = fields.JSONField(default=[])  # Store photo paths in JSON format
    files = fields.JSONField(default=[])  # Store file paths in JSON format
    smell = fields.CharField(max_length=50, default="")
    shipment_type = fields.CharField(max_length=50, default="")
    tax = fields.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = fields.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipment_date = fields.CharField(max_length=50, default="")
    add_date = fields.IntField(default=1)
    track_id = fields.CharField(max_length=50, default="")
    track_link = fields.TextField(default="")


class Photo(Model):
    id = fields.IntField(pk=True, index=True)
    path = fields.CharField(max_length=255)  # Path to the photo
    order = fields.ForeignKeyField("models.Order", related_name="photo_set")


class Files(Model):
    id = fields.IntField(pk=True, index=True)
    path = fields.CharField(max_length=255)  # Path to the photo
    order = fields.ForeignKeyField("models.Order", related_name="file_set")


class EnvelopeColors(Model):
    id = fields.IntField(pk=True, index=True)
    color_name = fields.CharField(max_length=30, null=False, unique=False)
    color_code = fields.CharField(max_length=30, null=False, unique=False)
    color_price = fields.DecimalField(max_digits=10, decimal_places=2)


class PaperColors(Model):
    id = fields.IntField(pk=True, index=True)
    color_name = fields.CharField(max_length=30, null=False, unique=False)
    color_code = fields.CharField(max_length=30, null=False, unique=False)
    color_price = fields.DecimalField(max_digits=10, decimal_places=2)


class EnvelopeSmell(Model):
    id = fields.IntField(pk=True, index=True)
    smell_name = fields.CharField(max_length=50, null=False, unique=False)
    smell_price = fields.DecimalField(max_digits=10, decimal_places=2)


class ShipmentType(Model):
    id = fields.IntField(pk=True, index=True)
    type_name = fields.CharField(max_length=50, null=False, unique=False)
    type_description = fields.CharField(max_length=200, null=False, unique=False)
    shipment_price = fields.DecimalField(max_digits=10, decimal_places=2)


class Coupons(Model):
    id = fields.IntField(pk=True, index=True)
    coupon_code = fields.CharField(max_length=50, unique=True)
    discount_rate = fields.DecimalField(max_digits=10, decimal_places=2)
    smell_discount = fields.BooleanField(default=False)
    photo_discount = fields.IntField(default=0)
    cardpostal_discount = fields.IntField(default=0)
    discount_description = fields.TextField(default="")
    is_active = fields.BooleanField(default=True)
    start_date = fields.DatetimeField()
    end_date = fields.DatetimeField()
    users = fields.ManyToManyField("models.User", related_name="coupons")


# Category Modeli
class Category(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255, unique=True)


# Cardpostal Modeli
class Cardpostal(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=255)
    category = fields.ForeignKeyField("models.Category", related_name="cardpostals")
    image_path = fields.CharField(max_length=255)


# Your Blog model definition
class Blog(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    slug = fields.CharField(max_length=255, unique=True)
    text = fields.TextField()
    icon = fields.CharField(max_length=255, null=True)  # Path to icon image
    main_photo = fields.CharField(max_length=255, null=True)  # Path to main photo
    other_photos = fields.JSONField(default=[])  # Path to main photo
    created_at = fields.DatetimeField(auto_now_add=True)


class SSS(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    slug = fields.CharField(max_length=255, unique=True)
    text = fields.TextField()
    created_at = fields.DatetimeField(auto_now_add=True)


class Content(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    slug = fields.CharField(max_length=255, unique=True)
    text = fields.TextField()
    main_photo = fields.CharField(max_length=255, null=True)  # Path to main photo
    other_photos = fields.JSONField(default=[])  # Path to main photo
    created_at = fields.DatetimeField(auto_now_add=True)


class MenuLinks(Model):
    id = fields.IntField(pk=True)
    menu_name = fields.CharField(max_length=255)
    menu_url = fields.CharField(max_length=255)
    target_window = fields.CharField(max_length=50, default="this_window")
    menu_group = fields.CharField(max_length=50, default="navbar")

    is_dropdown = fields.BooleanField(default=False)
    dropdown_items = fields.JSONField(
        null=True, default=[]
    )  # Assuming dropdown_items will be a list

    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)


class Comment(Model):
    id = fields.IntField(pk=True)
    created_at = fields.DatetimeField(default=datetime.now)
    title = fields.TextField()
    text = fields.TextField()
    star = fields.IntField()  # 1-5 arası bir değer olmasını bekliyoruz.
    customer_name = fields.CharField(max_length=100)
    customer_id = fields.IntField()


class EnvelopeSchemas(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    text = fields.TextField()
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)


class City(Model):
    city_id = fields.IntField(pk=True)  # Ensure this is a primary key field
    country_id = fields.IntField()
    city_name = fields.TextField()
    plate_no = fields.IntField()
    phone_code = fields.TextField()


class Jail(Model):
    id = fields.IntField(pk=True)
    city_id = fields.IntField()
    name = fields.TextField()
    address = fields.TextField()
    type = fields.IntField()


class Town(Model):
    town_id = fields.IntField(pk=True)
    city_id = fields.IntField()
    town_name = fields.TextField()


class Prices(Model):
    id = fields.IntField(pk=True)
    price_name = fields.CharField(max_length=100, unique=True)
    price_description = fields.TextField()
    price_value = fields.DecimalField(max_digits=10, decimal_places=3)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)


class Features(Model):
    id = fields.IntField(pk=True)
    feature_name = fields.CharField(max_length=100, unique=True)
    feature_logo = fields.CharField(max_length=255)
    feature_description = fields.TextField()
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)


# Pydantic modelleri oluşturulması
from tortoise.contrib.pydantic import pydantic_model_creator

user_pydantic = pydantic_model_creator(User, name="User", exclude=("is_verified",))
user_pydanticIn = pydantic_model_creator(
    User,
    name="UserIn",
    exclude=(
        "id",
        "join_date",
        "privilege",
    ),
)
user_pydanticOut = pydantic_model_creator(User, name="UserOut", exclude=("password",))

order_pydantic = pydantic_model_creator(Order, name="Order")
order_pydanticIn = pydantic_model_creator(
    Order,
    name="OrderIn",
    exclude=(
        "id",
        "customer_name",
        "customer_id",
        "date",
    ),
)
order_pydanticOut = pydantic_model_creator(Order, name="OrderOut")

envelope_color_pydantic = pydantic_model_creator(EnvelopeColors, name="EnvelopeColor")
envelope_color_pydanticIn = pydantic_model_creator(
    EnvelopeColors, name="EnvelopeColorIn", exclude=("id",)
)
paper_color_pydantic = pydantic_model_creator(PaperColors, name="PaperColor")
paper_color_pydanticIn = pydantic_model_creator(
    PaperColors, name="PaperColorIn", exclude=("id",)
)
envelope_smell_pydantic = pydantic_model_creator(
    EnvelopeSmell, name="EnvelopeSmell", exclude=("id",)
)
shipment_type_pydantic = pydantic_model_creator(
    ShipmentType, name="ShipmentType", exclude=("id",)
)

photo_pydantic = pydantic_model_creator(Photo, name="Photo", exclude=("id",))
file_pydantic = pydantic_model_creator(Files, name="Files", exclude=("id",))

# Coupon Pydantic Models
coupon_pydantic = pydantic_model_creator(Coupons, name="Coupon", exclude=("id",))
coupon_pydanticIn = pydantic_model_creator(
    Coupons, name="CouponIn", exclude_readonly=True, exclude=("id", "users")
)
coupon_pydanticOut = pydantic_model_creator(
    Coupons, name="CouponOut", exclude=("id", "users")
)

# Generate Pydantic models for Blog
Blog_Pydantic = pydantic_model_creator(Blog, name="Blog")
BlogIn_Pydantic = pydantic_model_creator(
    Blog, name="BlogIn", exclude_readonly=True, exclude=("slug", "icon", "main_photo")
)

SSS_Pydantic = pydantic_model_creator(SSS, name="SSS")
SSSIn_Pydantic = pydantic_model_creator(
    SSS, name="SSSIn", exclude_readonly=True, exclude=("slug",)
)

Content_Pydantic = pydantic_model_creator(Content, name="Content")
ContentIn_Pydantic = pydantic_model_creator(
    Content,
    name="ContentIn",
    exclude_readonly=True,
    exclude=("slug", "main_photo", "other_photos"),
)

EnvelopeSchemas_Pydantic = pydantic_model_creator(
    EnvelopeSchemas, name="EnvelopeSchemas"
)
EnvelopeSchemasIn_Pydantic = pydantic_model_creator(
    EnvelopeSchemas, name="EnvelopeSchemasIn", exclude_readonly=True, exclude=("id",)
)
EnvelopeSchemasOut_Pydantic = pydantic_model_creator(
    EnvelopeSchemas, name="EnvelopeSchemasOut"
)

MenuLinks_Pydantic = pydantic_model_creator(MenuLinks, name="MenuLink")
MenuLinksIn_Pydantic = pydantic_model_creator(
    MenuLinks, name="MenuLinkIn", exclude_readonly=True, exclude=("id",)
)
MenuLinksOut_Pydantic = pydantic_model_creator(MenuLinks, name="MenuLinkOut")

Comment_Pydantic = pydantic_model_creator(Comment, name="Comment")
CommentIn_Pydantic = pydantic_model_creator(
    Comment,
    name="CommentIn",
    exclude_readonly=True,
    exclude=(
        "created_at",
        "customer_name",
        "customer_id",
    ),
)
CommentInAdmin_Pydantic = pydantic_model_creator(
    Comment,
    name="CommentIn",
    exclude_readonly=True,
    exclude=("created_at",),
)

city_pydantic = pydantic_model_creator(City, name="City")
city_pydanticIn = pydantic_model_creator(City, name="CityIn", exclude=("city_id",))
jail_pydantic = pydantic_model_creator(Jail, name="Jail")
jail_pydanticIn = pydantic_model_creator(Jail, name="JailIn", exclude=("id",))
town_pydantic = pydantic_model_creator(Town, name="Town")
town_pydanticIn = pydantic_model_creator(Town, name="Town", exclude=("town_id",))

prices_pydantic = pydantic_model_creator(Prices, name="Prices")
prices_pydanticIn = pydantic_model_creator(
    Prices, name="PricesIn", exclude=("id", "created_at", "updated_at")
)

features_pydantic = pydantic_model_creator(Features, name="Features")
features_pydanticIn = pydantic_model_creator(
    Features, name="FeaturesIn", exclude=("id", "created_at", "updated_at")
)
