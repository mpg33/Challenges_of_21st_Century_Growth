import werkzeug.security
from flask import render_template, redirect, url_for, flash, jsonify
from flask_bootstrap import Bootstrap
from story import app, db, models

import pandas as pd
import quandl

import plotly
import plotly.plotly as py
import plotly.graph_objs as go
from plotly import tools

import pandas as pd
import numpy as np
import json


Bootstrap(app)


@app.route("/maps")
def map_chart():
    return render_template('graphs.html')


print('3')
# create route that renders form.html template
@app.route("/")
def index():
    return render_template("index_dup.html")


@app.route('/table1')
def read_table1():
        dataset = models.Table1.query.all()
        return render_template('home.html', dataset=dataset)

@app.route("/fetch")
def fetch():


            results = db.session.query(models.Table1).filter(models.Table1.Year <=2018).all()

            year = [result.Year for result in results]
            msa = [result.MSA for result in results]
            gdp = [result.GDP_bn for result in results]
            pci = [result.Per_Capita_Income for result in results]
            pop = [result.Population_mn for result in results]
            pas = [result.Passengers_mn for result in results]
            aqi = [result.Median_AQI for result in results]
            housing = [result.Zillow_home_value_index for result in results]
   

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

            results = db.session.query(models.Table1).filter(models.Table1.MSA == msa_name).all()
            
            year = [result.Year for result in results]
            msa = [result.MSA for result in results]
            gdp = [result.GDP_bn for result in results]
            pci = [result.Per_Capita_Income for result in results]
            pop = [result.Population_mn for result in results]
            pas = [result.Passengers_mn for result in results]
            aqi = [result.Median_AQI for result in results]          

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



# ***********************************************

@app.route('/census')
@app.route('/census_map/<census_index>', methods=["GET", "POST"])
def census_map(census_index=None):
    
    msa_list = ['LA_MSA', 'SF_MSA', 'NY_MSA']
    LA_lon_lat = [34.058760,-118.229360]
    SF_lon_lat = [37.774929,-122.419418]
    NY_lon_lat = [40.712776,-74.005974]
    msa_geos = {'LA_MSA':LA_lon_lat, 'SF_MSA':SF_lon_lat, 'NY_MSA':NY_lon_lat}

    mapData = []

    for msa_name in msa_list:

            results = db.session.query(models.Census).filter(models.Census.Census_index == census_index).filter(models.Census.MSA == msa_name).all()
                        
            msa = [result.MSA for result in results]  
            indx = [result.Census_index for result in results] 
            year = [result.Year for result in results]
            value = [result.Index_Value for result in results] 
      
            data_msa =[]
            data_msa.append({"msa":msa[9], "indx":indx[9], "year":year[9], "value":value[9], "lon_lat": msa_geos[msa_name]})
            data_msa.append({"msa":msa[0], "indx":indx[0], "year":year[0], "value":value[0], "lon_lat": msa_geos[msa_name]})

            print(f"{len(data_msa)} values to add to the mapData dictionary")
            mapData.append(data_msa)

    return (jsonify(mapData))


@app.route('/census')
@app.route('/census/<census_index>')
def census(census_index=None):
    if census_index :
        census_data = db.session.query(models.Census).filter(models.Census.Census_index == census_index).all()
        census_title = "Census - " + census_index
    else :
        census_data = models.Census.query.all()
    
    LAx, LAy, NYx, NYy, SFx, SFy = [], [], [], [], [], []

    for n in census_data:
        if n.MSA == 'LA_MSA' :
            LAx.append(n.Year)
            LAy.append(n.Index_Value)
        if n.MSA == 'NY_MSA' :
            NYx.append(n.Year)
            NYy.append(n.Index_Value)
        if n.MSA == 'SF_MSA' :
            SFx.append(n.Year)
            SFy.append(n.Index_Value)

    scatter = create_scatter(LAx, LAy, NYx, NYy, SFx, SFy)
    bar = create_bar(LAx, LAy, NYx, NYy, SFx, SFy)

    my_dict = {"Source Data": "tab1", "Additional Charts": "tab2"}

    mapURL = '/census_map/'+census_index

    return render_template('census_data.html', title=census_title, census_data=census_data, plot1=scatter, plot2=bar, my_dict=my_dict, mapURL=mapURL)


