from fastapi import FastAPI, APIRouter, HTTPException, Query, Body, UploadFile, File
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Media directory for uploaded files
MEDIA_ROOT = ROOT_DIR / "media"
MEDIA_ROOT.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="SyncBeds CMS API", version="1.0.0")

# Serve uploaded media files (must still be under /api for ingress rules)
app.mount("/api/media", StaticFiles(directory=MEDIA_ROOT), name="media")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ==================== ENUMS ====================

class BlogStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"

class ContentType(str, Enum):
    PAGE = "page"
    SECTION = "section"
    FAQ = "faq"
    TESTIMONIAL = "testimonial"
    PRICING = "pricing"


# ==================== BLOG MODELS ====================

class BlogPostBase(BaseModel):
    title: Dict[str, str]  # {"en": "...", "hr": "...", "de": "..."}
    slug: str
    excerpt: Dict[str, str]
    content: Dict[str, str]
    category: str
    featured_image: Optional[str] = None
    tags: List[str] = []
    status: BlogStatus = BlogStatus.DRAFT
    author: str = "SyncBeds Team"

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostUpdate(BaseModel):
    title: Optional[Dict[str, str]] = None
    excerpt: Optional[Dict[str, str]] = None
    content: Optional[Dict[str, str]] = None
    category: Optional[str] = None
    featured_image: Optional[str] = None
    tags: Optional[List[str]] = None
    status: Optional[BlogStatus] = None
    author: Optional[str] = None

