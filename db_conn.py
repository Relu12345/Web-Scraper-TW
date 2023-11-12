import bson
import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

load_dotenv()
connection_string: str = os.environ.get('CONNECTION_STRING')
mongo_client: MongoClient = MongoClient(connection_string)


database: Database = mongo_client.get_database('TWdata')
collection: Collection = database.get_collection('history')


'''user1 = {
    "user_name": "name",
    "favourites": [
        {
            "item_id": "1",
            "text": "seb stefa"
        },
        {
            "item_id": "2",
            "text": "flore flo"
        }
    ]
}

collection.insert_one(user1)
collection.insert_one(user2)'''