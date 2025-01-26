import json
# import os
from flask import Flask, render_template, jsonify, session, redirect, request, url_for
from flask_session import Session
import pandas as pd


app = Flask(__name__)

# GeoJson for oil spills
@app.route('/data')
def get_data():
    # Read the data from data.geojson file
    with open('data.geojson') as file:
        data = file.read()

    return jsonify(data)
# Json
@app.route('/data_df')
def get_data_df():
    with open('data.json') as file:
        data = file.read()

    return jsonify(data)

@app.route('/spill_per_year')
def spill_per_year():
    # Read the data from data.geojson file
    with open('spills_per_year.json') as file:
        data = file.read()

    return jsonify(data)

# GeoJson for pipe routes
@app.route('/oil_pipelines')
def get_oil_pipes():
    # Read the data from data.geojson file
    with open('crude_oil_pipelines.geojson') as file:
        data = file.read()

    return jsonify(data)

@app.route('/gas_pipelines')
def get_gas_pipes():
    # Read the data from data.geojson file
    with open('nat_gas_pieplines.geojson') as file:
        data = file.read()

    return jsonify(data)


# MAIN DASHBOARD
@app.route('/')
def index():
    return render_template('map_dashboard.html')

# Charts
@app.route('/Charts')
def charts():
    return render_template('charts.html')


if __name__ == '__main__':
    app.run(debug=True)