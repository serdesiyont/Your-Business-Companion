from extensions import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from sqlalchemy.orm import relationship

class Chat(db.Model):
    __tablename__ = 'chats'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Link to User model
    timestamp = Column(DateTime, default=datetime.utcnow)
    messages = relationship("ChatMessage", back_populates="chat")

    def __repr__(self):
        return f"<Chat(id={self.id}, user_id={self.user_id}, timestamp={self.timestamp})>"

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey('chats.id'), nullable=False)
    sender = Column(String(50), nullable=False)  # 'user' or 'agent'
    message = Column(String(1000), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    chat = relationship("Chat", back_populates="messages")

    def __repr__(self):
        return f"<ChatMessage(id={self.id}, chat_id={self.chat_id}, sender='{self.sender}', message='{self.message}', timestamp={self.timestamp})>"