@app.route('/add_census')
def add_census_data():

    print (f"{models.Census.query.count()} records to be deleted")

    db.session.query(models.Census).delete()
    db.session.commit()    

    print (f"{models.Census.query.count()} records in the Table")

    census_data = pd.read_csv('Data/final_v2.csv')
    db.session.bulk_insert_mappings(models.Census, census_data.to_dict(orient="records"))
    db.session.commit()
    return redirect(url_for('census/GDP_bn'))

@app.route('/add_table1')
def add_table1_data():

    print (f"{models.Table1.query.count()} records to be deleted")

    db.session.query(models.Table1).delete()
    db.session.commit()  

    census_data = pd.read_csv('Data/final.csv')
    db.session.bulk_insert_mappings(models.Table1, census_data.to_dict(orient="records"))
    db.session.commit()
    return redirect(url_for('zillow'))    


@app.route('/zillow')
@app.route('/zillow/<zillow_code>')
def zillow(zillow_code = None):
    if zillow_code :
        dataset = db.session.query(models.Housing).filter(models.Housing.Zillow_code == zillow_code).all()
        title = "Zillow - " + zillow_code
    else :
        title = "Zillow"
        dataset = models.Housing.query.all()

    LAx, LAy, NYx, NYy, SFx, SFy = [], [], [], [], [], []

    for n in dataset:
        if n.MSA == 'LA_MSA' :
            LAx.append(n.Date)
            LAy.append(n.Value)
        if n.MSA == 'NY_MSA' :
            NYx.append(n.Date)
            NYy.append(n.Value)
        if n.MSA == 'SF_MSA' :
            SFx.append(n.Date)
            SFy.append(n.Value)

    scatter = create_scatter(LAx, LAy, NYx, NYy, SFx, SFy)
    bar = create_bar(LAx, LAy, NYx, NYy, SFx, SFy)

    my_dict = {"Detail Chart": "tab1", "Source Data": "tab2"}

#    return render_template('zillow_indexes.html', title=title, dataset=dataset, plot1=scatter, plot2=bar, my_dict=my_dict)

    return render_template('census_data.html', title=title, census_data=dataset, plot1=scatter, plot2=bar, my_dict=my_dict)    

@app.route('/add_zillow')
def add_records_zillow():

    print (f"{models.Housing.query.count()} records to be deleted")

    db.session.query(models.Housing).delete()
    db.session.commit()    

    print (f"{models.Housing.query.count()} records in the Table")

    quandl.ApiConfig.api_key = 'Tx8GhHmntW9csEbtjmH_'

    metro_names = ['LA_MSA', 'SF_MSA', 'NY_MSA']
    metro_codes = ['M436', 'M1047', 'M1105']
    zillow_codes = ['ZRIAH', 'ZHVIAH', 'PHIVAH', 'PHDVAH']
    descriptions = ['Zillow Rental Index - All Homes', 'Zillow Home Value Index - All Homes', 'Percent Of Homes Increasing In Values', 'Percent Of Homes Decreasing Values']

    for z in range(len(zillow_codes)) :
        print(f"Starting index: {descriptions[z]}")
        for m in range(len(metro_codes)) :
            file_name = f"ZILLOW/{metro_codes[m]}_{zillow_codes[z]}"
            quandl_DF = quandl.get(file_name)
            quandl_DF['MSA'] = metro_names[m]
            quandl_DF['Zillow_code'] = zillow_codes[z]
            quandl_DF['Description'] = descriptions[z]
            quandl_DF.reset_index(inplace=True)
            db.session.bulk_insert_mappings(models.Housing, quandl_DF.to_dict(orient="records"))
            db.session.commit()
            print(f"Completing metro name: {metro_names[m]}")

# Additional loop for non standardized names            
    zillow_codes = ['IMP']
    descriptions = ['Inventory Measure (Public)']
    file_names = ['ZILLOW/M436_IMP', 'ZILLOW/M11_IMP', 'ZILLOW/M2_IMP']

    for z in range(len(zillow_codes)) :
        print(f"Starting index: {descriptions[z]}")
        for m in range(len(metro_codes)) :
            file_name = file_names[m]
            quandl_DF = quandl.get(file_name)
            quandl_DF['MSA'] = metro_names[m]
            quandl_DF['Zillow_code'] = zillow_codes[z]
            quandl_DF['Description'] = descriptions[z]
            quandl_DF.reset_index(inplace=True)
            db.session.bulk_insert_mappings(models.Housing, quandl_DF.to_dict(orient="records"))
            db.session.commit()
            print(f"Completing metro name: {metro_names[m]}")

    print (f"{models.Housing.query.count()} records inserted to the Housing Table")
    return redirect(url_for('zillow'))


