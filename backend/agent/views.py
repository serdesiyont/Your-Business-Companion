from flask import Blueprint, request, jsonify
from agent.agent import ag
from models.chat import Chat, ChatMessage
from models.products import Product
from models.expense import Expense
from models.sale import Sale
from models.tax import Tax
from extensions import db
import os

from flask_jwt_extended import jwt_required, get_jwt_identity
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.document_loaders import TextLoader
import chromadb
from chromadb.config import Settings

from models.users import User

agent = Blueprint("agent", __name__)




@agent.route('/clean')
def clean_db():
    try:
        # db.session.query(Product).delete()
        # db.session.query(Tax).delete()
        # db.session.query(Sale).delete()
        # db.session.query(Expense).delete()
        db.session.query(User).delete()
        db.session.commit()
        return {"msg": "Cleaned"}

    except Exception as e:
        db.session.rollback()
        return {"msg": "Failed"}
    

# Initialize ChromaDB client
chroma_client = chromadb.PersistentClient(path="chroma_db", settings=Settings(allow_reset=True))  

def get_chroma_client():
    return chroma_client
 
# Initialize ChromaDB collection
collection_name = "ybc_chat_collection"
chroma_client = get_chroma_client()

# Initialize Google Gemini embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001") 

try:
    collection = Chroma(client=chroma_client, collection_name=collection_name, embedding_function=embeddings)
    print("Collection already exists")
except:
    collection = Chroma(client=chroma_client, collection_name=collection_name, embedding_function=embeddings)
    print("Creating collection")

def get_context(query, top_n=3):
    """
    Retrieves relevant context from ChromaDB based on the query using Langchain.
    """
    results = collection.similarity_search(query, k=top_n)
    return [doc.page_content for doc in results]





@agent.route('/chat', methods=["POST"])
# @jwt_required(locations=["cookies"])
def run_agent():
    data = request.get_json()
    user_id = 1
    user_message = data.get('message')

    print(user_id)

    if not user_id:
        return jsonify({"error": "No user ID provided"}), 400
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # 1. Create a new Chat object if one doesn't exist for this user
        chat = Chat.query.filter_by(user_id=user_id).first()
        if not chat:
            chat = Chat(user_id=user_id)
            db.session.add(chat)
            db.session.commit()  # Commit to get the chat.id

        # 2. Store the user message in the ChatMessage table
        user_chat_message = ChatMessage(chat_id=chat.id, sender='user', message=user_message)
        db.session.add(user_chat_message)
        db.session.commit()

        # 3. Retrieve context from ChromaDB
        context = get_context(user_message)
        context_string = "\n".join(context)

        # 4. Process the message with the agent, including context
        prompt = f"Context:\n{context_string}\n\nUser: {user_message}"
        response_message = ag(prompt, 1)

        # 5. Store the agent's response in the ChatMessage table
        agent_chat_message = ChatMessage(chat_id=chat.id, sender='agent', message=response_message)
        db.session.add(agent_chat_message)
        db.session.commit()

        # 6. Add the new message and response to ChromaDB
        collection.add_texts(
            texts=[user_message, response_message],
            metadatas=[{"chat_message_id": user_chat_message.id}, {"chat_message_id": agent_chat_message.id}],
            ids=[str(user_chat_message.id), str(agent_chat_message.id)]
        )

        # 7. Return the agent's response
        return jsonify({"response": response_message})

    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    