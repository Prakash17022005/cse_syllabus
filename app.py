from flask import Flask, request, jsonify, render_template
import pandas as pd
import openpyxl

#flask app
app=Flask(__name__)

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

# ✅ NEW: Get elective by code
@app.route('/get_elective',methods=['GET'])
def get_elective():
    code=request.args.get('code')
    if not code:
        return jsonify({'error':'No subject code Provided'}),400
    
    try:
        df=pd.read_excel('static/subjects.xlsx',sheet_name='electives')
        subject=df[df['code'].str.upper()==code.upper()]
        if not subject.empty:
            return jsonify(subject.iloc[0].to_dict())
        else:
            return jsonify({'error':'subject not found'}),404
        
    except Exception as e:
        return jsonify({'error':str(e)}),500

if __name__ == '__main__':
    app.run(debug=True)