@app.route('/d3')
def d3_chart():
    return render_template('D3_chart.html')

@app.route('/add_d3')
def add_d3_data():
    d3_data = pd.read_csv('Data/norway_medals.csv')
    d3_json = d3_data.to_json(orient='records')
    return (d3_json)


def create_scatter(LAx, LAy, NYx, NYy, SFx, SFy):
    # Create traces
    trace0 = go.Scatter(
        x = LAx,
        y = LAy,
        mode = 'lines+markers',
        name = 'LA_MSA'
    )

    trace1 = go.Scatter(
        x = NYx,
        y = NYy,
        mode = 'lines',
        name = 'NY_MSA'
    )
    trace2 = go.Scatter(
        x = SFx,
        y = SFy,
        mode = 'lines',
        name = 'SF_MSA'
    )
    data = [trace0, trace1, trace2]
    graphJSON = json.dumps(data, cls=plotly.utils.PlotlyJSONEncoder)
    return graphJSON

def create_bar(LAx, LAy, NYx, NYy, SFx, SFy):
    # Create Bar Charts
    bar0 = go.Bar(
        y = LAx,
        x = LAy,
        name = 'LA_MSA',
        marker=dict(
            color='rgba(50, 171, 96, 0.6)',
            line=dict(
                color='rgba(50, 171, 96, 1.0)',
                width=1),
        ),
        orientation='h',
    )

    bar1 = go.Bar(
        y = NYx,
        x = NYy,
        name = 'NY_MSA',
        marker=dict(
            color='rgba(50, 171, 96, 0.6)',
            line=dict(
                color='rgba(50, 171, 96, 1.0)',
                width=1),
        ),
        orientation='h',
    )

    bar2 = go.Bar(
        y = SFx,
        x = SFy,
        name = 'SF_MSA',
        marker=dict(
            color='rgba(50, 171, 96, 0.6)',
            line=dict(
                color='rgba(50, 171, 96, 1.0)',
                width=1),
        ),
        orientation='h',
    )

    layout = dict(
        title='Census indicator ....',
        yaxis=dict(
            showgrid=False,
            showline=False,
            showticklabels=True,
            domain=[0, 0.85],
        ),
        yaxis2=dict(
            showgrid=False,
            showline=True,
            showticklabels=False,
            linecolor='rgba(102, 102, 102, 0.8)',
            linewidth=2,
            domain=[0, 0.85],
        ),
        xaxis=dict(
            zeroline=False,
            showline=False,
            showticklabels=True,
            showgrid=True,
            domain=[0, 0.42],
        ),
        xaxis2=dict(
            zeroline=False,
            showline=False,
            showticklabels=True,
            showgrid=True,
            domain=[0.47, 1],
            side='top',
            dtick=25000,
        ),
        legend=dict(
            x=0.029,
            y=1.038,
            font=dict(
                size=10,
            ),
        ),
        margin=dict(
            l=100,
            r=20,
            t=70,
            b=70,
        ),
        paper_bgcolor='rgb(248, 248, 255)',
        plot_bgcolor='rgb(248, 248, 255)',
    )

    annotations = []


    # Source
    annotations.append(dict(xref='paper', yref='paper',
                            x=-0.2, y=-0.109,
                            text='OECD "' +
                                '(2015), Census .... (indicator), ' +
                                '(Accessed on 22 June 2019)',
                            font=dict(family='Arial', size=10,
                                    color='rgb(150,150,150)'),
                            showarrow=False))

    layout['annotations'] = annotations

    # Creating two subplots
    fig = tools.make_subplots(rows=1, cols=3, specs=[[{}, {}, {}]], shared_xaxes=True,
                            shared_yaxes=False, vertical_spacing=0.001)

    fig.append_trace(bar0, 1, 1)
    fig.append_trace(bar1, 1, 2)
    fig.append_trace(bar1, 1, 3)


    fig['layout'].update(layout)

    graphJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    return graphJSON

@app.route('/bar', methods=['GET', 'POST'])
def change_features():

    feature = request.args['selected']
    graphJSON= create_plot(feature)

    return graphJSON




#    return redirect(url_for('images'))



if __name__ == '__main__':
    app.run(debug=True)

