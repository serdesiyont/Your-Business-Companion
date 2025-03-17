from datetime import datetime
from extensions import db

class Tax(db.Model):
    __tablename__ = 'taxes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tax_rate = db.Column(db.Float, nullable=False)
    tax_amount = db.Column(db.Float, nullable=False)
    tax_date = db.Column(db.DateTime, nullable=False, default=datetime.now)
    description = db.Column(db.String(255))
    user = db.relationship('User', backref=db.backref('taxes', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'tax_rate': self.tax_rate,
            'tax_amount': self.tax_amount,
            'tax_date': self.tax_date.isoformat(),
            'description': self.description,
        }
    


 