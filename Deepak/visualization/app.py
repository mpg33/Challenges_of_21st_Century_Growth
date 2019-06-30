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

SQLALCHEMY_TRACK_MODIFICATIONS = False

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "sqlite:///db/dbase.db"
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')

print('1')
db = SQLAlchemy(app)

print('2')
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
    Zillow_home_value_index = db.Column(db.Float)

    def __repr__(self):
        return '<Table1 %r>' % (self.name)

print('3')
# create route that renders form.html template
@app.route("/")
def index():
    return render_template("index_dup.html")



@app.route("/fetch")
def fetch():


            results = db.session.query(Table1.Year, Table1.MSA, Table1.GDP_bn, Table1.Per_Capita_Income, Table1.Population_mn, Table1.Passengers_mn, Table1.Median_AQI, Table1.Zillow_home_value_index).filter(Table1.Year <=2018).all()

            
            year = [result[0] for result in results]
            msa = [result[1] for result in results]
            gdp = [result[2] for result in results]
            pci = [result[3] for result in results]
            pop = [result[4] for result in results]
            pas = [result[5] for result in results]
            aqi = [result[6] for result in results]
            housing = [result[7] for result in results]
   

            data_msa =[]
            for i in range(len(year)):
                data_msa.append({"year":year[i], "msa":msa[i], "GDP":gdp[i], "PCI":pci[i], "pop":pop[i], "pas":pas[i], "aqi":aqi[i], "housing":housing[i]})
                print(msa[5])


            return (jsonify(data_msa))

@app.route("/filter_msa")
def filter_msa():

    msa_list = ['LA_MSA', 'SF_MSA', 'NY_MSA']
    chartData = []

    for msa_name in msa_list:

            results = db.session.query(Table1.Year, Table1.MSA, Table1.GDP_bn, Table1.Per_Capita_Income, Table1.Population_mn, Table1.Passengers_mn, Table1.Median_AQI).filter(Table1.MSA == msa_name).all()

            
            year = [result[0] for result in results]
            msa = [result[1] for result in results]
            gdp = [result[2] for result in results]
            pci = [result[3] for result in results]
            pop = [result[4] for result in results]
            pas = [result[5] for result in results]
            aqi = [result[6] for result in results]
   

            data_msa =[]
            for i in range(len(year)):
                data_msa.append({"year":year[i], "msa":msa[i], "GDP":gdp[i], "PCI":pci[i], "pop":pop[i], "pas":pas[i], "aqi":aqi[i]})
                print(msa[5])


            print(len(data_msa))
            chartData.append(data_msa)

    return (jsonify(chartData))


@app.route("/tomtom")
def tomtom():
    import requests
    from bs4 import BeautifulSoup

    url = "https://www.tomtom.com/en_gb/traffic-index/ranking/"
    response = requests.get(url)
    data = response.text
    soup = BeautifulSoup(data, "html.parser")

    # collect table data
    rows = soup.findAll(class_='RankingTable__table')[0].find("tbody").find_all("tr")

    # save city name and congestion table in a dictionary

    city =[]
    congestion =[]
    for row in rows:
        cells = row.find_all("td")
        city.append(cells[2].get_text())
        congestion.append(cells[4].get_text().split("%")[0])

    dict_city = dict(zip(city, congestion))

    myData = [{"LA": dict_city["Los Angeles"], "SF": dict_city["San Francisco"], "NY": dict_city["New York"] }]
    print(myData)

    return(jsonify(myData))






@app.route("/testing")
def testing():


    return render_template("testing.html")



if __name__ == "__main__":
    app.run()



