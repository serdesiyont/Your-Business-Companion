 
from extensions import db



class Store(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    store_name = db.Column(db.String(32))
    address = db.Column(db.String) 
    phone_number = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) # Foreign key in Store
    user = db.relationship('User', backref=db.backref('stores', lazy=True))


    def to_dict(self):
        return {
            "id": self.id,
            "store_name": self.store_name,
            "address": self.address,
            "phone_number": self.phone_number,
            "user_id": self.user_id,
        }
