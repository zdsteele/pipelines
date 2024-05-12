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
    # Read the data from data.geojson file
    with open('data.json') as file:
        data = file.read()

    return jsonify(data)

# GeoJson for pipe routes
@app.route('/data_pipes')
def get_data_pipes():
    # Read the data from data.geojson file
    with open('nat_gas_pieplines.geojson') as file:
        data = file.read()

    return jsonify(data)

# MAIN DASHBOARD
@app.route('/')
def index():
    return render_template('map_dashboard.html')


if __name__ == '__main__':
    app.run(debug=True)