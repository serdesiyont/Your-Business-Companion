from datetime import datetime
from extensions import db

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    sale_date = db.Column(db.DateTime, nullable=False, default=datetime.now)
    sale_price = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) # Add user_id
    product = db.relationship('Product', backref=db.backref('sales', lazy=True))
    user = db.relationship('User', backref=db.backref('sales', lazy=True)) #add user relationship

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "sale_date": self.sale_date.isoformat(),
            "sale_price": self.sale_price,
            "user_id": self.user_id,
        }
