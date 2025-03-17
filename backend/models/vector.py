# from extensions import db
# from sqlalchemy import Column, Integer, ForeignKey
# from sqlalchemy.orm import relationship

# class Vector(db.Model):
#     __tablename__ = 'vectors'
#     id = Column(Integer, primary_key=True)
#     chat_message_id = Column(Integer, ForeignKey('chat_messages.id'), nullable=False)
#     chat_message = relationship("ChatMessage", backref="vector")

#     def __repr__(self):
#         return f"<Vector(id={self.id}, chat_message_id={self.chat_message_id})>"