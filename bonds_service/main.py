from __future__ import print_function
from flask import Flask, jsonify, Response, request
from flask_cors import CORS, cross_origin
from db_connector import DatabaseConnection
import random
import os
import sys

app = Flask(__name__)
CORS(app)



def generate_increasing_random_numbers(min_value, max_value, num_values):
    """Generates a list of increasing random numbers within a given range,
    distributing them more evenly.

    Args:
        min_value: The minimum value for the sequence.
        max_value: The maximum value for the sequence.
        num_values: The number of values to generate.

    Returns:
        A list of increasing random numbers.
    """

    if num_values <= 0:
        raise ValueError("Number of values must be positive.")

    numbers = [min_value]
    current_value = min_value
    remaining_range = max_value - min_value

    for _ in range(num_values - 1):
        remaining_values = num_values - len(numbers)
        max_increment = remaining_range / remaining_values
        increment = random.uniform(0, max_increment)
        current_value += increment
        numbers.append(current_value)
        remaining_range -= increment

    return numbers


@app.before_request
def basic_authentication():
    if request.method.lower() == 'options':
        return Response()


@app.route("/numbers")
def generate_random_numbers():
    # numbers = [random.uniform(0, 1000) for _ in range(30)]
    return jsonify(generate_increasing_random_numbers(0, 10, 30))

@app.route("/bonds")
def get_bonds():
    all_bonds = db_connection.get_all_bonds()
    app.logger.info(all_bonds)
    return jsonify(all_bonds)

@app.route('/bond', methods=['POST'])
def insert_bond():
    print('flush', flush=True)
    content_type = request.headers.get('Content-Type')
    if (content_type == 'application/json'):
        json = request.json
        app.logger.info(json)
    else:
        return 'Content-Type not supported!'
    data = request.get_json()
    bond_name = data.get('assetName')
    issuer = data.get('issuer')
    purchase_date = data.get('purchaseDate')
    quantity = data.get('quantity')
    purchase_price = data.get('purchase_price')

    if not all([bond_name, purchase_date, quantity]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        app.logger.info("Attempting to save bond")
        new_bond_id = db_connection.insert_new_bond(bond_name, issuer, purchase_date, quantity, purchase_price)
        if new_bond_id:
            return jsonify({'message': 'Bond inserted successfully', 'id': new_bond_id}), 201
        else:
            return jsonify({'error': 'Failed to insert bond'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == "__main__":
    db_config = {}
    db_config['database'] = os.environ.get('DATABASE_NAME')
    db_config['user'] = os.environ.get('DATABASE_USER')
    db_config['password'] = os.environ.get('DATABASE_PASSWORD')
    db_config['host'] = os.environ.get('DATABASE_HOST')
    db_config['port'] = os.environ.get('DATABASE_PORT', 5432)
    db_connection = DatabaseConnection(db_config)
    app.run(debug=True, host='0.0.0.0')
    # app.run(debug=True, host='0.0.0.0', port=6666)