class BlogPost(BlogPostBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== CONTACT MODELS ====================

class ContactMessageCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class ContactMessage(ContactMessageCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read: bool = False


# ==================== NEWSLETTER MODELS ====================

class NewsletterSubscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    active: bool = True


# ==================== CMS CONTENT MODELS ====================

class CMSContentBase(BaseModel):
    content_type: ContentType
    key: str  # unique identifier for the content (e.g., "hero", "faq_1")
    content: Dict[str, Any]  # flexible content structure with translations

class CMSContentCreate(CMSContentBase):
    pass

class CMSContentUpdate(BaseModel):
    content: Optional[Dict[str, Any]] = None

class CMSContent(CMSContentBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== TESTIMONIAL MODELS ====================

class TestimonialBase(BaseModel):
    name: str
    company: str
    location: str
    text: Dict[str, str]  # translations
    avatar_url: Optional[str] = None
    order: int = 0
    active: bool = True

class TestimonialCreate(TestimonialBase):
    pass

class Testimonial(TestimonialBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== FAQ MODELS ====================

class FAQBase(BaseModel):
    question: Dict[str, str]
    answer: Dict[str, str]
    category: str = "general"
    order: int = 0
    active: bool = True

class FAQCreate(FAQBase):
    pass

class FAQ(FAQBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== PAGE MODELS ====================

class PageSectionBase(BaseModel):
    section_type: str  # hero, features, cta, content, etc.
    order: int = 0
    visible: bool = True
    content: Dict[str, Any]  # Flexible content with translations

class PageSection(PageSectionBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class PageBase(BaseModel):
    slug: str  # URL path like "home", "about", "pricing"
    title: Dict[str, str]  # Page title in multiple languages
    meta_description: Optional[Dict[str, str]] = None
    sections: List[PageSection] = []
    published: bool = True
    is_system_page: bool = False  # System pages can't be deleted

class PageCreate(BaseModel):
    slug: str
    title: Dict[str, str]
    meta_description: Optional[Dict[str, str]] = None
    sections: List[Dict[str, Any]] = []
    published: bool = True

class PageUpdate(BaseModel):
    title: Optional[Dict[str, str]] = None
    meta_description: Optional[Dict[str, str]] = None
    sections: Optional[List[Dict[str, Any]]] = None
    published: Optional[bool] = None

class Page(PageBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== MENU MODELS ====================

class MenuItemBase(BaseModel):
    label: Dict[str, str]  # Label in multiple languages
    url: str  # Internal path or external URL
    target: str = "_self"  # _self or _blank
    order: int = 0
    visible: bool = True
    parent_id: Optional[str] = None  # For nested menus
    children: List[Any] = []

class MenuItem(MenuItemBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class MenuBase(BaseModel):
    name: str  # Menu identifier like "main", "footer"
    items: List[MenuItem] = []

class MenuCreate(BaseModel):
    name: str
    items: List[Dict[str, Any]] = []

class MenuUpdate(BaseModel):
    items: Optional[List[Dict[str, Any]]] = None

class Menu(MenuBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== HELPER FUNCTIONS ====================

def serialize_datetime(doc: dict) -> dict:
    """Convert datetime objects to ISO strings for MongoDB"""
    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
    return doc

def deserialize_datetime(doc: dict, fields: List[str]) -> dict:
    """Convert ISO strings back to datetime objects"""
    for field in fields:
        if field in doc and isinstance(doc[field], str):
            doc[field] = datetime.fromisoformat(doc[field])
    return doc


# ==================== BLOG API ROUTES ====================

@api_router.get("/blog/posts", response_model=List[BlogPost])
async def get_blog_posts(
    status: Optional[BlogStatus] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=10, le=100),
    offset: int = 0
):
    """Get all blog posts with optional filtering"""
    query = {}
    if status:
        query["status"] = status.value
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"title.en": {"$regex": search, "$options": "i"}},
            {"title.hr": {"$regex": search, "$options": "i"}},
            {"title.de": {"$regex": search, "$options": "i"}},
            {"content.en": {"$regex": search, "$options": "i"}},
        ]
    
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    
    for post in posts:
        deserialize_datetime(post, ["created_at", "updated_at"])
    
    return posts

@api_router.get("/blog/posts/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str):
    """Get a single blog post by ID"""
    post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    deserialize_datetime(post, ["created_at", "updated_at"])
    return post

@api_router.get("/blog/posts/slug/{slug}", response_model=BlogPost)
async def get_blog_post_by_slug(slug: str):
    """Get a single blog post by slug"""
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    deserialize_datetime(post, ["created_at", "updated_at"])
    return post

@api_router.post("/blog/posts", response_model=BlogPost, status_code=201)
async def create_blog_post(post_data: BlogPostCreate):
    """Create a new blog post"""
    # Check if slug already exists
    existing = await db.blog_posts.find_one({"slug": post_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    post = BlogPost(**post_data.model_dump())
    doc = serialize_datetime(post.model_dump())
    await db.blog_posts.insert_one(doc)
    return post

@api_router.put("/blog/posts/{post_id}", response_model=BlogPost)
async def update_blog_post(post_id: str, post_data: BlogPostUpdate):
    """Update a blog post"""
    existing = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    update_data = {k: v for k, v in post_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    
    updated = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    deserialize_datetime(updated, ["created_at", "updated_at"])
    return updated

@api_router.delete("/blog/posts/{post_id}")
async def delete_blog_post(post_id: str):
    """Delete a blog post"""
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted successfully"}

@api_router.get("/blog/categories")
async def get_blog_categories():
    """Get all unique blog categories"""
    categories = await db.blog_posts.distinct("category")
    return {"categories": categories}


# ==================== CONTACT API ROUTES ====================

@api_router.post("/contact", response_model=ContactMessage, status_code=201)
async def submit_contact_form(message_data: ContactMessageCreate):
    """Submit a contact form message"""
    message = ContactMessage(**message_data.model_dump())
    doc = serialize_datetime(message.model_dump())
    await db.contact_messages.insert_one(doc)
    return message

@api_router.get("/contact/messages", response_model=List[ContactMessage])
async def get_contact_messages(
    read: Optional[bool] = None,
    limit: int = Query(default=50, le=200),
    offset: int = 0
):
    """Get all contact messages (admin)"""
    query = {}
    if read is not None:
        query["read"] = read
    
    messages = await db.contact_messages.find(query, {"_id": 0}).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    
    for msg in messages:
        deserialize_datetime(msg, ["created_at"])
    
    return messages

@api_router.put("/contact/messages/{message_id}/read")
async def mark_message_read(message_id: str, read: bool = True):
    """Mark a contact message as read/unread"""
    result = await db.contact_messages.update_one({"id": message_id}, {"$set": {"read": read}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message updated successfully"}


# ==================== NEWSLETTER API ROUTES ====================

@api_router.post("/newsletter/subscribe", status_code=201)
async def subscribe_newsletter(email: EmailStr = Body(..., embed=True)):
    """Subscribe to newsletter"""
    existing = await db.newsletter_subscriptions.find_one({"email": email})
    if existing:
        if existing.get("active"):
            return {"message": "Already subscribed"}
        else:
            await db.newsletter_subscriptions.update_one({"email": email}, {"$set": {"active": True}})
            return {"message": "Subscription reactivated"}
    
    subscription = NewsletterSubscription(email=email)
    doc = serialize_datetime(subscription.model_dump())
    await db.newsletter_subscriptions.insert_one(doc)
    return {"message": "Successfully subscribed"}

@api_router.post("/newsletter/unsubscribe")
async def unsubscribe_newsletter(email: EmailStr = Body(..., embed=True)):
    """Unsubscribe from newsletter"""
    result = await db.newsletter_subscriptions.update_one(
        {"email": email}, 
        {"$set": {"active": False}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Email not found")
    return {"message": "Successfully unsubscribed"}

@api_router.get("/newsletter/subscribers")
async def get_newsletter_subscribers(active_only: bool = True):
    """Get all newsletter subscribers (admin)"""
    query = {"active": True} if active_only else {}
    subscribers = await db.newsletter_subscriptions.find(query, {"_id": 0}).to_list(10000)
    return {"subscribers": subscribers, "count": len(subscribers)}




# ==================== PAGE API ROUTES ====================

@api_router.get("/pages", response_model=List[Page])
async def get_pages(published_only: bool = True):
    """Get all pages (optionally only published)"""
    query: Dict[str, Any] = {}
    if published_only:
        query["published"] = True

    pages = await db.pages.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for page in pages:
        deserialize_datetime(page, ["created_at", "updated_at"])
    return pages


@api_router.get("/pages/slug/{slug}", response_model=Page)
async def get_page_by_slug(slug: str):
    """Get a single page by slug"""
    page = await db.pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    deserialize_datetime(page, ["created_at", "updated_at"])
    return page


@api_router.get("/pages/{page_id}", response_model=Page)
async def get_page(page_id: str):
    """Get a single page by ID (admin)"""
    page = await db.pages.find_one({"id": page_id}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    deserialize_datetime(page, ["created_at", "updated_at"])
    return page


@api_router.post("/pages", response_model=Page, status_code=201)
async def create_page(page_data: PageCreate):
    """Create a new page"""
    # Ensure slug is unique
    existing = await db.pages.find_one({"slug": page_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    # Normalize sections into PageSection objects
    sections: List[PageSection] = []
    for section in page_data.sections or []:
        sections.append(PageSection(**section))

    page = Page(
        slug=page_data.slug,
        title=page_data.title,
        meta_description=page_data.meta_description,
        sections=sections,
        published=page_data.published,
        is_system_page=False,
    )

    doc = serialize_datetime(page.model_dump())
    await db.pages.insert_one(doc)
    return page


@api_router.put("/pages/{page_id}", response_model=Page)
async def update_page(page_id: str, page_data: PageUpdate):
    """Update an existing page"""
    existing = await db.pages.find_one({"id": page_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Page not found")

    update_data: Dict[str, Any] = {}

    if page_data.title is not None:
        update_data["title"] = page_data.title
    if page_data.meta_description is not None:
        update_data["meta_description"] = page_data.meta_description
    if page_data.sections is not None:
        normalized_sections: List[Dict[str, Any]] = []
        for section in page_data.sections:
            normalized_sections.append(PageSection(**section).model_dump())
        update_data["sections"] = normalized_sections
    if page_data.published is not None:
        update_data["published"] = page_data.published

    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.pages.update_one({"id": page_id}, {"$set": update_data})

    updated = await db.pages.find_one({"id": page_id}, {"_id": 0})
    deserialize_datetime(updated, ["created_at", "updated_at"])
    return updated


@api_router.delete("/pages/{page_id}")
async def delete_page(page_id: str):
    """Delete a page (system pages cannot be deleted)"""
    existing = await db.pages.find_one({"id": page_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Page not found")

    if existing.get("is_system_page"):
        raise HTTPException(status_code=400, detail="System pages cannot be deleted")

    result = await db.pages.delete_one({"id": page_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Page not found")

    return {"message": "Page deleted successfully"}


# ==================== MENU API ROUTES ====================

@api_router.get("/menus", response_model=List[Menu])
async def get_menus():
    """Get all menus"""
    menus = await db.menus.find({}, {"_id": 0}).sort("created_at", 1).to_list(100)
    for menu in menus:
        deserialize_datetime(menu, ["created_at", "updated_at"])
    return menus


@api_router.get("/menus/{name}", response_model=Menu)
async def get_menu_by_name(name: str):
    """Get a single menu by name (e.g. 'header', 'mobile', 'footer')"""
    menu = await db.menus.find_one({"name": name}, {"_id": 0})
    if not menu:
        raise HTTPException(status_code=404, detail="Menu not found")
    deserialize_datetime(menu, ["created_at", "updated_at"])
    return menu


@api_router.post("/menus", response_model=Menu, status_code=201)
async def create_menu(menu_data: MenuCreate):
    """Create a new menu"""
    existing = await db.menus.find_one({"name": menu_data.name})
    if existing:
        raise HTTPException(status_code=400, detail="Menu with this name already exists")

    items: List[MenuItem] = []
    for item in menu_data.items or []:
        items.append(MenuItem(**item))

    menu = Menu(
        name=menu_data.name,
        items=items,
    )

    doc = serialize_datetime(menu.model_dump())
    await db.menus.insert_one(doc)
    return menu


@api_router.put("/menus/{name}", response_model=Menu)
async def update_menu(name: str, menu_data: MenuUpdate):
    """Update menu items for a given menu name"""
    existing = await db.menus.find_one({"name": name}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Menu not found")

    update_data: Dict[str, Any] = {}

    if menu_data.items is not None:
        normalized_items: List[Dict[str, Any]] = []
        for item in menu_data.items:
            normalized_items.append(MenuItem(**item).model_dump())
        update_data["items"] = normalized_items

    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    await db.menus.update_one({"name": name}, {"$set": update_data})

    updated = await db.menus.find_one({"name": name}, {"_id": 0})
    deserialize_datetime(updated, ["created_at", "updated_at"])
    return updated


@api_router.delete("/menus/{name}")
async def delete_menu(name: str):
    """Delete a menu"""
    result = await db.menus.delete_one({"name": name})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Menu not found")
    return {"message": "Menu deleted successfully"}

# ==================== CMS CONTENT API ROUTES ====================

@api_router.get("/cms/content", response_model=List[CMSContent])
async def get_all_cms_content(content_type: Optional[ContentType] = None):
    """Get all CMS content, optionally filtered by type"""
    query = {}
    if content_type:
        query["content_type"] = content_type.value
    
    content = await db.cms_content.find(query, {"_id": 0}).to_list(1000)
    for item in content:
        deserialize_datetime(item, ["created_at", "updated_at"])
    return content

@api_router.get("/cms/content/{key}", response_model=CMSContent)
async def get_cms_content(key: str):
    """Get CMS content by key"""
    content = await db.cms_content.find_one({"key": key}, {"_id": 0})
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    deserialize_datetime(content, ["created_at", "updated_at"])
    return content

@api_router.post("/cms/content", response_model=CMSContent, status_code=201)
async def create_cms_content(content_data: CMSContentCreate):
    """Create new CMS content"""
    existing = await db.cms_content.find_one({"key": content_data.key})
    if existing:
        raise HTTPException(status_code=400, detail="Content with this key already exists")
    
    content = CMSContent(**content_data.model_dump())
    doc = serialize_datetime(content.model_dump())
    await db.cms_content.insert_one(doc)
    return content

@api_router.put("/cms/content/{key}", response_model=CMSContent)
async def update_cms_content(key: str, content_data: CMSContentUpdate):
    """Update CMS content"""
    existing = await db.cms_content.find_one({"key": key}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Content not found")
    
    update_data = {k: v for k, v in content_data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.cms_content.update_one({"key": key}, {"$set": update_data})
    
    updated = await db.cms_content.find_one({"key": key}, {"_id": 0})
    deserialize_datetime(updated, ["created_at", "updated_at"])
    return updated

@api_router.delete("/cms/content/{key}")
async def delete_cms_content(key: str):
    """Delete CMS content"""
    result = await db.cms_content.delete_one({"key": key})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Content not found")
    return {"message": "Content deleted successfully"}


# ==================== TESTIMONIALS API ROUTES ====================

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(active_only: bool = True):
    """Get all testimonials"""
    query = {"active": True} if active_only else {}
    testimonials = await db.testimonials.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    for t in testimonials:
        deserialize_datetime(t, ["created_at"])
    return testimonials

@api_router.post("/testimonials", response_model=Testimonial, status_code=201)
async def create_testimonial(testimonial_data: TestimonialCreate):
    """Create a new testimonial"""
    testimonial = Testimonial(**testimonial_data.model_dump())
    doc = serialize_datetime(testimonial.model_dump())
    await db.testimonials.insert_one(doc)
    return testimonial

@api_router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, testimonial_data: TestimonialCreate):
    """Update a testimonial"""
    existing = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    update_data = testimonial_data.model_dump()
    await db.testimonials.update_one({"id": testimonial_id}, {"$set": update_data})
    
    updated = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    deserialize_datetime(updated, ["created_at"])
    return updated

@api_router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    """Delete a testimonial"""
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}


# ==================== AUTH (ADMIN) ====================

class AdminLoginRequest(BaseModel):
    username: str
    password: str


@api_router.post("/auth/login")
async def admin_login(credentials: AdminLoginRequest):
    """Simple admin login using env-configured credentials (MVP)"""
    expected_user = os.environ.get("CMS_ADMIN_USERNAME", "admin")
    expected_pass = os.environ.get("CMS_ADMIN_PASSWORD", "admin123")

    if credentials.username == expected_user and credentials.password == expected_pass:
        return {"success": True}

    raise HTTPException(status_code=401, detail="Invalid credentials")


# ==================== FAQ API ROUTES ====================

@api_router.get("/faqs", response_model=List[FAQ])
async def get_faqs(category: Optional[str] = None,
                   active_only: bool = True):
    """Get all FAQs"""
    query = {}
    if active_only:
        query["active"] = True
    if category:
        query["category"] = category
    
    faqs = await db.faqs.find(query, {"_id": 0}).sort("order", 1).to_list(100)
    for f in faqs:
        deserialize_datetime(f, ["created_at"])
    return faqs

@api_router.post("/faqs", response_model=FAQ, status_code=201)
async def create_faq(faq_data: FAQCreate):
    """Create a new FAQ"""
    faq = FAQ(**faq_data.model_dump())
    doc = serialize_datetime(faq.model_dump())
    await db.faqs.insert_one(doc)
    return faq

@api_router.put("/faqs/{faq_id}", response_model=FAQ)
async def update_faq(faq_id: str, faq_data: FAQCreate):
    """Update a FAQ"""
    existing = await db.faqs.find_one({"id": faq_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    update_data = faq_data.model_dump()
    await db.faqs.update_one({"id": faq_id}, {"$set": update_data})
    
    updated = await db.faqs.find_one({"id": faq_id}, {"_id": 0})
    deserialize_datetime(updated, ["created_at"])
    return updated

@api_router.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: str):
    """Delete a FAQ"""
    result = await db.faqs.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted successfully"}


# ==================== SEED DATA ROUTE ====================

@api_router.post("/seed")
async def seed_initial_data():
    """Seed initial data for the CMS"""
    # Check if already seeded
    existing_posts = await db.blog_posts.count_documents({})
    if existing_posts > 0:
        return {"message": "Data already seeded"}
    
    # Seed blog posts
    blog_posts = [
        {
            "id": str(uuid.uuid4()),
            "title": {
                "en": "Days of Private Renters",
                "hr": "Dani privatnih iznajmljivača",
                "de": "Tage der privaten Vermieter"
            },
            "slug": "days-of-private-renters",
            "excerpt": {
                "en": "In the fast-growing tourism sector, numerous new technological innovations make it easier to manage apartments for private renters every day.",
                "hr": "U brzorastućem turističkom sektoru, brojne nove tehnološke inovacije olakšavaju upravljanje apartmanima za privatne iznajmljivače svaki dan.",
                "de": "Im schnell wachsenden Tourismussektor erleichtern zahlreiche neue technologische Innovationen die Verwaltung von Apartments für private Vermieter."
            },
            "content": {
                "en": "<p>In the fast-growing tourism sector, numerous new technological innovations make it easier to manage apartments for private renters every day. That is why the relevant technological partners have gathered in one place to present the latest technologies from the world of tourism.</p><h2>The Future of Property Management</h2><p>As the vacation rental market continues to evolve, property owners need to stay ahead of the curve by adopting new technologies that streamline operations and enhance guest experiences.</p>",
                "hr": "<p>U brzorastućem turističkom sektoru, brojne nove tehnološke inovacije olakšavaju upravljanje apartmanima za privatne iznajmljivače svaki dan.</p><h2>Budućnost upravljanja nekretninama</h2><p>Kako se tržište kratkoročnog iznajmljivanja nastavlja razvijati, vlasnici nekretnina moraju biti u koraku s novim tehnologijama.</p>",
                "de": "<p>Im schnell wachsenden Tourismussektor erleichtern zahlreiche neue technologische Innovationen die Verwaltung von Apartments für private Vermieter.</p><h2>Die Zukunft der Immobilienverwaltung</h2><p>Da sich der Ferienwohnungsmarkt weiterentwickelt, müssen Immobilienbesitzer neue Technologien einsetzen.</p>"
            },
            "category": "general",
            "featured_image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
            "tags": ["tourism", "technology", "private-renters"],
            "status": "published",
            "author": "SyncBeds Team",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": {
                "en": "Choosing the Best Channel Manager for Your Business",
                "hr": "Odabir najboljeg Channel Managera za vaše poslovanje",
                "de": "Die Wahl des besten Channel Managers für Ihr Unternehmen"
            },
            "slug": "choosing-best-channel-manager",
            "excerpt": {
                "en": "Choosing the right channel manager is an important step in developing a successful accommodation rental business.",
                "hr": "Odabir pravog channel managera važan je korak u razvoju uspješnog poslovanja iznajmljivanja smještaja.",
                "de": "Die Wahl des richtigen Channel Managers ist ein wichtiger Schritt bei der Entwicklung eines erfolgreichen Vermietungsgeschäfts."
            },
            "content": {
                "en": "<p>A channel manager is an essential tool for any property owner or manager who lists their accommodations on multiple booking platforms.</p><h2>What to Look for in a Channel Manager</h2><p>When evaluating channel managers, consider integration capabilities, real-time synchronization, ease of use, and pricing.</p>",
                "hr": "<p>Channel manager je ključan alat za svakog vlasnika ili upravitelja nekretnina koji oglašava smještaj na više booking platformi.</p><h2>Što tražiti u Channel Manageru</h2><p>Pri evaluaciji razmotrite mogućnosti integracije, sinkronizaciju u stvarnom vremenu i jednostavnost korištenja.</p>",
                "de": "<p>Ein Channel Manager ist ein unverzichtbares Werkzeug für jeden Immobilienbesitzer, der seine Unterkünfte auf mehreren Buchungsplattformen anbietet.</p><h2>Worauf bei einem Channel Manager achten</h2><p>Berücksichtigen Sie Integrationsfähigkeiten, Echtzeit-Synchronisation und Benutzerfreundlichkeit.</p>"
            },
            "category": "channel-manager",
            "featured_image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
            "tags": ["channel-manager", "booking", "business"],
            "status": "published",
            "author": "SyncBeds Team",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": {
                "en": "How to Increase Direct Bookings for Your Vacation Rental",
                "hr": "Kako povećati izravne rezervacije za vaš apartman",
                "de": "So steigern Sie Direktbuchungen für Ihre Ferienwohnung"
            },
            "slug": "increase-direct-bookings",
            "excerpt": {
                "en": "Reduce reliance on OTAs and boost direct reservations with smart pricing, a high-converting website, and strategic marketing.",
                "hr": "Smanjite ovisnost o OTA-ima i povećajte izravne rezervacije pametnim cijenama i strateškim marketingom.",
                "de": "Reduzieren Sie die Abhängigkeit von OTAs und steigern Sie Direktbuchungen mit intelligenter Preisgestaltung."
            },
            "content": {
                "en": "<p>While platforms like Airbnb and Booking.com provide excellent visibility, their commission fees can significantly eat into your profits.</p><h2>Build a Professional Website</h2><p>Your website is your digital storefront. A well-designed, mobile-responsive website can convert visitors into guests.</p>",
                "hr": "<p>Iako platforme poput Airbnb i Booking.com pružaju izvrsnu vidljivost, njihove provizije mogu značajno smanjiti vaš profit.</p><h2>Izradite profesionalnu web stranicu</h2><p>Vaša web stranica je vaša digitalna izložba.</p>",
                "de": "<p>Während Plattformen wie Airbnb und Booking.com hervorragende Sichtbarkeit bieten, können ihre Provisionsgebühren Ihre Gewinne erheblich schmälern.</p><h2>Erstellen Sie eine professionelle Website</h2><p>Ihre Website ist Ihr digitales Schaufenster.</p>"
            },
            "category": "website",
            "featured_image": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop",
            "tags": ["direct-bookings", "website", "marketing"],
            "status": "published",
            "author": "SyncBeds Team",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]

    # Seed core pages (system pages)
    pages = [
        {
            "id": str(uuid.uuid4()),
            "slug": "home",
            "title": {
                "en": "Home",
                "hr": "Naslovnica",
                "de": "Startseite",
            },
            "meta_description": {
                "en": "SyncBeds - channel manager and PMS for private renters and property managers.",
                "hr": "SyncBeds - channel manager i PMS za privatne iznajmljivače i upravitelje smještaja.",
                "de": "SyncBeds - Channel Manager und PMS für Vermieter und Verwalter.",
            },
            "sections": [],
            "published": True,
            "is_system_page": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "about",
            "title": {
                "en": "About Us",
                "hr": "O nama",
                "de": "Über uns",
            },
            "meta_description": {
                "en": "Learn more about SyncBeds and our mission.",
                "hr": "Saznajte više o SyncBedsu i našoj misiji.",
                "de": "Erfahren Sie mehr über SyncBeds und unsere Mission.",
            },
            "sections": [],
            "published": True,
            "is_system_page": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "pricing",
            "title": {
                "en": "Pricing",
                "hr": "Cijene",
                "de": "Preise",
            },
            "meta_description": {
                "en": "SyncBeds pricing plans.",
                "hr": "SyncBeds cjenovni paketi.",
                "de": "SyncBeds Preismodelle.",
            },
            "sections": [],
            "published": True,
            "is_system_page": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "privacy",
            "title": {
                "en": "Privacy Policy",
                "hr": "Politika privatnosti",
                "de": "Datenschutzerklärung",
            },
            "meta_description": {
                "en": "SyncBeds privacy policy.",
                "hr": "Politika privatnosti SyncBedsa.",
                "de": "Datenschutzerklärung von SyncBeds.",
            },
            "sections": [],
            "published": True,
            "is_system_page": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        },
        {
            "id": str(uuid.uuid4()),
            "slug": "terms",
            "title": {
                "en": "Terms & Conditions",
                "hr": "Uvjeti korištenja",
                "de": "AGB",
            },
            "meta_description": {
                "en": "SyncBeds terms and conditions.",
                "hr": "Uvjeti korištenja SyncBedsa.",
                "de": "Allgemeine Geschäftsbedingungen von SyncBeds.",
            },
            "sections": [],
            "published": True,
            "is_system_page": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        },
    ]

    await db.pages.insert_many(pages)
    
    # Seed testimonials
    testimonials = [
        {
            "id": str(uuid.uuid4()),
            "name": "Michele Trioni",
            "company": "Mediterranean Group",
            "location": "St. Paul's Bay, Malta",
            "text": {
                "en": "SyncBeds has proven to be a great tool that helps me with all my obligations every day. Manage tasks faster and easier, just as I wanted.",
                "hr": "SyncBeds se pokazao kao odličan alat koji mi pomaže u svim svakodnevnim obvezama. Upravljanje zadacima brže i lakše, upravo kako sam želio.",
                "de": "SyncBeds hat sich als großartiges Tool erwiesen, das mir bei all meinen täglichen Aufgaben hilft."
            },
            "order": 1,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Dejan Pejović",
            "company": "Montenegro Villas",
            "location": "Herceg Novi, Montenegro",
            "text": {
                "en": "A good tool that accelerates our communication with guests and automates some business processes.",
                "hr": "Dobar alat koji ubrzava našu komunikaciju s gostima i automatizira neke poslovne procese.",
                "de": "Ein gutes Tool, das unsere Kommunikation mit Gästen beschleunigt und Geschäftsprozesse automatisiert."
            },
            "order": 2,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Martina Majcen",
            "company": "Teatro Studio",
            "location": "Ljubljana, Slovenia",
            "text": {
                "en": "The choice to start using SyncBeds was because they were new on the market. They presented a 'tailor made' product for us.",
                "hr": "Odlučili smo se za SyncBeds jer su bili novi na tržištu. Predstavili su nam 'tailor made' proizvod.",
                "de": "Wir haben uns für SyncBeds entschieden, weil sie neu auf dem Markt waren und uns ein maßgeschneidertes Produkt präsentierten."
            },
            "order": 3,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.testimonials.insert_many(testimonials)
    
    # Seed FAQs
    faqs = [
        {
            "id": str(uuid.uuid4()),
            "question": {
                "en": "What is SyncBeds and how does it help property owners?",
                "hr": "Što je SyncBeds i kako pomaže vlasnicima nekretnina?",
                "de": "Was ist SyncBeds und wie hilft es Immobilienbesitzern?"
            },
            "answer": {
                "en": "SyncBeds is an all-in-one property management solution that helps rental property owners manage their bookings. The platform includes a channel manager, eVisitor integration, a direct booking website, smart apartment features, and more.",
                "hr": "SyncBeds je sveobuhvatno rješenje za upravljanje nekretninama koje pomaže vlasnicima iznajmljivanja u upravljanju njihovim rezervacijama.",
                "de": "SyncBeds ist eine All-in-One-Immobilienverwaltungslösung, die Vermietern hilft, ihre Buchungen zu verwalten."
            },
            "category": "general",
            "order": 1,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "question": {
                "en": "How does the Channel Manager prevent double bookings?",

# ==================== MEDIA UPLOAD API ====================

class MediaUploadResponse(BaseModel):
    url: str
    filename: str


@api_router.post("/media/upload", response_model=MediaUploadResponse)
async def upload_media(file: UploadFile = File(...)):
    """Upload a media file (image) and return a URL that can be used in the CMS.

    Files are stored under /app/backend/media and served via /api/media/{filename}.
    """
    # Basic content-type check (image/*)
    content_type = file.content_type or ""
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are allowed")

    # Create unique filename
    ext = os.path.splitext(file.filename or "")[1] or ".png"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    dest_path = MEDIA_ROOT / unique_name

    # Save file to disk
    try:
        with dest_path.open("wb") as out_file:
            data = await file.read()
            out_file.write(data)
    except Exception as exc:
        logging.exception("Failed to save uploaded file")
        raise HTTPException(status_code=500, detail="Failed to save file") from exc

    # Build URL relative to backend base (frontend will prefix with REACT_APP_BACKEND_URL)
    url = f"/api/media/{unique_name}"
    return MediaUploadResponse(url=url, filename=unique_name)

                "hr": "Kako Channel Manager sprječava dvostruke rezervacije?",
                "de": "Wie verhindert der Channel Manager Doppelbuchungen?"
            },
            "answer": {
                "en": "The channel manager synchronizes your calendar across all platforms in real-time, ensuring that when a booking is made on one platform, the availability is instantly updated on all others.",
                "hr": "Channel manager sinkronizira vaš kalendar na svim platformama u stvarnom vremenu.",
                "de": "Der Channel Manager synchronisiert Ihren Kalender in Echtzeit über alle Plattformen."
            },
            "category": "channel-manager",
            "order": 2,
            "active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.faqs.insert_many(faqs)
    
    return {"message": "Initial data seeded successfully", "blog_posts": len(blog_posts), "testimonials": len(testimonials), "faqs": len(faqs)}


@api_router.post("/seed/pages-menus")
async def seed_pages_and_menus():
    """Seed core pages and menus if they don't exist yet"""
    created = {"pages": 0, "menus": 0}

    existing_pages = await db.pages.count_documents({})
    existing_menus = await db.menus.count_documents({})

    if existing_pages == 0:
        pages = [
            {
                "id": str(uuid.uuid4()),
                "slug": "home",
                "title": {"en": "Home", "hr": "Naslovnica", "de": "Startseite"},
                "meta_description": {
                    "en": "SyncBeds - channel manager and PMS for private renters and property managers.",
                    "hr": "SyncBeds - channel manager i PMS za privatne iznajmljivače i upravitelje smještaja.",
                    "de": "SyncBeds - Channel Manager und PMS für Vermieter und Verwalter.",
                },
                "sections": [],
                "published": True,
                "is_system_page": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "about",
                "title": {"en": "About Us", "hr": "O nama", "de": "Über uns"},
                "meta_description": {
                    "en": "Learn more about SyncBeds and our mission.",
                    "hr": "Saznajte više o SyncBedsu i našoj misiji.",
                    "de": "Erfahren Sie mehr über SyncBeds und unsere Mission.",
                },
                "sections": [],
                "published": True,
                "is_system_page": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "pricing",
                "title": {"en": "Pricing", "hr": "Cijene", "de": "Preise"},
                "meta_description": {
                    "en": "SyncBeds pricing plans.",
                    "hr": "SyncBeds cjenovni paketi.",
                    "de": "SyncBeds Preismodelle.",
                },
                "sections": [],
                "published": True,
                "is_system_page": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "privacy",
                "title": {"en": "Privacy Policy", "hr": "Politika privatnosti", "de": "Datenschutzerklärung"},
                "meta_description": {
                    "en": "SyncBeds privacy policy.",
                    "hr": "Politika privatnosti SyncBedsa.",
                    "de": "Datenschutzerklärung von SyncBeds.",
                },
                "sections": [],
                "published": True,
                "is_system_page": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "terms",
                "title": {"en": "Terms & Conditions", "hr": "Uvjeti korištenja", "de": "AGB"},
                "meta_description": {
                    "en": "SyncBeds terms and conditions.",
                    "hr": "Uvjeti korištenja SyncBedsa.",
                    "de": "Allgemeine Geschäftsbedingungen von SyncBeds.",
                },
                "sections": [],
                "published": True,
                "is_system_page": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            # Feature pages
            {
                "id": str(uuid.uuid4()),
                "slug": "channel-manager",
                "title": {"en": "Channel Manager", "hr": "Channel Manager", "de": "Channel Manager"},
                "meta_description": {
                    "en": "Sync all your OTA channels in real-time.",
                    "hr": "Sinkronizirajte sve OTA kanale u stvarnom vremenu.",
                    "de": "Synchronisieren Sie alle OTA-Kanäle in Echtzeit.",
                },
                "sections": [
                    {
                        "id": str(uuid.uuid4()),
                        "section_type": "hero",
                        "order": 0,
                        "visible": True,
                        "content": {
                            "headline": {
                                "en": "One Channel Manager to Rule Them All",
                                "hr": "Jedan Channel Manager za sve",
                                "de": "Ein Channel Manager für alles"
                            },
                            "body": {
                                "en": "Connect with Booking.com, Airbnb, Expedia and 200+ OTAs. Sync availability, rates and bookings in real-time.",
                                "hr": "Povežite se s Booking.com, Airbnb, Expedia i 200+ OTA platformi. Sinkronizirajte raspoloživost, cijene i rezervacije u stvarnom vremenu.",
                                "de": "Verbinden Sie sich mit Booking.com, Airbnb, Expedia und über 200 OTAs. Synchronisieren Sie Verfügbarkeit, Preise und Buchungen in Echtzeit."
                            }
                        }
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "section_type": "content",
                        "order": 1,
                        "visible": True,
                        "content": {
                            "body": {
                                "en": "Our channel manager automatically updates all your listings across every platform. No more manual updates, no more double bookings.",
                                "hr": "Naš channel manager automatski ažurira sve vaše oglase na svim platformama. Nema više ručnih ažuriranja, nema duplih rezervacija.",
                                "de": "Unser Channel Manager aktualisiert automatisch alle Ihre Einträge auf allen Plattformen. Keine manuellen Updates mehr, keine Doppelbuchungen."
                            }
                        }
                    }
                ],
                "published": True,
                "is_system_page": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "evisitor",
                "title": {"en": "eVisitor Integration", "hr": "eVisitor Integracija", "de": "eVisitor Integration"},
                "meta_description": {
                    "en": "Automatic guest registration for Croatian tourism.",
                    "hr": "Automatska prijava gostiju za hrvatski turizam.",
                    "de": "Automatische Gästeregistrierung für kroatischen Tourismus.",
                },
                "sections": [
                    {
                        "id": str(uuid.uuid4()),
                        "section_type": "hero",
                        "order": 0,
                        "visible": True,
                        "content": {
                            "headline": {
                                "en": "Automatic eVisitor Registration",
                                "hr": "Automatska eVisitor prijava",
                                "de": "Automatische eVisitor-Registrierung"
                            },
                            "body": {
                                "en": "Save hours of manual work. Guest data is automatically sent to the Croatian tourist board.",
                                "hr": "Uštedite sate ručnog rada. Podaci gostiju automatski se šalju u eVisitor sustav.",
                                "de": "Sparen Sie Stunden manueller Arbeit. Gästedaten werden automatisch an den kroatischen Tourismusverband gesendet."
                            }
                        }
                    }
                ],
                "published": True,
                "is_system_page": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "website",
                "title": {"en": "Website Builder", "hr": "Web graditelj", "de": "Website-Builder"},
                "meta_description": {
                    "en": "Create your own booking website without coding.",
                    "hr": "Kreirajte vlastitu stranicu za rezervacije bez programiranja.",
                    "de": "Erstellen Sie Ihre eigene Buchungswebsite ohne Programmierung.",
                },
                "sections": [
                    {
                        "id": str(uuid.uuid4()),
                        "section_type": "hero",
                        "order": 0,
                        "visible": True,
                        "content": {
                            "headline": {
                                "en": "Build Your Direct Booking Website",
                                "hr": "Izgradite stranicu za direktne rezervacije",
                                "de": "Erstellen Sie Ihre Direktbuchungswebsite"
                            },
                            "body": {
                                "en": "Accept direct bookings and reduce OTA commissions. No coding required.",
                                "hr": "Primajte direktne rezervacije i smanjite OTA provizije. Nije potrebno programiranje.",
                                "de": "Akzeptieren Sie Direktbuchungen und reduzieren Sie OTA-Provisionen. Keine Programmierung erforderlich."
                            }
                        }
                    }
                ],
                "published": True,
                "is_system_page": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
            {
                "id": str(uuid.uuid4()),
                "slug": "smart-apartment",
                "title": {"en": "Smart Apartment", "hr": "Smart Apartment", "de": "Smart Apartment"},
                "meta_description": {
                    "en": "Mobile app for property management on the go.",
                    "hr": "Mobilna aplikacija za upravljanje objektima u pokretu.",
                    "de": "Mobile App für die Immobilienverwaltung unterwegs.",
                },
                "sections": [
                    {
                        "id": str(uuid.uuid4()),
                        "section_type": "hero",
                        "order": 0,
                        "visible": True,
                        "content": {
                            "headline": {
                                "en": "Manage Properties From Your Phone",
                                "hr": "Upravljajte objektima s telefona",
                                "de": "Verwalten Sie Immobilien von Ihrem Telefon"
                            },
                            "body": {
                                "en": "Full control over your properties from anywhere. Check-in guests, manage bookings, track revenue.",
                                "hr": "Potpuna kontrola nad objektima s bilo kojeg mjesta. Prijava gostiju, upravljanje rezervacijama, praćenje prihoda.",
                                "de": "Volle Kontrolle über Ihre Immobilien von überall. Gäste einchecken, Buchungen verwalten, Einnahmen verfolgen."
                            }
                        }
                    }
                ],
                "published": True,
                "is_system_page": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat(),
            },
        ]
        await db.pages.insert_many(pages)
        created["pages"] = len(pages)

    if existing_menus == 0:
        now_iso = datetime.now(timezone.utc).isoformat()
        menus = [
            {
                "id": str(uuid.uuid4()),
                "name": "header",
                "items": [
                    {
                        "id": str(uuid.uuid4()),
                        "label": {"en": "Home", "hr": "Naslovnica", "de": "Start"},
                        "url": "/",
                        "target": "_self",
                        "order": 0,
                        "visible": True,
                        "parent_id": None,
                        "children": [],
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "label": {"en": "Features", "hr": "Funkcionalnosti", "de": "Funktionen"},
                        "url": "/#features",
                        "target": "_self",
                        "order": 1,
                        "visible": True,
                        "parent_id": None,
                        "children": [],
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "label": {"en": "Pricing", "hr": "Cijene", "de": "Preise"},
                        "url": "/pricing",
                        "target": "_self",
                        "order": 2,
                        "visible": True,
                        "parent_id": None,
                        "children": [],
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "label": {"en": "Blog", "hr": "Blog", "de": "Blog"},
                        "url": "/blog",
                        "target": "_self",
                        "order": 3,
                        "visible": True,
                        "parent_id": None,
                        "children": [],
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "label": {"en": "About us", "hr": "O nama", "de": "Über uns"},
                        "url": "/about",
                        "target": "_self",
                        "order": 4,
                        "visible": True,
                        "parent_id": None,
                        "children": [],
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "label": {"en": "Contact", "hr": "Kontakt", "de": "Kontakt"},
                        "url": "/contact",
                        "target": "_self",
                        "order": 5,
                        "visible": True,
                        "parent_id": None,
                        "children": [],
                    },
                ],
                "created_at": now_iso,
                "updated_at": now_iso,
            },
            {
                "id": str(uuid.uuid4()),
                "name": "mobile",
                "items": [],
                "created_at": now_iso,
                "updated_at": now_iso,
            },
            {
                "id": str(uuid.uuid4()),
                "name": "footer",
                "items": [
                    {
                        "id": str(uuid.uuid4()),
                        "label": {"en": "Privacy Policy", "hr": "Politika privatnosti", "de": "Datenschutz"},
                        "url": "/privacy",
                        "target": "_self",
                        "order": 0,
                        "visible": True,
                        "parent_id": None,
                        "children": [],
                    },
                    {
                        "id": str(uuid.uuid4()),
                        "label": {"en": "Terms & Conditions", "hr": "Uvjeti korištenja", "de": "AGB"},
                        "url": "/terms",
                        "target": "_self",
                        "order": 1,
                        "visible": True,
                        "parent_id": None,
                        "children": [],
                    },
                ],
                "created_at": now_iso,
                "updated_at": now_iso,
            },
        ]
        await db.menus.insert_many(menus)
        created["menus"] = len(menus)

    return {"message": "Pages/menus seed executed", **created}


# ==================== HEALTH CHECK ====================

@api_router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        await db.command("ping")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
