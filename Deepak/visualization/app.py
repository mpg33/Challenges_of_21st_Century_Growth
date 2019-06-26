# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

import json


app = Flask(__name__)

from flask_sqlalchemy import SQLAlchemy

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db/dbase.db"
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')

db = SQLAlchemy(app)

# from .models import Table1
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


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")



@app.route("/gdp")
def gdp():
    results = db.session.query(Table1.Year, Table1.GDP_bn).filter(Table1.MSA == "LA_MSA").all()

    
    year = [result[0] for result in results]
    gdp = [result[1] for result in results]
    

    gdp_data =[]
    for i in range(len(year)):
        gdp_data.append({"year":year[i], "GDP":gdp[i]})


    return jsonify(gdp_data)


    # gdp_data = [{
        
    #     "year": year,
    #     "GDP": gdp,
           
    # }]

    # return jsonify(gdp_data)

@app.route("/PCI")
def per_capita_income():
    results = db.session.query(Table1.Year, Table1.Per_Capita_Income).filter(Table1.MSA == "LA_MSA").all()

    
    year = [result[0] for result in results]
    pci = [result[1] for result in results]
    

    pci_data =[]
    for i in range(len(year)):
        pci_data.append({"year":year[i], "Per_Capita_Income":pci[i]})


    return jsonify(pci_data)


    # pci_data = [{
        
    #     "year": year,
    #     "Per_Capita_Income": pci,
           
    # }]

    # return jsonify(pci_data)

@app.route("/population")
def population():
    results = db.session.query(Table1.Year, Table1.Population_mn).filter(Table1.MSA == "LA_MSA").all()

    
    year = [result[0] for result in results]
    pop = [result[1] for result in results]
    

    pop_data =[]
    for i in range(len(year)):
        pop_data.append({"year":year[i], "Population_mn":pop[i]})

    return jsonify(pop_data)


    # pop_data = [{
        
    #     "year": year,
    #     "GDP": pop,
           
    # }]

    # return jsonify(pop_data)

@app.route("/air_passengers")
def air_passengers():
    results = db.session.query(Table1.Year, Table1.Passengers_mn).filter(Table1.MSA == "LA_MSA").all()

    
    year = [result[0] for result in results]
    passengers = [result[1] for result in results]
    

    passsenger_data =[]
    for i in range(len(year)):
        passenger_data.append({"year":year[i], "Passengers_mn":passengers[i]})

    return jsonify(passenger_data)


    # gdp_data1 = [{
        
    #     "year": year,
    #     "GDP": gdp,
           
    # }]

    # return jsonify(gdp_data)

@app.route("/airQ")
def airQ():
    results = db.session.query(Table1.Year, Table1.Good_Days_Percent).filter(Table1.MSA == "LA_MSA").all()

    
    year = [result[0] for result in results]
    good_days = [result[1] for result in results]
    

    good_days_data =[]
    for i in range(len(year)):
        good_days_data.append({"year":year[i], "Good_Days_Percent":good_days[i]})
        print(good_days_data)

    return jsonify(good_days_data)


    # good_days_data = [{
        
    #     "year": year,
    #     "Good_Days_Percent": good_days,
           
    # }]

    # return jsonify(good_days_data)


if __name__ == "__main__":
    app.run()
