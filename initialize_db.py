import asyncio
import sys
import os
sys.path.append('/app/backend')

from server import categories_collection, products_collection, users_collection
from server import get_password_hash
import uuid
from datetime import datetime

async def initialize_database():
    print("🎮 Inizializzazione database Gaming E-commerce...")
    
    # Clear existing data
    categories_collection.delete_many({})
    products_collection.delete_many({})
    
    # Create categories
    categories = [
        {
            "id": str(uuid.uuid4()),
            "name": "Action",
            "description": "Giochi d'azione pieni di adrenalina",
            "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "RPG",
            "description": "Giochi di ruolo immersivi",
            "image_url": "https://images.unsplash.com/photo-1551884170-09fb5bfb0cc0?w=500"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Sports",
            "description": "Simulazioni sportive realistiche",
            "image_url": "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=500"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Racing",
            "description": "Giochi di corse ad alta velocità",
            "image_url": "https://images.unsplash.com/photo-1566149674460-c2d8c8cb9e12?w=500"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Adventure",
            "description": "Avventure epiche da esplorare",
            "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500"
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Strategy",
            "description": "Giochi di strategia e tattica",
            "image_url": "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500"
        }
    ]
    
    categories_collection.insert_many(categories)
    print(f"✅ Inserite {len(categories)} categorie")
    
    # Create sample products
    action_cat = next(c for c in categories if c["name"] == "Action")
    rpg_cat = next(c for c in categories if c["name"] == "RPG")
    sports_cat = next(c for c in categories if c["name"] == "Sports")
    racing_cat = next(c for c in categories if c["name"] == "Racing")
    adventure_cat = next(c for c in categories if c["name"] == "Adventure")
    strategy_cat = next(c for c in categories if c["name"] == "Strategy")
    
    products = [
        {
            "id": str(uuid.uuid4()),
            "title": "Cyberpunk 2077",
            "description": "Un RPG d'azione open world ambientato nella megalopoli di Night City, dove il potere, il lusso e le modifiche corporali sono tutto ciò che conta.",
            "price": 59.99,
            "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop",
            "category_id": action_cat["id"],
            "platform": ["PC", "PlayStation", "Xbox"],
            "genre": ["Action", "RPG", "Open World"],
            "rating": "M",
            "release_date": datetime(2020, 12, 10),
            "developer": "CD Projekt RED",
            "publisher": "CD Projekt",
            "in_stock": 50,
            "featured": True,
            "average_rating": 4.2,
            "total_reviews": 1250
        },
        {
            "id": str(uuid.uuid4()),
            "title": "The Witcher 3: Wild Hunt",
            "description": "Un RPG fantasy epico che ti porta in un mondo aperto ricco di avventure, mostri e scelte morali difficili.",
            "price": 39.99,
            "image_url": "https://images.unsplash.com/photo-1551884170-09fb5bfb0cc0?w=600&h=800&fit=crop",
            "category_id": rpg_cat["id"],
            "platform": ["PC", "PlayStation", "Xbox", "Nintendo"],
            "genre": ["RPG", "Fantasy", "Open World"],
            "rating": "M",
            "release_date": datetime(2015, 5, 19),
            "developer": "CD Projekt RED",
            "publisher": "CD Projekt",
            "in_stock": 75,
            "featured": True,
            "average_rating": 4.8,
            "total_reviews": 2840
        },
        {
            "id": str(uuid.uuid4()),
            "title": "FIFA 24",
            "description": "L'ultima iterazione del famoso simulatore di calcio con grafica migliorata e nuove modalità di gioco.",
            "price": 69.99,
            "image_url": "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600&h=800&fit=crop",
            "category_id": sports_cat["id"],
            "platform": ["PC", "PlayStation", "Xbox"],
            "genre": ["Sports", "Simulation", "Football"],
            "rating": "E",
            "release_date": datetime(2023, 9, 29),
            "developer": "EA Sports",
            "publisher": "Electronic Arts",
            "in_stock": 120,
            "featured": True,
            "average_rating": 4.1,
            "total_reviews": 890
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Gran Turismo 7",
            "description": "Il simulatore di guida definitivo con oltre 400 auto e circuiti iconici da tutto il mondo.",
            "price": 79.99,
            "image_url": "https://images.unsplash.com/photo-1566149674460-c2d8c8cb9e12?w=600&h=800&fit=crop",
            "category_id": racing_cat["id"],
            "platform": ["PlayStation"],
            "genre": ["Racing", "Simulation", "Cars"],
            "rating": "E",
            "release_date": datetime(2022, 3, 4),
            "developer": "Polyphony Digital",
            "publisher": "Sony Interactive",
            "in_stock": 35,
            "featured": True,
            "average_rating": 4.5,
            "total_reviews": 567
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Horizon Zero Dawn",
            "description": "Un'avventura post-apocalittica in un mondo dominato da macchine. Segui Aloy nella sua ricerca della verità.",
            "price": 49.99,
            "image_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&h=800&fit=crop",
            "category_id": adventure_cat["id"],
            "platform": ["PC", "PlayStation"],
            "genre": ["Adventure", "Action", "Open World"],
            "rating": "T",
            "release_date": datetime(2017, 2, 28),
            "developer": "Guerrilla Games",
            "publisher": "Sony Interactive",
            "in_stock": 60,
            "featured": True,
            "average_rating": 4.7,
            "total_reviews": 1890
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Age of Empires IV",
            "description": "Il ritorno della leggendaria serie strategica con battaglie epiche e campagne storiche.",
            "price": 59.99,
            "image_url": "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&h=800&fit=crop",
            "category_id": strategy_cat["id"],
            "platform": ["PC"],
            "genre": ["Strategy", "RTS", "Historical"],
            "rating": "T",
            "release_date": datetime(2021, 10, 28),
            "developer": "Relic Entertainment",
            "publisher": "Microsoft Studios",
            "in_stock": 45,
            "featured": True,
            "average_rating": 4.3,
            "total_reviews": 432
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Call of Duty: Modern Warfare II",
            "description": "L'ultima iterazione della famosa serie FPS con campagna single-player e multiplayer competitivo.",
            "price": 69.99,
            "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop",
            "category_id": action_cat["id"],
            "platform": ["PC", "PlayStation", "Xbox"],
            "genre": ["Action", "FPS", "Military"],
            "rating": "M",
            "release_date": datetime(2022, 10, 28),
            "developer": "Infinity Ward",
            "publisher": "Activision",
            "in_stock": 85,
            "featured": False,
            "average_rating": 4.0,
            "total_reviews": 1123
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Baldur's Gate 3",
            "description": "Un RPG basato su D&D con scelte narrative profonde e combattimento tattico a turni.",
            "price": 59.99,
            "image_url": "https://images.unsplash.com/photo-1551884170-09fb5bfb0cc0?w=600&h=800&fit=crop",
            "category_id": rpg_cat["id"],
            "platform": ["PC", "PlayStation"],
            "genre": ["RPG", "Fantasy", "Turn-based"],
            "rating": "M",
            "release_date": datetime(2023, 8, 3),
            "developer": "Larian Studios",
            "publisher": "Larian Studios",
            "in_stock": 70,
            "featured": False,
            "average_rating": 4.9,
            "total_reviews": 2156
        }
    ]
    
    products_collection.insert_many(products)
    print(f"✅ Inseriti {len(products)} prodotti")
    
    # Create admin user if not exists
    admin_exists = users_collection.find_one({"username": "admin"})
    if not admin_exists:
        admin_user = {
            "id": str(uuid.uuid4()),
            "username": "admin",
            "email": "admin@gamingstore.it",
            "full_name": "Amministratore",
            "hashed_password": get_password_hash("admin123"),
            "is_admin": True,
            "created_at": datetime.utcnow()
        }
        users_collection.insert_one(admin_user)
        print("✅ Creato utente amministratore (username: admin, password: admin123)")
    
    print("🎯 Database inizializzato con successo!")
    print("\n📋 Riepilogo:")
    print(f"   • {len(categories)} categorie")
    print(f"   • {len(products)} prodotti")
    print("   • 1 utente amministratore")
    print("\n🔑 Credenziali admin:")
    print("   • Username: admin")
    print("   • Password: admin123")

if __name__ == "__main__":
    asyncio.run(initialize_database())