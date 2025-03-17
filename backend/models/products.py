from extensions import db

class Product(db.Model):
    __tablename__="products"
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    initial_stock = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) # Foreign key in Product
    user = db.relationship('User', backref=db.backref('products', lazy=True))


    def to_dict(self):
        return {
            "id": self.id,
            "product_name": self.product_name,
            "description": self.description,
            "initial_stock": self.initial_stock,
            "price": self.price,
            "category": self.category,
            "user_id": self.user_id,
        }