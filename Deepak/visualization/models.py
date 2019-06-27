from .app import db

class Table1(db.Model):
    __tablename__ = 'table1'

    id = db.Column(db.Integer, primary_key=True)
    MSA = db.Column(db.String)
    Year= db.Column(db.Integer)
    GDP_bn = db.Column(db.Float)
    Per_Capita_Income = db.Column(db.Float)
    Population_mn = db.Column(db.Float)
    Passengers_mn = db.Column(db.Float)
    Median_AQI = db.Column(db.Float)
    Good_Days_Percent = db.Column(db.Float)

    def __repr__(self):
        return '<Table1 %r>' % (self.name)



# class Pet(db.Model):
#     __tablename__ = 'pets'

#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(64))
#     lat = db.Column(db.Float)
#     lon = db.Column(db.Float)

#     def __repr__(self):
#         return '<Pet %r>' % (self.name)
