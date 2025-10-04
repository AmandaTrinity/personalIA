from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

uri = os.getenv("MONGO_URI", "mongodb+srv://personalai_db:T10ZcHL5x9wn4jnP@personalai.yjh0ebs.mongodb.net/?retryWrites=true&w=majority&appName=personalai")

client = MongoClient(uri, server_api=ServerApi('1'))
db = client["personal_ai_db"]

# Test connection
try:
    client.admin.command('ping')
    print("✅ MongoDB connection successful!")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
