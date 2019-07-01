from story import app, db

from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash



db.create_all()

class Housing(db.Model):
    __tablename__ = 'Housing'

    id = db.Column(db.Integer, primary_key=True)
    Date = db.Column(db.String)
    Value = db.Column(db.Float)
    MSA = db.Column(db.String)
    Zillow_code = db.Column(db.String)
    Description = db.Column(db.String)

    def __repr__(self):
        return "<Date='%s', Value='%s', MSA='%s', Zillow_code='%s', Description='%s'>" % (self.Date, self.Value, self.MSA, self.Zillow_code, self.Description)


class Census(db.Model):
    __tablename__ = 'Census'

    id = db.Column(db.Integer, primary_key=True)
    Census_index = db.Column(db.String)
    MSA = db.Column(db.String)
    Year = db.Column(db.Integer)
    Index_Value = db.Column(db.Float)

    def __repr__(self):
        return "(Census_index='%s', MSA='%s', Year='%s', Index_value='%s')" % (self.Census_index, self.MSA, self.Year, self.Index_Value)


class Table1(db.Model):
    __tablename__ = 'Table1'

    id = db.Column(db.Integer, primary_key=True)
    MSA = db.Column(db.String)
    Year= db.Column(db.Integer)
    GDP_bn = db.Column(db.Float)
    Per_Capita_Income = db.Column(db.Float)
    Population_mn = db.Column(db.Float)
    Passengers_mn = db.Column(db.Float)
    Median_AQI = db.Column(db.Float)
    Good_Days_Percent = db.Column(db.Float)
    Zillow_home_value_index = db.Column(db.Float)

    def __repr__(self):
        return '<Table1 %r>' % (self.name)        
