from flask import Flask, request, jsonify, render_template
import pandas as pd
from flask_cors import CORS


#flask app
app=Flask(__name__)
CORS(app)
#route to app
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_subjects',methods=['GET'])
def get_subjects():
    
    semester=request.args.get('semester')
    
    if semester:
        
        df=pd.read_excel('static/subjects.xlsx',sheet_name=f'semester{semester}')
        
        subjects=df.to_dict(orient='records')
        
        return jsonify(subjects)
    
    return jsonify([])

if __name__ == '__main__':
    app.run(debug=True)