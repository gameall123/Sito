from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

app = FastAPI(title="Gaming E-commerce API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL")
client = MongoClient(MONGO_URL)
db = client.gaming_ecommerce

# Collections
users_collection = db.users
products_collection = db.products
categories_collection = db.categories
carts_collection = db.carts
wishlists_collection = db.wishlists
reviews_collection = db.reviews
orders_collection = db.orders

# Security
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Pydantic Models
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    is_admin: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class Product(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    price: float
    image_url: str
    category_id: str
    platform: List[str]  # PC, PlayStation, Xbox, Nintendo
    genre: List[str]
    rating: str  # E, T, M, etc.
    release_date: datetime
    developer: str
    publisher: str
    in_stock: int
    featured: bool = False
    average_rating: float = 0.0
    total_reviews: int = 0

class Category(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    image_url: str

class CartItem(BaseModel):
    product_id: str
    quantity: int

class WishlistItem(BaseModel):
    product_id: str

class Review(BaseModel):
    id: Optional[str] = None
    user_id: str
    product_id: str
    rating: int  # 1-5 stars
    comment: str
    created_at: Optional[datetime] = None

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = users_collection.find_one({"username": username})
    if user is None:
        raise credentials_exception
    return user

# Routes

@app.get("/")
async def root():
    return {"message": "Gaming E-commerce API"}

# Authentication Routes
@app.post("/api/auth/register", response_model=UserResponse)
async def register(user: UserCreate):
    # Check if user exists
    if users_collection.find_one({"$or": [{"username": user.username}, {"email": user.email}]}):
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    user_doc = {
        "id": user_id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "is_admin": False,
        "created_at": datetime.utcnow()
    }
    users_collection.insert_one(user_doc)
    
    return UserResponse(**user_doc)

@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_collection.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return UserResponse(**current_user)

# Categories Routes
@app.get("/api/categories", response_model=List[Category])
async def get_categories():
    categories = list(categories_collection.find())
    return [Category(**cat) for cat in categories]

@app.post("/api/categories", response_model=Category)
async def create_category(category: Category, current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    category.id = str(uuid.uuid4())
    category_doc = category.dict()
    categories_collection.insert_one(category_doc)
    return category

# Products Routes
@app.get("/api/products", response_model=List[Product])
async def get_products(category: Optional[str] = None, platform: Optional[str] = None, 
                      genre: Optional[str] = None, featured: Optional[bool] = None,
                      limit: int = 20, skip: int = 0):
    query = {}
    if category:
        query["category_id"] = category
    if platform:
        query["platform"] = {"$in": [platform]}
    if genre:
        query["genre"] = {"$in": [genre]}
    if featured is not None:
        query["featured"] = featured
    
    products = list(products_collection.find(query).skip(skip).limit(limit))
    return [Product(**prod) for prod in products]

@app.get("/api/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = products_collection.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return Product(**product)

@app.post("/api/products", response_model=Product)
async def create_product(product: Product, current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    product.id = str(uuid.uuid4())
    product_doc = product.dict()
    products_collection.insert_one(product_doc)
    return product

@app.put("/api/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product: Product, current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    product.id = product_id
    result = products_collection.update_one({"id": product_id}, {"$set": product.dict()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str, current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = products_collection.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

# Cart Routes
@app.get("/api/cart")
async def get_cart(current_user: dict = Depends(get_current_user)):
    cart = carts_collection.find_one({"user_id": current_user["id"]})
    if not cart:
        return {"items": [], "total": 0}
    
    # Get product details for each cart item
    items_with_details = []
    total = 0
    for item in cart.get("items", []):
        product = products_collection.find_one({"id": item["product_id"]})
        if product:
            item_total = product["price"] * item["quantity"]
            items_with_details.append({
                "product": Product(**product),
                "quantity": item["quantity"],
                "subtotal": item_total
            })
            total += item_total
    
    return {"items": items_with_details, "total": total}

@app.post("/api/cart/add")
async def add_to_cart(item: CartItem, current_user: dict = Depends(get_current_user)):
    cart = carts_collection.find_one({"user_id": current_user["id"]})
    
    if not cart:
        cart = {"user_id": current_user["id"], "items": []}
    
    # Check if item already in cart
    existing_item = None
    for cart_item in cart.get("items", []):
        if cart_item["product_id"] == item.product_id:
            existing_item = cart_item
            break
    
    if existing_item:
        existing_item["quantity"] += item.quantity
    else:
        cart.setdefault("items", []).append({"product_id": item.product_id, "quantity": item.quantity})
    
    carts_collection.update_one(
        {"user_id": current_user["id"]},
        {"$set": cart},
        upsert=True
    )
    
    return {"message": "Item added to cart"}

@app.put("/api/cart/update")
async def update_cart_item(item: CartItem, current_user: dict = Depends(get_current_user)):
    cart = carts_collection.find_one({"user_id": current_user["id"]})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    for cart_item in cart.get("items", []):
        if cart_item["product_id"] == item.product_id:
            cart_item["quantity"] = item.quantity
            break
    else:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    carts_collection.update_one({"user_id": current_user["id"]}, {"$set": cart})
    return {"message": "Cart updated"}

@app.delete("/api/cart/remove/{product_id}")
async def remove_from_cart(product_id: str, current_user: dict = Depends(get_current_user)):
    cart = carts_collection.find_one({"user_id": current_user["id"]})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    cart["items"] = [item for item in cart.get("items", []) if item["product_id"] != product_id]
    carts_collection.update_one({"user_id": current_user["id"]}, {"$set": cart})
    return {"message": "Item removed from cart"}

# Wishlist Routes
@app.get("/api/wishlist")
async def get_wishlist(current_user: dict = Depends(get_current_user)):
    wishlist = wishlists_collection.find_one({"user_id": current_user["id"]})
    if not wishlist:
        return {"items": []}
    
    # Get product details
    products = []
    for item in wishlist.get("items", []):
        product = products_collection.find_one({"id": item["product_id"]})
        if product:
            products.append(Product(**product))
    
    return {"items": products}

@app.post("/api/wishlist/add")
async def add_to_wishlist(item: WishlistItem, current_user: dict = Depends(get_current_user)):
    wishlist = wishlists_collection.find_one({"user_id": current_user["id"]})
    
    if not wishlist:
        wishlist = {"user_id": current_user["id"], "items": []}
    
    # Check if already in wishlist
    for wishlist_item in wishlist.get("items", []):
        if wishlist_item["product_id"] == item.product_id:
            return {"message": "Item already in wishlist"}
    
    wishlist.setdefault("items", []).append({"product_id": item.product_id})
    wishlists_collection.update_one(
        {"user_id": current_user["id"]},
        {"$set": wishlist},
        upsert=True
    )
    
    return {"message": "Item added to wishlist"}

@app.delete("/api/wishlist/remove/{product_id}")
async def remove_from_wishlist(product_id: str, current_user: dict = Depends(get_current_user)):
    wishlist = wishlists_collection.find_one({"user_id": current_user["id"]})
    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")
    
    wishlist["items"] = [item for item in wishlist.get("items", []) if item["product_id"] != product_id]
    wishlists_collection.update_one({"user_id": current_user["id"]}, {"$set": wishlist})
    return {"message": "Item removed from wishlist"}

# Reviews Routes
@app.get("/api/products/{product_id}/reviews", response_model=List[Review])
async def get_product_reviews(product_id: str):
    reviews = list(reviews_collection.find({"product_id": product_id}))
    return [Review(**review) for review in reviews]

@app.post("/api/products/{product_id}/reviews", response_model=Review)
async def create_review(product_id: str, review: Review, current_user: dict = Depends(get_current_user)):
    # Check if user already reviewed this product
    existing_review = reviews_collection.find_one({"user_id": current_user["id"], "product_id": product_id})
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this product")
    
    review.id = str(uuid.uuid4())
    review.user_id = current_user["id"]
    review.product_id = product_id
    review.created_at = datetime.utcnow()
    
    review_doc = review.dict()
    reviews_collection.insert_one(review_doc)
    
    # Update product average rating
    reviews = list(reviews_collection.find({"product_id": product_id}))
    avg_rating = sum(r["rating"] for r in reviews) / len(reviews)
    products_collection.update_one(
        {"id": product_id},
        {"$set": {"average_rating": avg_rating, "total_reviews": len(reviews)}}
    )
    
    return review

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)