import os
from flask import Flask, request, jsonify, render_template
import pandas as pd

app = Flask(__name__)

# Construct the file path for subjects.xlsx
EXCEL_FILE_PATH = os.path.join(os.path.dirname(__file__), 'subjects.xlsx')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_subjects', methods=['GET'])
def get_subjects():
    semester = request.args.get('semester')
    
    if semester:
        df = pd.read_excel(EXCEL_FILE_PATH, sheet_name=f'semester{semester}')
        subjects = df.to_dict(orient='records')
        return jsonify(subjects)
    
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)
